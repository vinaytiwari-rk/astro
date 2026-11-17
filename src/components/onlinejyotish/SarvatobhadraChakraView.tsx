import React, { useState, useMemo } from 'react';
import type { ChartData } from '../../astro/types';
import {
  computeSarvatobhadraChakra,
  computeKotaChakra,
  computeKurmaChakra,
  type SarvatobhadraData,
  type KotaChakraData,
  type KurmaChakraData,
} from '../../astro/specialChakras';
import { useLanguage } from '../../i18n/LanguageContext';
import { trPlanet } from '../../i18n/translations';
import { Shield, Compass, Grid, AlertTriangle, CheckCircle, RefreshCw, Printer } from 'lucide-react';

interface SarvatobhadraChakraViewProps {
  chart: ChartData;
  onNavigate?: (view: string) => void;
}

// 9x9 Sarvatobhadra layout definition according to classical Phaladeepika & Narapatijayacharya
const SBC_GRID_9X9: Array<Array<{ text: string; sub?: string; type: 'nakshatra' | 'swara' | 'varna' | 'rashi' | 'tithi' | 'center' }>> = [
  // Row 1 (Top rim: Krittika to Ashlesha)
  [
    { text: 'अ', type: 'swara' },
    { text: 'कृत्तिका', sub: 'Krittika', type: 'nakshatra' },
    { text: 'रोहिणी', sub: 'Rohini', type: 'nakshatra' },
    { text: 'मृगशिरा', sub: 'Mriga', type: 'nakshatra' },
    { text: 'आर्द्रा', sub: 'Ardra', type: 'nakshatra' },
    { text: 'पुनर्वसु', sub: 'Punarvasu', type: 'nakshatra' },
    { text: 'पुष्य', sub: 'Pushya', type: 'nakshatra' },
    { text: 'आश्लेषा', sub: 'Ashlesha', type: 'nakshatra' },
    { text: 'आ', type: 'swara' },
  ],
  // Row 2
  [
    { text: 'भरणी', sub: 'Bharani', type: 'nakshatra' },
    { text: 'इ', type: 'swara' },
    { text: 'क', type: 'varna' },
    { text: 'ख', type: 'varna' },
    { text: 'ग', type: 'varna' },
    { text: 'घ', type: 'varna' },
    { text: 'ङ', type: 'varna' },
    { text: 'ई', type: 'swara' },
    { text: 'मघा', sub: 'Magha', type: 'nakshatra' },
  ],
  // Row 3
  [
    { text: 'अश्विनी', sub: 'Ashwini', type: 'nakshatra' },
    { text: 'च', type: 'varna' },
    { text: 'उ', type: 'swara' },
    { text: 'मेष', sub: 'Aries', type: 'rashi' },
    { text: 'वृष', sub: 'Taurus', type: 'rashi' },
    { text: 'मिथुन', sub: 'Gemini', type: 'rashi' },
    { text: 'ऊ', type: 'swara' },
    { text: 'छ', type: 'varna' },
    { text: 'पूर्वा फाल्गुनी', sub: 'P.Phal', type: 'nakshatra' },
  ],
  // Row 4
  [
    { text: 'रेवती', sub: 'Revati', type: 'nakshatra' },
    { text: 'ज', type: 'varna' },
    { text: 'मीन', sub: 'Pisces', type: 'rashi' },
    { text: 'ऋ', type: 'swara' },
    { text: 'नन्दा', sub: '1,6,11', type: 'tithi' },
    { text: 'ॠ', type: 'swara' },
    { text: 'कर्क', sub: 'Cancer', type: 'rashi' },
    { text: 'झ', type: 'varna' },
    { text: 'उत्तरा फाल्गुनी', sub: 'U.Phal', type: 'nakshatra' },
  ],
  // Row 5 (Center Core)
  [
    { text: 'उत्तर भाद्रपद', sub: 'U.Bhadra', type: 'nakshatra' },
    { text: 'ञ', type: 'varna' },
    { text: 'कुम्भ', sub: 'Aquarius', type: 'rashi' },
    { text: 'भद्रा', sub: '2,7,12', type: 'tithi' },
    { text: 'ब्रह्म (मेरु)', sub: 'Brahma', type: 'center' },
    { text: 'जया', sub: '3,8,13', type: 'tithi' },
    { text: 'सिंह', sub: 'Leo', type: 'rashi' },
    { text: 'ट', type: 'varna' },
    { text: 'हस्त', sub: 'Hasta', type: 'nakshatra' },
  ],
  // Row 6
  [
    { text: 'पूर्व भाद्रपद', sub: 'P.Bhadra', type: 'nakshatra' },
    { text: 'ठ', type: 'varna' },
    { text: 'मकर', sub: 'Capri', type: 'rashi' },
    { text: 'ऌ', type: 'swara' },
    { text: 'रिक्ता', sub: '4,9,14', type: 'tithi' },
    { text: 'ॡ', type: 'swara' },
    { text: 'कन्या', sub: 'Virgo', type: 'rashi' },
    { text: 'ड', type: 'varna' },
    { text: 'चित्रा', sub: 'Chitra', type: 'nakshatra' },
  ],
  // Row 7
  [
    { text: 'शतभिषा', sub: 'Shatabhisha', type: 'nakshatra' },
    { text: 'ढ', type: 'varna' },
    { text: 'ए', type: 'swara' },
    { text: 'धनु', sub: 'Sagitt', type: 'rashi' },
    { text: 'वृश्चिक', sub: 'Scorpio', type: 'rashi' },
    { text: 'तुला', sub: 'Libra', type: 'rashi' },
    { text: 'ऐ', type: 'swara' },
    { text: 'ण', type: 'varna' },
    { text: 'स्वाति', sub: 'Swati', type: 'nakshatra' },
  ],
  // Row 8
  [
    { text: 'धनिष्ठा', sub: 'Dhanishta', type: 'nakshatra' },
    { text: 'ओ', type: 'swara' },
    { text: 'त', type: 'varna' },
    { text: 'थ', type: 'varna' },
    { text: 'द', type: 'varna' },
    { text: 'ध', type: 'varna' },
    { text: 'न', type: 'varna' },
    { text: 'औ', type: 'swara' },
    { text: 'विशाखा', sub: 'Vishakha', type: 'nakshatra' },
  ],
  // Row 9 (Bottom rim: Shravana, Abhijit, Uttarashadha, etc.)
  [
    { text: 'अं', type: 'swara' },
    { text: 'श्रवण', sub: 'Shravana', type: 'nakshatra' },
    { text: 'अभिजित्', sub: 'Abhijit', type: 'nakshatra' },
    { text: 'उत्तर आषाढ़ा', sub: 'U.Ashadha', type: 'nakshatra' },
    { text: 'पूर्वाषाढ़ा', sub: 'P.Ashadha', type: 'nakshatra' },
    { text: 'मूल', sub: 'Mula', type: 'nakshatra' },
    { text: 'ज्येष्ठा', sub: 'Jyeshtha', type: 'nakshatra' },
    { text: 'अनुराधा', sub: 'Anuradha', type: 'nakshatra' },
    { text: 'अः', type: 'swara' },
  ],
];

