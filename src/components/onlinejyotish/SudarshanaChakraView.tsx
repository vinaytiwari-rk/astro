import React, { useMemo, useState } from 'react';
import { Compass, Sparkles, Clock, ChevronLeft, ChevronRight, Info } from 'lucide-react';
import type { ChartData, CalcSettings } from '../../astro/types';
import { computeSudarshanaChakra, type SudarshanaWheelResult } from '../../astro/advancedDashas';
import { useLanguage } from '../../i18n/LanguageContext';
import { trPlanet, trSign } from '../../i18n/translations';
import { SIGNS } from '../../astro/constants';

interface SudarshanaChakraViewProps {
  chart: ChartData;
  settings?: CalcSettings;
  onNavigate?: (view: string) => void;
}

export const SudarshanaChakraView: React.FC<SudarshanaChakraViewProps> = ({
  chart,
  onNavigate,
}) => {
  const { lang } = useLanguage();
  const isHi = lang === 'hi';

  const birthYear = parseInt(chart.input.date.slice(0, 4), 10) || 1990;
  const currentYear = new Date().getFullYear();
  const initialAge = Math.max(1, currentYear - birthYear + 1);

  const [selectedAge, setSelectedAge] = useState<number>(initialAge);

  const targetYear = birthYear + selectedAge - 1;
  const result: SudarshanaWheelResult = useMemo(() => {
    return computeSudarshanaChakra(chart, targetYear);
  }, [chart, targetYear]);

  return (
    <div style={{ padding: '24px', maxWidth: '1280px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '20px' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 12px',
            borderRadius: '9999px',
            background: 'rgba(217, 119, 6, 0.12)',
            color: '#b45309',
            fontSize: '11.5px',
            fontWeight: 700,
            textTransform: 'uppercase',
            marginBottom: '8px',
            border: '1px solid rgba(217, 119, 6, 0.3)',
          }}
        >
          <Compass size={13} />
          {isHi ? 'महर्षि पाराशर प्रणीत त्रिकुंडली चक्र' : 'Parasara 3-in-1 Triple Concentric Wheel'}
        </div>
        <h1 style={{ margin: '0 0 6px', fontSize: '24px', fontFamily: 'Cinzel, Playfair Display, serif', color: 'var(--text)' }}>
          {isHi ? 'सुदर्शन चक्र (Sudarshana Chakra 3-in-1)' : 'Sudarshana Chakra 3-in-1 Analysis'}
        </h1>
        <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-muted)', maxWidth: '780px', lineHeight: '1.5' }}>
          {isHi
            ? 'लग्न (शारीरिक स्थिति), चंद्र (मानसिक अवस्था) एवं सूर्य (आत्मिक व कार्य बल) तीनों को एक साथ संकेंद्रित वृत्तों में रखकर प्रत्येक वर्ष का फलकथन। महर्षि पाराशर के अनुसार जब तीनों चक्रों से एक ही फल की पुष्टि हो, तभी घटना अकाट्य होती है।'
            : 'Concentric tri-wheel evaluation combining Lagna (body/health), Moon (mind/domestic), and Sun (career/vitality) to forecast any specific year of life.'}
        </p>
      </div>

      {/* Interactive Year & Age Controller */}
      <div
        className="oj-card"
        style={{
          padding: '16px 20px',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '14px',
          background: 'rgba(254, 243, 199, 0.35)',
          border: '1px solid rgba(217, 119, 6, 0.3)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            type="button"
            className="oj-action-btn secondary"
            onClick={() => setSelectedAge((prev) => Math.max(1, prev - 1))}
            style={{ padding: '6px 12px' }}
          >
            <ChevronLeft size={14} /> {isHi ? 'पूर्व वर्ष' : 'Prev Year'}
          </button>
          <div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: '#b45309' }}>
              {isHi ? `आयु वर्ष: ${selectedAge}वां वर्ष` : `Running Age: Year ${selectedAge}`}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              {isHi ? `ईसवी वर्ष: ${targetYear} (जन्म: ${birthYear})` : `Calendar Year: ${targetYear} (Birth: ${birthYear})`}
            </div>
          </div>
          <button
            type="button"
            className="oj-action-btn secondary"
            onClick={() => setSelectedAge((prev) => Math.min(100, prev + 1))}
            style={{ padding: '6px 12px' }}
          >
            {isHi ? 'अगला वर्ष' : 'Next Year'} <ChevronRight size={14} />
          </button>
        </div>

        {/* Age Slider */}
        <div style={{ flex: '1', minWidth: '220px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '12px', fontWeight: 600 }}>1 Y</span>
          <input
            type="range"
            min="1"
            max="100"
            value={selectedAge}
            onChange={(e) => setSelectedAge(parseInt(e.target.value, 10))}
            style={{ flex: 1, accentColor: '#b45309', cursor: 'pointer' }}
          />
          <span style={{ fontSize: '12px', fontWeight: 600 }}>100 Y</span>
        </div>

        {selectedAge === initialAge && (
          <span style={{ padding: '4px 10px', borderRadius: '9999px', background: '#b45309', color: '#fff', fontSize: '11px', fontWeight: 700 }}>
            {isHi ? 'वर्तमान चालू वर्ष' : 'Current Year'}
          </span>
        )}
      </div>

      {/* Main Two-Col: Concentric Chakra SVG + Interpretation Card */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: '20px', alignItems: 'start' }}>
        {/* Left: Interactive 3-Concentric Ring Chakra SVG */}
        <div className="oj-card" style={{ padding: '20px', textAlign: 'center' }}>
          <h3 style={{ margin: '0 0 14px', fontSize: '16px', color: 'var(--text)' }}>
            {isHi ? 'सुदर्शन त्रिवृत्त चक्र (Concentric Rings)' : 'Concentric Tri-Wheel Display'}
          </h3>

          <div style={{ position: 'relative', maxWidth: '320px', width: '100%', margin: '0 auto', aspectRatio: '1/1' }}>
            <svg viewBox="0 0 320 320" style={{ width: '100%', height: '100%' }}>
              {/* Outer Ring: Lagna */}
              <circle cx="160" cy="160" r="145" fill="none" stroke="#b45309" strokeWidth="2.5" />
              <circle cx="160" cy="160" r="105" fill="rgba(217, 119, 6, 0.04)" stroke="#d97706" strokeWidth="1.5" />
              {/* Middle Ring: Moon */}
              <circle cx="160" cy="160" r="70" fill="rgba(59, 130, 246, 0.04)" stroke="#2563eb" strokeWidth="1.5" />
              {/* Center Ring: Sun / Soul */}
              <circle cx="160" cy="160" r="35" fill="rgba(245, 158, 11, 0.15)" stroke="#f59e0b" strokeWidth="1.5" />

              {/* Cross Spokes */}
              <line x1="160" y1="15" x2="160" y2="305" stroke="rgba(217, 119, 6, 0.25)" strokeDasharray="3 3" />
              <line x1="15" y1="160" x2="305" y2="160" stroke="rgba(217, 119, 6, 0.25)" strokeDasharray="3 3" />

              {/* Center Om Symbol & Age */}
              <text x="160" y="156" textAnchor="middle" fill="#b45309" fontSize="18" fontWeight="bold">ॐ</text>
              <text x="160" y="172" textAnchor="middle" fill="var(--text)" fontSize="11" fontWeight="bold">Age {selectedAge}</text>

              {/* Labels for rings */}
              <text x="160" y="32" textAnchor="middle" fill="#b45309" fontSize="11" fontWeight="700">
                L: {result.lagnaSign} (H{result.lagnaHouse})
              </text>
              <text x="160" y="72" textAnchor="middle" fill="#2563eb" fontSize="10.5" fontWeight="700">
                M: {result.moonSign} (H{result.moonHouse})
              </text>
              <text x="160" y="105" textAnchor="middle" fill="#d97706" fontSize="10" fontWeight="700">
                S: {result.sunSign} (H{result.sunHouse})
              </text>
            </svg>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', marginTop: '12px', fontSize: '11.5px' }}>
            <span style={{ color: '#b45309', fontWeight: 600 }}>● बाह्य: लग्न चक्र</span>
            <span style={{ color: '#2563eb', fontWeight: 600 }}>● मध्य: चंद्र चक्र</span>
            <span style={{ color: '#d97706', fontWeight: 600 }}>● आंतरिक: सूर्य चक्र</span>
          </div>
        </div>

        {/* Right: Detailed 3-Chakra Annual Synthesis */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Card 1: Lagna Progression */}
          <div style={{ background: 'var(--bg-elevated)', borderRadius: '12px', border: '1px solid var(--border)', padding: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <span style={{ fontSize: '13px', fontWeight: 700, color: '#b45309' }}>
                1. लग्न चक्र वर्ष प्रभाव (Lagna Progression)
              </span>
              <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '4px', background: 'rgba(217, 119, 6, 0.12)', color: '#b45309', fontWeight: 600 }}>
                {result.lagnaSign} · भाव {result.lagnaHouse}
              </span>
            </div>
            <p style={{ margin: 0, fontSize: '12.5px', color: 'var(--text-muted)', lineHeight: '1.5' }}>
              {isHi
                ? `इस वर्ष लग्न चक्र के अनुसार ${result.lagnaHouse}वां भाव (${result.lagnaSign}) सक्रिय है। ` +
                  (result.lagnaOccupants.length > 0 ? `सक्रिय ग्रह: ${result.lagnaOccupants.join(', ')}। शारीरिक ऊर्जा, स्वास्थ्य एवं वातावरण पर इनका मुख्य प्रभाव रहेगा।` : 'यह भाव प्राकृतिक रूप से शांत व नियमित गतिविधियों का समर्थन करता है।')
                : `Year active from Lagna is House ${result.lagnaHouse} (${result.lagnaSign}). Occupants: ${result.lagnaOccupants.join(', ') || 'None'}. Dictates physical health and immediate environment.`}
            </p>
          </div>

          {/* Card 2: Moon Progression */}
          <div style={{ background: 'var(--bg-elevated)', borderRadius: '12px', border: '1px solid var(--border)', padding: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <span style={{ fontSize: '13px', fontWeight: 700, color: '#2563eb' }}>
                2. चंद्र चक्र वर्ष प्रभाव (Chandra Progression)
              </span>
              <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '4px', background: 'rgba(59, 130, 246, 0.12)', color: '#2563eb', fontWeight: 600 }}>
                {result.moonSign} · भाव {result.moonHouse}
              </span>
            </div>
            <p style={{ margin: 0, fontSize: '12.5px', color: 'var(--text-muted)', lineHeight: '1.5' }}>
              {isHi
                ? `चंद्र कुंडली से ${result.moonHouse}वां भाव (${result.moonSign}) सक्रिय है। ` +
                  (result.moonOccupants.length > 0 ? `सक्रिय ग्रह: ${result.moonOccupants.join(', ')}। मानसिक शांति, घरेलू सुख एवं पारिवारिक संबंधों में मुख्य भूमिका।` : 'मानसिक एकाग्रता एवं भावनात्मक स्थिरता बनी रहेगी।')
                : `Active from Moon is House ${result.moonHouse} (${result.moonSign}). Occupants: ${result.moonOccupants.join(', ') || 'None'}. Governs psychological harmony and domestic happiness.`}
            </p>
          </div>

          {/* Card 3: Sun Progression */}
          <div style={{ background: 'var(--bg-elevated)', borderRadius: '12px', border: '1px solid var(--border)', padding: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <span style={{ fontSize: '13px', fontWeight: 700, color: '#d97706' }}>
                3. सूर्य चक्र वर्ष प्रभाव (Surya Progression)
              </span>
              <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '4px', background: 'rgba(245, 158, 11, 0.12)', color: '#d97706', fontWeight: 600 }}>
                {result.sunSign} · भाव {result.sunHouse}
              </span>
            </div>
            <p style={{ margin: 0, fontSize: '12.5px', color: 'var(--text-muted)', lineHeight: '1.5' }}>
              {isHi
                ? `सूर्य कुंडली से ${result.sunHouse}वां भाव (${result.sunSign}) सक्रिय है। ` +
                  (result.sunOccupants.length > 0 ? `सक्रिय ग्रह: ${result.sunOccupants.join(', ')}। कार्यक्षेत्र, पद-प्रतिष्ठा, आत्मबल एवं सामाजिक प्रभाव का निर्धारण।` : 'आत्मविश्वास एवं सामाजिक साख सुदृढ़ रहेगी।')
                : `Active from Sun is House ${result.sunHouse} (${result.sunSign}). Occupants: ${result.sunOccupants.join(', ') || 'None'}. Determines vitality, career prestige, and authoritative influence.`}
            </p>
          </div>

          {/* Combined Parasara Synthesis */}
          <div
            style={{
              background: 'rgba(254, 243, 199, 0.45)',
              borderRadius: '12px',
              border: '2px solid #b45309',
              padding: '16px',
            }}
          >
            <h4 style={{ margin: '0 0 6px', fontSize: '14px', color: '#92400e', fontWeight: 700 }}>
              {isHi ? 'महर्षि पाराशर वार्षिक समन्वय फलादेश' : 'Synthesized Parasara Annual Verdict'}
            </h4>
            <p style={{ margin: 0, fontSize: '13px', color: 'var(--text)', lineHeight: '1.5' }}>
              {result.synthesis}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
