import React, { useState } from 'react';
import { computeMedicalAstrology } from '../../astro/medicalAstrology';
import { computeLalKitabFull } from '../../astro/lalKitabFull';
import type { ChartData } from '../../astro/types';

interface MedicalAstrologyViewProps {
  chart: ChartData;
}

export const MedicalAstrologyView: React.FC<MedicalAstrologyViewProps> = ({ chart }) => {
  const [activeTab, setActiveTab] = useState<'tridosha' | 'systems' | 'critical' | 'lalkitab'>('tridosha');

  const medReport = React.useMemo(() => computeMedicalAstrology(chart), [chart]);
  const lkReport = React.useMemo(() => computeLalKitabFull(chart), [chart]);

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '22px', fontWeight: 700, color: 'var(--text)' }}>
            Medical Astrology (Roga Nirnaya) & Lal Kitab Upaya
          </h2>
          <p style={{ margin: '4px 0 0', fontSize: '13px', color: 'var(--text-muted)' }}>
            Ayurvedic Tridosha Constitution, 12 Kalapurusha Body Systems, 22nd Drekkana, 64th Navamsha & Lal Kitab Sleeping Planets
          </p>
        </div>

        {/* Tab Pills */}
        <div className="oj-tab-pills-row">
          <button
            type="button"
            onClick={() => setActiveTab('tridosha')}
            className={`oj-tab-pill ${activeTab === 'tridosha' ? 'is-active' : ''}`}
          >
            Tridosha Balance
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('systems')}
            className={`oj-tab-pill ${activeTab === 'systems' ? 'is-active' : ''}`}
          >
            Body Systems (12 Bhavas)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('critical')}
            className={`oj-tab-pill ${activeTab === 'critical' ? 'is-active' : ''}`}
          >
            22nd Drekkana & 64th Navamsha
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('lalkitab')}
            className={`oj-tab-pill ${activeTab === 'lalkitab' ? 'is-active' : ''}`}
          >
            Lal Kitab Farman & Teva
          </button>
        </div>
      </div>

      {/* Tab 1: Tridosha Balance */}
      {activeTab === 'tridosha' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ background: 'var(--bg-elevated)', borderRadius: '10px', border: '1px solid var(--border)', padding: '24px' }}>
            <h3 style={{ margin: '0 0 16px', fontSize: '18px', color: 'var(--text)' }}>
              Prakriti Assessment: Dominant Dosha — <span style={{ color: 'var(--accent)' }}>{medReport.tridosha.dominantDosha}</span>
            </h3>

            {/* Dosha Progress Bars */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
                  <span>Vata (Air & Space / वात): Nervous system, breath, mobility</span>
                  <span style={{ color: '#2563eb' }}>{medReport.tridosha.vataPercent}%</span>
                </div>
                <div style={{ width: '100%', height: '10px', background: 'var(--bg-subtle)', borderRadius: '5px', overflow: 'hidden' }}>
                  <div style={{ width: `${medReport.tridosha.vataPercent}%`, height: '100%', background: '#2563eb' }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
                  <span>Pitta (Fire & Water / पित्त): Digestion, metabolism, body heat</span>
                  <span style={{ color: '#dc2626' }}>{medReport.tridosha.pittaPercent}%</span>
                </div>
                <div style={{ width: '100%', height: '10px', background: 'var(--bg-subtle)', borderRadius: '5px', overflow: 'hidden' }}>
                  <div style={{ width: `${medReport.tridosha.pittaPercent}%`, height: '100%', background: '#dc2626' }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
                  <span>Kapha (Earth & Water / कफ): Structure, immunity, stability</span>
                  <span style={{ color: '#059669' }}>{medReport.tridosha.kaphaPercent}%</span>
                </div>
                <div style={{ width: '100%', height: '10px', background: 'var(--bg-subtle)', borderRadius: '5px', overflow: 'hidden' }}>
                  <div style={{ width: `${medReport.tridosha.kaphaPercent}%`, height: '100%', background: '#059669' }} />
                </div>
              </div>
            </div>

            {/* Overall Summary Card */}
            <div style={{ padding: '16px', borderRadius: '8px', background: 'rgba(180, 83, 9, 0.08)', border: '1px solid rgba(180, 83, 9, 0.25)', marginBottom: '16px' }}>
              <div style={{ fontSize: '13.5px', lineHeight: 1.6, color: 'var(--text)', marginBottom: '6px' }}>
                {medReport.overallSummaryEn}
              </div>
              <div style={{ fontSize: '13px', lineHeight: 1.6, color: 'var(--text-muted)' }}>
                {medReport.overallSummaryHi}
              </div>
            </div>

            {/* Recommendations */}
            <h4 style={{ margin: '16px 0 10px', fontSize: '14px', color: 'var(--text)' }}>Ayurvedic Lifestyle & Dietary Guidelines:</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {medReport.tridosha.recommendations.map((rec, idx) => (
                <div key={idx} style={{ fontSize: '13px', color: 'var(--text)', display: 'flex', gap: '8px' }}>
                  <span style={{ color: 'var(--accent)' }}>•</span>
                  <span>{rec}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: 12 Body Systems */}
      {activeTab === 'systems' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
          {medReport.bodySystems.map((sys) => (
            <div
              key={sys.houseNumber}
              style={{
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text)' }}>
                  House {sys.houseNumber} ({sys.signName})
                </span>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '4px',
                    background:
                      sys.afflictionLevel === 'Healthy'
                        ? 'rgba(5, 150, 105, 0.12)'
                        : sys.afflictionLevel === 'Mild'
                          ? 'rgba(37, 99, 235, 0.12)'
                          : sys.afflictionLevel === 'Moderate'
                            ? 'rgba(217, 119, 6, 0.12)'
                            : 'rgba(220, 38, 38, 0.12)',
                    color:
                      sys.afflictionLevel === 'Healthy'
                        ? '#059669'
                        : sys.afflictionLevel === 'Mild'
                          ? '#2563eb'
                          : sys.afflictionLevel === 'Moderate'
                            ? '#d97706'
                            : '#dc2626',
                  }}
                >
                  {sys.afflictionLevel} ({sys.afflictionScore}/100)
                </span>
              </div>
              <div style={{ fontSize: '12.5px', color: 'var(--accent)', fontWeight: 600 }}>
                {sys.bodyParts.join(', ')}
              </div>
              <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                {sys.bodyPartsHindi.join(', ')}
              </div>
              <div style={{ borderTop: '1px dashed var(--border)', paddingTop: '6px', fontSize: '12px', color: 'var(--text-muted)' }}>
                Occupants: <strong>{sys.planetsInHouse.join(', ') || 'None (Empty House)'}</strong>
              </div>
              {sys.afflictionNotes.length > 0 && (
                <div style={{ fontSize: '11.5px', color: 'var(--text)', background: 'var(--bg-subtle)', padding: '6px 8px', borderRadius: '4px' }}>
                  {sys.afflictionNotes.join(' · ')}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Critical Points */}
      {activeTab === 'critical' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            <div style={{ padding: '20px', borderRadius: '10px', background: 'var(--bg-elevated)', border: '1.5px solid var(--accent)' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                22nd Drekkana Lord (Kharesh)
              </div>
              <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text)', margin: '6px 0' }}>
                {medReport.criticalPoints.drekkana22Lord}
              </div>
              <div style={{ fontSize: '12.5px', color: 'var(--accent)' }}>
                Sign: {medReport.criticalPoints.drekkana22SignName}
              </div>
            </div>

            <div style={{ padding: '20px', borderRadius: '10px', background: 'var(--bg-elevated)', border: '1.5px solid var(--accent)' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                64th Navamsha Lord (Chhanda)
              </div>
              <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text)', margin: '6px 0' }}>
                {medReport.criticalPoints.navamsha64Lord}
              </div>
              <div style={{ fontSize: '12.5px', color: 'var(--accent)' }}>
                Sign: {medReport.criticalPoints.navamsha64SignName}
              </div>
            </div>
          </div>

          <div style={{ background: 'var(--bg-elevated)', borderRadius: '10px', border: '1px solid var(--border)', padding: '20px' }}>
            <h4 style={{ margin: '0 0 10px', fontSize: '15px', color: '#dc2626' }}>
              Classical Health Vulnerability Periods (BPHS Guidelines)
            </h4>
            <p style={{ margin: '0 0 12px', fontSize: '13px', lineHeight: 1.6, color: 'var(--text)' }}>
              {medReport.criticalPoints.warningEn}
            </p>
            <p style={{ margin: 0, fontSize: '12.5px', lineHeight: 1.6, color: 'var(--text-muted)' }}>
              {medReport.criticalPoints.warningHi}
            </p>
          </div>
        </div>
      )}

      {/* Tab 4: Lal Kitab Farman */}
      {activeTab === 'lalkitab' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ padding: '16px', borderRadius: '8px', background: 'var(--bg-elevated)', border: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Lal Kitab Horoscope Classification</div>
              <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--accent)', marginTop: '2px' }}>
                {lkReport.tevaType} ({lkReport.tevaTypeHi})
              </div>
            </div>
          </div>

          {/* Sleeping Planets */}
          {lkReport.sleepingPlanets.length > 0 && (
            <div style={{ background: 'var(--bg-elevated)', borderRadius: '10px', border: '1px solid var(--border)', padding: '20px' }}>
              <h4 style={{ margin: '0 0 12px', fontSize: '15px', color: 'var(--text)' }}>
                Sleeping Planets (सोए हुए ग्रह / Soi Hui Kismat)
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {lkReport.sleepingPlanets.map((sp, idx) => (
                  <div key={idx} style={{ padding: '12px', borderRadius: '6px', background: 'var(--bg-subtle)', border: '1px solid var(--border)' }}>
                    <div style={{ fontWeight: 700, fontSize: '13px', color: 'var(--accent)' }}>
                      {sp.planet} in House {sp.house} · Catalyst to Awaken: {sp.catalystPlanet}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text)', marginTop: '4px' }}>{sp.reasonEn}</div>
                    <div style={{ fontSize: '11.5px', color: '#059669', marginTop: '4px', fontWeight: 600 }}>{sp.remedyEn} ({sp.remedyHi})</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Blind Planets */}
          {lkReport.blindPlanets.length > 0 && (
            <div style={{ background: 'var(--bg-elevated)', borderRadius: '10px', border: '1px solid var(--border)', padding: '20px' }}>
              <h4 style={{ margin: '0 0 12px', fontSize: '15px', color: '#dc2626' }}>
                Blind Planet Conjunctions (अंधे घोड़े / Mutual Conflict)
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {lkReport.blindPlanets.map((bp, idx) => (
                  <div key={idx} style={{ padding: '12px', borderRadius: '6px', background: 'rgba(220, 38, 38, 0.05)', border: '1px solid rgba(220, 38, 38, 0.2)' }}>
                    <div style={{ fontWeight: 700, fontSize: '13px', color: '#dc2626' }}>
                      {bp.planets.join(' + ')} in House {bp.house}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text)', marginTop: '4px' }}>{bp.impactEn}</div>
                    <div style={{ fontSize: '12px', color: 'var(--accent)', marginTop: '4px', fontWeight: 600 }}>Remedy: {bp.farmanRemedyEn}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Core Farmans */}
          <div style={{ background: 'var(--bg-elevated)', borderRadius: '10px', border: '1px solid var(--border)', padding: '20px' }}>
            <h4 style={{ margin: '0 0 14px', fontSize: '15px', color: 'var(--text)' }}>
              Universal Lal Kitab Protective Remedies (अनिवार्य लाल किताब उपाय)
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {lkReport.coreRemediesEn.map((r, idx) => (
                <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '2px', padding: '10px', borderRadius: '6px', background: 'var(--bg-subtle)' }}>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)' }}>• {r}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>  {lkReport.coreRemediesHi[idx]}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicalAstrologyView;
