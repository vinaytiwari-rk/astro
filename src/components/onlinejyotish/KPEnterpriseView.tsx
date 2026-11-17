import React, { useState } from 'react';
import { computeKPEnterprise } from '../../astro/kpEnterprise';
import { computeVarshaphala } from '../../astro/varshaphala';
import type { ChartData } from '../../astro/types';

interface KPEnterpriseViewProps {
  chart: ChartData;
}

export const KPEnterpriseView: React.FC<KPEnterpriseViewProps> = ({ chart }) => {
  const [activeTab, setActiveTab] = useState<'fourfold' | 'csl' | 'rp' | 'varsha'>('fourfold');
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());

  const kpReport = React.useMemo(() => computeKPEnterprise(chart), [chart]);
  const varshaReport = React.useMemo(() => computeVarshaphala(chart, selectedYear), [chart, selectedYear]);

  return (
    <div className="kp-enterprise-container" style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '22px', fontWeight: 700, color: 'var(--text)' }}>
            KP Enterprise Shastra & Varshaphala
          </h2>
          <p style={{ margin: '4px 0 0', fontSize: '13px', color: 'var(--text-muted)' }}>
            Krishnamurti Paddhati 4-Fold Significators, Cuspal Sub-Lords, Live Ruling Planets & Tajika Annual Solar Return
          </p>
        </div>

        {/* Tab Pills */}
        <div style={{ display: 'flex', gap: '6px', background: 'var(--bg-subtle)', padding: '4px', borderRadius: '8px', border: '1px solid var(--border)' }}>
          <button
            onClick={() => setActiveTab('fourfold')}
            style={{
              padding: '6px 14px',
              borderRadius: '6px',
              border: 'none',
              background: activeTab === 'fourfold' ? 'var(--accent)' : 'transparent',
              color: activeTab === 'fourfold' ? '#fff' : 'var(--text)',
              fontWeight: 600,
              fontSize: '12px',
              cursor: 'pointer',
            }}
          >
            4-Fold Significators
          </button>
          <button
            onClick={() => setActiveTab('csl')}
            style={{
              padding: '6px 14px',
              borderRadius: '6px',
              border: 'none',
              background: activeTab === 'csl' ? 'var(--accent)' : 'transparent',
              color: activeTab === 'csl' ? '#fff' : 'var(--text)',
              fontWeight: 600,
              fontSize: '12px',
              cursor: 'pointer',
            }}
          >
            Cuspal Sub-Lords
          </button>
          <button
            onClick={() => setActiveTab('rp')}
            style={{
              padding: '6px 14px',
              borderRadius: '6px',
              border: 'none',
              background: activeTab === 'rp' ? 'var(--accent)' : 'transparent',
              color: activeTab === 'rp' ? '#fff' : 'var(--text)',
              fontWeight: 600,
              fontSize: '12px',
              cursor: 'pointer',
            }}
          >
            Live Ruling Planets
          </button>
          <button
            onClick={() => setActiveTab('varsha')}
            style={{
              padding: '6px 14px',
              borderRadius: '6px',
              border: 'none',
              background: activeTab === 'varsha' ? 'var(--accent)' : 'transparent',
              color: activeTab === 'varsha' ? '#fff' : 'var(--text)',
              fontWeight: 600,
              fontSize: '12px',
              cursor: 'pointer',
            }}
          >
            Tajika Varshaphala
          </button>
        </div>
      </div>

      {/* Tab 1: 4-Fold Significators */}
      {activeTab === 'fourfold' && (
        <div style={{ background: 'var(--bg-elevated)', borderRadius: '10px', border: '1px solid var(--border)', padding: '20px' }}>
          <h3 style={{ margin: '0 0 12px', fontSize: '16px', color: 'var(--text)' }}>
            KP 4-Fold Planetary Significators Table (12 Bhavas)
          </h3>
          <p style={{ margin: '0 0 16px', fontSize: '12.5px', color: 'var(--text-muted)' }}>
            Level A (Strongest) = In Star of Occupant | Level B = In House | Level C = In Star of Lord | Level D = House Lord
          </p>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: 'var(--bg-subtle)', textAlign: 'left', borderBottom: '2px solid var(--border)' }}>
                  <th style={{ padding: '10px' }}>House</th>
                  <th style={{ padding: '10px' }}>Level A (Star of Occupant)</th>
                  <th style={{ padding: '10px' }}>Level B (Occupants)</th>
                  <th style={{ padding: '10px' }}>Level C (Star of Lord)</th>
                  <th style={{ padding: '10px' }}>Level D (House Lord)</th>
                  <th style={{ padding: '10px' }}>All Significators</th>
                </tr>
              </thead>
              <tbody>
                {kpReport.fourFoldSignificators.map((row) => (
                  <tr key={row.house} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '10px', fontWeight: 700, color: 'var(--accent)' }}>House {row.house}</td>
                    <td style={{ padding: '10px' }}>{row.lordA.length ? row.lordA.join(', ') : '—'}</td>
                    <td style={{ padding: '10px' }}>{row.lordB.length ? row.lordB.join(', ') : '—'}</td>
                    <td style={{ padding: '10px' }}>{row.lordC.length ? row.lordC.join(', ') : '—'}</td>
                    <td style={{ padding: '10px' }}>{row.lordD.length ? row.lordD.join(', ') : '—'}</td>
                    <td style={{ padding: '10px', fontWeight: 600 }}>{row.allSignificators.join(', ')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Cuspal Sub-Lords */}
      {activeTab === 'csl' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
          {kpReport.cuspalSubLordGrid.map((csl) => (
            <div
              key={csl.house}
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
                  Cusp {csl.house}
                </span>
                <span style={{ fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '4px', background: 'rgba(180, 83, 9, 0.12)', color: 'var(--accent)' }}>
                  CSL: {csl.csl}
                </span>
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Signifies Houses: <strong>{csl.cslSignificates.join(', ') || 'None'}</strong>
              </div>
              <div style={{ borderTop: '1px dashed var(--border)', paddingTop: '8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {csl.predictions.map((p, idx) => (
                  <div key={idx} style={{ fontSize: '12px', color: 'var(--text)' }}>
                    • {p}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Live Ruling Planets */}
      {activeTab === 'rp' && (
        <div style={{ background: 'var(--bg-elevated)', borderRadius: '10px', border: '1px solid var(--border)', padding: '24px' }}>
          <h3 style={{ margin: '0 0 16px', fontSize: '17px', color: 'var(--text)' }}>
            Live Ruling Planets (RP) at Current Moment
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginBottom: '20px' }}>
            <div style={{ padding: '14px', borderRadius: '8px', background: 'var(--bg-subtle)', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Day Lord (Vara)</div>
              <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--accent)', marginTop: '4px' }}>{kpReport.liveRulingPlanets.dayLord}</div>
            </div>
            <div style={{ padding: '14px', borderRadius: '8px', background: 'var(--bg-subtle)', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Lagna Sign Lord</div>
              <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text)', marginTop: '4px' }}>{kpReport.liveRulingPlanets.lagnaLord}</div>
            </div>
            <div style={{ padding: '14px', borderRadius: '8px', background: 'var(--bg-subtle)', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Lagna Star Lord</div>
              <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text)', marginTop: '4px' }}>{kpReport.liveRulingPlanets.lagnaStarLord}</div>
            </div>
            <div style={{ padding: '14px', borderRadius: '8px', background: 'var(--bg-subtle)', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Moon Sign Lord</div>
              <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text)', marginTop: '4px' }}>{kpReport.liveRulingPlanets.moonSignLord}</div>
            </div>
            <div style={{ padding: '14px', borderRadius: '8px', background: 'var(--bg-subtle)', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Moon Star Lord</div>
              <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text)', marginTop: '4px' }}>{kpReport.liveRulingPlanets.moonStarLord}</div>
            </div>
          </div>
          <div style={{ padding: '14px', borderRadius: '8px', background: 'rgba(5, 150, 105, 0.08)', border: '1px solid rgba(5, 150, 105, 0.2)' }}>
            <strong style={{ color: '#059669', fontSize: '13px' }}>Common / Strongest Significator Planets:</strong>
            <div style={{ marginTop: '6px', fontSize: '14px', fontWeight: 600, color: 'var(--text)' }}>
              {kpReport.liveRulingPlanets.commonPlanets.join(', ') || 'Planets in strong agreement across Ascendant and Moon rulers'}
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Tajika Varshaphala */}
      {activeTab === 'varsha' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'var(--bg-elevated)', padding: '14px', borderRadius: '8px', border: '1px solid var(--border)' }}>
            <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)' }}>Select Solar Return Year:</label>
            <input
              type="number"
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              style={{ width: '90px', padding: '6px 10px', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--bg-subtle)', color: 'var(--text)', fontWeight: 600 }}
            />
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              (Age completed: {varshaReport.completedYears} years)
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
            <div style={{ padding: '16px', background: 'var(--bg-elevated)', borderRadius: '8px', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Muntha Sign & House</div>
              <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--accent)', marginTop: '4px' }}>
                {varshaReport.munthaSignName} (House {varshaReport.munthaHouse})
              </div>
            </div>
            <div style={{ padding: '16px', background: 'var(--bg-elevated)', borderRadius: '8px', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Varsheshwar (Year Lord)</div>
              <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text)', marginTop: '4px' }}>
                {varshaReport.varshesh}
              </div>
            </div>
            <div style={{ padding: '16px', background: 'var(--bg-elevated)', borderRadius: '8px', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Solar Return Epoch</div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)', marginTop: '4px' }}>
                {varshaReport.varshaPraveshLocal}
              </div>
            </div>
          </div>

          {/* Muntha Prediction */}
          <div style={{ background: 'var(--bg-elevated)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border)' }}>
            <h4 style={{ margin: '0 0 8px', fontSize: '14px', color: 'var(--accent)' }}>Muntha Phalam (Annual Progression)</h4>
            <p style={{ margin: 0, fontSize: '13px', lineHeight: 1.6, color: 'var(--text)' }}>{varshaReport.munthaPrediction}</p>
          </div>

          {/* Tajika Sahams */}
          <div style={{ background: 'var(--bg-elevated)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border)' }}>
            <h4 style={{ margin: '0 0 12px', fontSize: '14px', color: 'var(--text)' }}>Key Tajika Sahams (Sensitive Arabic Points)</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
              {varshaReport.sahams.map((s) => (
                <div key={s.nameEn} style={{ padding: '10px', borderRadius: '6px', background: 'var(--bg-subtle)', border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--accent)' }}>{s.nameEn} ({s.nameHi})</div>
                  <div style={{ fontSize: '11.5px', color: 'var(--text)', marginTop: '2px' }}>House {s.house} · {s.dms}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KPEnterpriseView;