export const SarvatobhadraChakraView: React.FC<SarvatobhadraChakraViewProps> = ({
  chart,
  onNavigate,
}) => {
  const { lang } = useLanguage();
  const isHi = lang === 'hi';

  const [activeSubTab, setActiveSubTab] = useState<'sbc' | 'kota' | 'kurma'>('sbc');

  const sbcData: SarvatobhadraData = useMemo(() => computeSarvatobhadraChakra(chart), [chart]);
  const kotaData: KotaChakraData = useMemo(() => computeKotaChakra(chart), [chart]);
  const kurmaData: KurmaChakraData = useMemo(() => computeKurmaChakra(chart), [chart]);

  // Planet placement mapping for grid highlighting
  const natalNakshatraPlanets = useMemo(() => {
    const map = new Map<string, string[]>();
    chart.planets.forEach((p) => {
      const nak = chart.planets.find((pl) => pl.id === p.id)?.nakshatraName || '';
      if (nak) {
        const arr = map.get(nak) || [];
        arr.push(p.id);
        map.set(nak, arr);
      }
    });
    return map;
  }, [chart]);

  return (
    <div className="oj-page-container">
      {/* Breadcrumbs */}
      <nav className="oj-breadcrumbs" aria-label="Breadcrumb">
        <a href="#home" onClick={(e) => { e.preventDefault(); onNavigate?.('home'); }}>
          {isHi ? 'होम' : 'Home'}
        </a>
        <span className="oj-bc-sep">/</span>
        <span>{isHi ? 'विशिष्ट ज्योतिष' : 'Advanced Astrology'}</span>
        <span className="oj-bc-sep">/</span>
        <span className="oj-bc-current">{isHi ? 'सर्वतोभद्र व कोटा चक्र' : 'Sarvatobhadra & Kota Chakra'}</span>
      </nav>

      {/* Header Banner */}
      <div className="oj-page-header-card">
        <div className="oj-header-badge">
          {isHi ? 'फलदीपिका एवं नरपतिजयचर्या आधारित 81-कोष्ठक चक्र' : '81-Cell Cosmic Grid with Tri-Directional Vedha'}
        </div>
        <h1 className="oj-page-title">
          {isHi ? 'सर्वतोभद्र चक्र, वेध फल एवं कोटा चक्र' : 'Sarvatobhadra Chakra & Fortress Defense (Kota)'}
        </h1>
        <p className="oj-page-subtitle">
          {isHi
            ? '28 नक्षत्र (अभिजित् सहित), 16 स्वर, 20 व्यंजन, 12 राशियां एवं 5 तिथियों पर ग्रहों के अग्र, वाम व दक्षिण वेध का प्रामाणिक शास्त्रीय विश्लेषण।'
            : 'Authentic 9x9 cosmic grid incorporating 28 Nakshatras (with Abhijit), 16 vowels, consonants, rashis, tithis, and tri-directional vedha ray impacts.'}
        </p>

        {/* Action Controls & Sub-tabs */}
        <div className="oj-page-actions-bar">
          <div className="oj-tab-pills-row">
            <button
              type="button"
              className={`oj-tab-pill ${activeSubTab === 'sbc' ? 'is-active' : ''}`}
              onClick={() => setActiveSubTab('sbc')}
            >
              <Grid size={13} />
              <span>{isHi ? 'सर्वतोभद्र चक्र (9x9 Grid)' : 'Sarvatobhadra (9x9 Grid)'}</span>
            </button>
            <button
              type="button"
              className={`oj-tab-pill ${activeSubTab === 'kota' ? 'is-active' : ''}`}
              onClick={() => setActiveSubTab('kota')}
            >
              <Shield size={13} />
              <span>{isHi ? 'कोटा चक्र (दुर्ग रक्षा)' : 'Kota Chakra (Fortress)'}</span>
            </button>
            <button
              type="button"
              className={`oj-tab-pill ${activeSubTab === 'kurma' ? 'is-active' : ''}`}
              onClick={() => setActiveSubTab('kurma')}
            >
              <Compass size={13} />
              <span>{isHi ? 'कूर्म चक्र (दिक् शुद्धि)' : 'Kurma Chakra (Directions)'}</span>
            </button>
          </div>

          <button type="button" className="oj-action-btn secondary" onClick={() => window.print()}>
            <Printer size={13} />
            <span>{isHi ? 'प्रिंट करें' : 'Print'}</span>
          </button>
        </div>
      </div>

      {/* Main Tab 1: Sarvatobhadra Chakra */}
      {activeSubTab === 'sbc' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Quick Metrics Bar */}
          <div className="oj-four-col-grid">
            <div className="oj-card" style={{ padding: '16px', textAlign: 'center' }}>
              <span className="oj-stat-label">{isHi ? 'जन्म नक्षत्र' : 'Janma Nakshatra'}</span>
              <strong style={{ display: 'block', fontSize: '18px', color: '#b45309', marginTop: '4px' }}>
                {sbcData.janmaNakshatra}
              </strong>
            </div>

            <div className="oj-card" style={{ padding: '16px', textAlign: 'center' }}>
              <span className="oj-stat-label">{isHi ? 'शुभ वेध (संरक्षक प्रभाव)' : 'Benefic Vedhas'}</span>
              <strong style={{ display: 'block', fontSize: '18px', color: '#16a34a', marginTop: '4px' }}>
                {isHi ? `${sbcData.beneficVedhaCount} शुभ प्रभाव` : `${sbcData.beneficVedhaCount} Benefic Rays`}
              </strong>
            </div>

            <div className="oj-card" style={{ padding: '16px', textAlign: 'center' }}>
              <span className="oj-stat-label">{isHi ? 'पाप वेध (चुनौतियां)' : 'Malefic Vedhas'}</span>
              <strong style={{ display: 'block', fontSize: '18px', color: '#dc2626', marginTop: '4px' }}>
                {isHi ? `${sbcData.maleficVedhaCount} पाप वेध` : `${sbcData.maleficVedhaCount} Malefic Vedhas`}
              </strong>
            </div>

            <div className="oj-card" style={{ padding: '16px', textAlign: 'center' }}>
              <span className="oj-stat-label">{isHi ? 'समग्र वेध स्थिति' : 'Overall Vedha State'}</span>
              <strong style={{ display: 'block', fontSize: '15px', color: sbcData.maleficVedhaCount > sbcData.beneficVedhaCount ? '#ea580c' : '#16a34a', marginTop: '6px' }}>
                {sbcData.maleficVedhaCount > sbcData.beneficVedhaCount
                  ? (isHi ? 'सावधानी व शांति अपेक्षित' : 'Caution Advised')
                  : (isHi ? 'शुभ व रक्षित' : 'Fortified & Protected')}
              </strong>
            </div>
          </div>

          {/* 9x9 Sarvatobhadra Interactive Visual Grid */}
          <div className="oj-card" style={{ padding: '20px' }}>
            <div className="oj-card-header" style={{ marginBottom: '14px' }}>
              <h2 style={{ fontSize: '17px', margin: 0, color: '#b45309', fontFamily: 'Cinzel, Playfair Display, serif' }}>
                {isHi ? 'सर्वतोभद्र 81 कोष्ठक शास्त्रीय चक्र' : 'Classical 81-Pada Sarvatobhadra Grid'}
              </h2>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                {isHi ? 'गोल्डन हाइलाइट = जातक के जन्मकालिक ग्रह स्थिति' : 'Gold Highlight = Native Natal Planetary Placements'}
              </span>
            </div>

            <div style={{ overflowX: 'auto', paddingBottom: '10px' }}>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(9, minmax(75px, 1fr))',
                  gap: '4px',
                  background: 'rgba(180, 83, 9, 0.15)',
                  padding: '8px',
                  borderRadius: '12px',
                  minWidth: '700px',
                }}
              >
                {SBC_GRID_9X9.map((row, rIdx) =>
                  row.map((cell, cIdx) => {
                    const isCenter = cell.type === 'center';
                    const isNak = cell.type === 'nakshatra';
                    const isSwara = cell.type === 'swara';
                    const isRashi = cell.type === 'rashi';
                    const isTithi = cell.type === 'tithi';

                    // Check if native has planets in this nakshatra
                    let planetBadges: string[] = [];
                    if (isNak) {
                      chart.planets.forEach((p) => {
                        if (p.nakshatraName && (cell.text.includes(p.nakshatraName) || (cell.sub && cell.sub.toLowerCase().includes(p.nakshatraName.toLowerCase().slice(0, 4))))) {
                          planetBadges.push(p.id.slice(0, 2));
                        }
                      });
                    }

                    const hasNatalPlanet = planetBadges.length > 0;

                    return (
                      <div
                        key={`${rIdx}-${cIdx}`}
                        style={{
                          background: hasNatalPlanet
                            ? 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)'
                            : isCenter
                            ? 'linear-gradient(135deg, #78350f 0%, #92400e 100%)'
                            : isNak
                            ? 'var(--bg-elevated)'
                            : isSwara
                            ? 'rgba(217, 119, 6, 0.08)'
                            : isRashi
                            ? 'rgba(59, 130, 246, 0.07)'
                            : isTithi
                            ? 'rgba(16, 185, 129, 0.08)'
                            : 'var(--bg-elevated)',
                          border: hasNatalPlanet
                            ? '2px solid #b45309'
                            : isCenter
                            ? '2px solid #451a03'
                            : '1px solid var(--border)',
                          borderRadius: '8px',
                          padding: '8px 4px',
                          textAlign: 'center',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          alignItems: 'center',
                          minHeight: '64px',
                          transition: 'all 0.15s ease',
                          color: isCenter ? '#ffffff' : 'var(--text)',
                          boxShadow: hasNatalPlanet ? '0 3px 8px rgba(180, 83, 9, 0.25)' : 'none',
                        }}
                      >
                        <span
                          style={{
                            fontWeight: isCenter || hasNatalPlanet ? 700 : 600,
                            fontSize: isCenter ? '12px' : isNak ? '11px' : '13px',
                            color: isCenter ? '#ffffff' : hasNatalPlanet ? '#78350f' : 'inherit',
                          }}
                        >
                          {cell.text}
                        </span>
                        {cell.sub && (
                          <span
                            style={{
                              fontSize: '9px',
                              color: isCenter ? '#fde68a' : 'var(--text-muted)',
                              marginTop: '2px',
                            }}
                          >
                            {cell.sub}
                          </span>
                        )}
                        {hasNatalPlanet && (
                          <div style={{ display: 'flex', gap: '2px', marginTop: '4px', flexWrap: 'wrap', justifyContent: 'center' }}>
                            {planetBadges.map((pl) => (
                              <span
                                key={pl}
                                style={{
                                  fontSize: '8.5px',
                                  fontWeight: 'bold',
                                  background: '#b45309',
                                  color: '#ffffff',
                                  padding: '1px 4px',
                                  borderRadius: '9999px',
                                }}
                              >
                                {pl}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* Special Sensitivity Nakshatras & Vedha Verdicts */}
          <div className="oj-card">
            <div className="oj-card-header">
              <h2>{isHi ? '9 संवेदनशील नक्षत्र एवं त्रि-दिशीय वेध प्रभाव' : '9 Sensitive Nakshatras & Vedha Rays'}</h2>
            </div>
            <table className="oj-table">
              <thead>
                <tr>
                  <th>{isHi ? 'संवेदनशील बिन्दु' : 'Point'}</th>
                  <th>{isHi ? 'नक्षत्र नाम' : 'Nakshatra'}</th>
                  <th>{isHi ? 'स्थित ग्रह' : 'Occupants'}</th>
                  <th>{isHi ? 'वेध करने वाले ग्रह' : 'Vedha By'}</th>
                  <th>{isHi ? 'शास्त्रीय फलकथन' : 'Classical Verdict'}</th>
                </tr>
              </thead>
              <tbody>
                {sbcData.specialPoints.map((sp) => (
                  <tr key={sp.key}>
                    <td>
                      <strong>{isHi ? sp.titleHi : sp.titleEn}</strong>
                    </td>
                    <td>
                      <span className="oj-badge-accent">{sp.nakshatraName}</span>
                    </td>
                    <td>
                      {sp.occupants.length === 0 ? (
                        <span className="muted">{isHi ? 'रिक्त' : 'None'}</span>
                      ) : (
                        sp.occupants.map((occ) => (
                          <span key={occ} style={{ display: 'inline-block', margin: '1px 3px', padding: '1px 6px', background: 'rgba(180, 83, 9, 0.1)', color: '#b45309', borderRadius: '4px', fontWeight: 600, fontSize: '11px' }}>
                            {trPlanet(occ, lang)}
                          </span>
                        ))
                      )}
                    </td>
                    <td>
                      {sp.vedhaBy.length === 0 ? (
                        <span style={{ color: '#16a34a', fontSize: '11.5px', fontWeight: 600 }}>{isHi ? 'वेध रहित (निर्दोष)' : 'Clear (No Vedha)'}</span>
                      ) : (
                        sp.vedhaBy.map((v, i) => (
                          <span
                            key={i}
                            style={{
                              display: 'inline-block',
                              margin: '2px',
                              padding: '2px 6px',
                              borderRadius: '4px',
                              fontSize: '11px',
                              fontWeight: 600,
                              background: v.isMalefic ? 'rgba(220, 38, 38, 0.12)' : 'rgba(22, 163, 74, 0.12)',
                              color: v.isMalefic ? '#dc2626' : '#16a34a',
                            }}
                          >
                            {trPlanet(v.planet, lang)} ({isHi ? (v.type === 'direct' ? 'अग्र' : v.type === 'left' ? 'वाम' : v.type === 'right' ? 'दक्षिण' : v.type) : v.type})
                          </span>
                        ))
                      )}
                    </td>
                    <td style={{ fontSize: '12px' }}>
                      {isHi ? sp.verdictHi : sp.verdictEn}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Main Tab 2: Kota Chakra (Fortress) */}
      {activeSubTab === 'kota' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="oj-two-col-grid">
            <div className="oj-card" style={{ padding: '20px' }}>
              <div className="oj-card-header">
                <h3>{isHi ? 'कोटा चक्र दुर्ग रक्षा (Fortress Defense Status)' : 'Kota Chakra Fortress Defense'}</h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: 'var(--bg-subtle)', borderRadius: '8px' }}>
                  <span>{isHi ? 'कोटा स्वामी (दुर्ग अधिपति):' : 'Kota Swami (Fort Lord):'}</span>
                  <strong>{kotaData.kotaSwami}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: 'var(--bg-subtle)', borderRadius: '8px' }}>
                  <span>{isHi ? 'कोटा पाल (दुर्ग रक्षक):' : 'Kota Pala (Guard Lord):'}</span>
                  <strong>{kotaData.kotaPala}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: 'var(--bg-subtle)', borderRadius: '8px' }}>
                  <span>{isHi ? 'घेराबंदी जोखिम सूचकांक:' : 'Siege Risk Score:'}</span>
                  <strong style={{ color: kotaData.siegeRiskScore > 50 ? '#dc2626' : '#16a34a' }}>
                    {kotaData.siegeRiskScore} / 100
                  </strong>
                </div>
              </div>
            </div>

            <div className="oj-card" style={{ padding: '20px' }}>
              <div className="oj-card-header">
                <h3>{isHi ? 'शास्त्रीय रक्षा विश्लेषण' : 'Defense Analysis'}</h3>
              </div>
              <p style={{ fontSize: '13px', lineHeight: 1.6, color: 'var(--text)' }}>
                {isHi ? kotaData.analysisHi : kotaData.analysisEn}
              </p>
              <div style={{ marginTop: '14px', padding: '10px 14px', background: 'rgba(217, 119, 6, 0.08)', borderRadius: '8px', borderLeft: '4px solid #b45309' }}>
                <span style={{ fontWeight: 'bold', fontSize: '12px', color: '#b45309', display: 'block', marginBottom: '2px' }}>
                  {isHi ? 'दुर्ग सिद्धांत:' : 'Fortress Principle:'}
                </span>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  {isHi
                    ? 'स्तंभ (Stambha) में शुभ ग्रह स्थिति जातक को अपराजित रखती है, जबकि बाह्य (Bahya) में पाप ग्रह होने पर बाह्य संघर्षों में विजय मिलती है।'
                    : 'Benefics in the central Stambha pillar make the native invincible, while malefics placed in Bahya exterior ward off external adversaries.'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Tab 3: Kurma Chakra (Directions) */}
      {activeSubTab === 'kurma' && (
        <div className="oj-card" style={{ padding: '20px' }}>
          <div className="oj-card-header">
            <h3>{isHi ? 'कूर्म चक्र (अष्ट दिशा भूगोल एवं वास्तु प्रभाव)' : 'Kurma Chakra Directional Geography'}</h3>
          </div>
          <p style={{ fontSize: '13px', lineHeight: 1.6, color: 'var(--text)', marginBottom: '16px' }}>
            {isHi ? kurmaData.guidanceHi : kurmaData.guidanceEn}
          </p>

          <table className="oj-table">
            <thead>
              <tr>
                <th>{isHi ? 'दिशा' : 'Direction'}</th>
                <th>{isHi ? 'प्रभावित नक्षत्र' : 'Nakshatras'}</th>
                <th>{isHi ? 'स्थित ग्रह' : 'Planets'}</th>
                <th>{isHi ? 'दिशा फल' : 'Direction Verdict'}</th>
              </tr>
            </thead>
            <tbody>
              {kurmaData.zones.map((zone, idx) => (
                <tr key={idx}>
                  <td><strong>{zone.titleHi} ({zone.titleEn})</strong></td>
                  <td><span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>{zone.nakshatras.join(', ')}</span></td>
                  <td>
                    {zone.occupants.length === 0 ? (
                      <span className="muted">{isHi ? 'रिक्त' : 'None'}</span>
                    ) : (
                      zone.occupants.map((pl) => (
                        <span key={pl} style={{ display: 'inline-block', margin: '1px 3px', padding: '1px 6px', background: 'rgba(180, 83, 9, 0.1)', color: '#b45309', borderRadius: '4px', fontWeight: 600, fontSize: '11px' }}>
                          {pl}
                        </span>
                      ))
                    )}
                  </td>
                  <td style={{ fontSize: '12px' }}>
                    <span style={{ color: zone.maleficScore > 0 ? '#dc2626' : '#16a34a', fontWeight: 600 }}>
                      {isHi ? zone.statusHi : zone.statusEn}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SarvatobhadraChakraView;
