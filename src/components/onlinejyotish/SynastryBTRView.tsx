import React, { useState } from 'react';
import { computeSynastry, type RelationshipType } from '../../astro/synastry';
import { computeBTR, type BTRLifeEvent, type BTREventType } from '../../astro/birthTimeRectification';
import { SAMPLE_CHARTS } from '../../data/cities';
import { calculateChart } from '../../astro/calculator';
import { DEFAULT_SETTINGS } from '../../data/cities';
import type { ChartData } from '../../astro/types';

interface SynastryBTRViewProps {
  chart: ChartData;
  initialTab?: 'synastry' | 'btr';
}

export const SynastryBTRView: React.FC<SynastryBTRViewProps> = ({ chart, initialTab = 'synastry' }) => {
  const [activeTab, setActiveTab] = useState<'synastry' | 'btr'>(initialTab);

  // Synastry State
  const [partnerIdx, setPartnerIdx] = useState<number>(4); // Living Chart 2 by default
  const [relType, setRelType] = useState<RelationshipType>('marriage');

  const partnerChart = React.useMemo(() => {
    const raw = SAMPLE_CHARTS[partnerIdx] || SAMPLE_CHARTS[4];
    return calculateChart(raw, DEFAULT_SETTINGS);
  }, [partnerIdx]);

  const synastryReport = React.useMemo(() => {
    return computeSynastry(chart, partnerChart, relType);
  }, [chart, partnerChart, relType]);

  // BTR State
  const [events, setEvents] = useState<BTRLifeEvent[]>([
    { id: '1', eventType: 'marriage', date: '2018-05-12', description: 'Marriage ceremony' },
    { id: '2', eventType: 'job_joining', date: '2015-08-01', description: 'First corporate job' },
    { id: '3', eventType: 'promotion', date: '2021-04-15', description: 'Promoted to Senior Lead' },
  ]);

  const [newEventDate, setNewEventDate] = useState('2020-01-01');
  const [newEventType, setNewEventType] = useState<BTREventType>('promotion');
  const [newEventDesc, setNewEventDesc] = useState('');

  const btrReport = React.useMemo(() => {
    return computeBTR(chart, events);
  }, [chart, events]);

  const handleAddEvent = () => {
    if (!newEventDate) return;
    setEvents([
      ...events,
      {
        id: String(Date.now()),
        eventType: newEventType,
        date: newEventDate,
        description: newEventDesc || undefined,
      },
    ]);
    setNewEventDesc('');
  };

  const handleRemoveEvent = (id: string) => {
    setEvents(events.filter(e => e.id !== id));
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '22px', fontWeight: 700, color: 'var(--text)' }}>
            Synastry (Multi-Chart Comparison) & Birth Time Rectification (BTR)
          </h2>
          <p style={{ margin: '4px 0 0', fontSize: '13px', color: 'var(--text-muted)' }}>
            Cross-chart planetary aspecting, house overlay dynamics & timeline event calibration for exact birth time
          </p>
        </div>

        {/* Tab Pills */}
        <div style={{ display: 'flex', gap: '6px', background: 'var(--bg-subtle)', padding: '4px', borderRadius: '8px', border: '1px solid var(--border)' }}>
          <button
            onClick={() => setActiveTab('synastry')}
            style={{
              padding: '6px 16px',
              borderRadius: '6px',
              border: 'none',
              background: activeTab === 'synastry' ? 'var(--accent)' : 'transparent',
              color: activeTab === 'synastry' ? '#fff' : 'var(--text)',
              fontWeight: 600,
              fontSize: '12.5px',
              cursor: 'pointer',
            }}
          >
            Multi-Chart Synastry
          </button>
          <button
            onClick={() => setActiveTab('btr')}
            style={{
              padding: '6px 16px',
              borderRadius: '6px',
              border: 'none',
              background: activeTab === 'btr' ? 'var(--accent)' : 'transparent',
              color: activeTab === 'btr' ? '#fff' : 'var(--text)',
              fontWeight: 600,
              fontSize: '12.5px',
              cursor: 'pointer',
            }}
          >
            BTR Calibration Workbench
          </button>
        </div>
      </div>

      {/* Tab 1: Synastry */}
      {activeTab === 'synastry' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Controls Bar */}
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap', background: 'var(--bg-elevated)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border)' }}>
            <div>
              <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>
                Compare Primary ({chart.input.name}) with:
              </label>
              <select
                value={partnerIdx}
                onChange={(e) => setPartnerIdx(Number(e.target.value))}
                style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--bg-subtle)', color: 'var(--text)', fontWeight: 600 }}
              >
                {SAMPLE_CHARTS.map((sc, idx) => (
                  <option key={sc.id} value={idx}>
                    {sc.name} ({sc.date})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>
                Relationship Nature:
              </label>
              <select
                value={relType}
                onChange={(e) => setRelType(e.target.value as RelationshipType)}
                style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--bg-subtle)', color: 'var(--text)', fontWeight: 600 }}
              >
                <option value="marriage">Marriage & Romance (वैवाहिक)</option>
                <option value="business">Business Partnership (व्यापारिक)</option>
                <option value="parent_child">Parent - Child Bond (माता-पिता / संतान)</option>
                <option value="friendship">Close Friendship (मित्रता)</option>
              </select>
            </div>

            {/* Scorecard */}
            <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Composite Synastry Score</div>
              <div style={{ fontSize: '24px', fontWeight: 700, color: synastryReport.overallScore >= 70 ? '#059669' : synastryReport.overallScore >= 50 ? '#d97706' : '#dc2626' }}>
                {synastryReport.overallScore}/100 · {synastryReport.strengthLabel}
              </div>
            </div>
          </div>

          {/* Composite Interpretation Card */}
          <div style={{ background: 'var(--bg-elevated)', borderRadius: '10px', border: '1px solid var(--border)', padding: '20px' }}>
            <h4 style={{ margin: '0 0 10px', fontSize: '15px', color: 'var(--accent)' }}>Synastry Synthesis</h4>
            <p style={{ margin: '0 0 8px', fontSize: '13.5px', lineHeight: 1.6, color: 'var(--text)' }}>
              {synastryReport.compositeInterpretation.en}
            </p>
            <p style={{ margin: 0, fontSize: '13px', lineHeight: 1.6, color: 'var(--text-muted)' }}>
              {synastryReport.compositeInterpretation.hi}
            </p>
          </div>

          {/* Cross Aspects Grid */}
          <div style={{ background: 'var(--bg-elevated)', borderRadius: '10px', border: '1px solid var(--border)', padding: '20px' }}>
            <h4 style={{ margin: '0 0 14px', fontSize: '15px', color: 'var(--text)' }}>
              Cross-Chart Planetary Aspects ({synastryReport.crossAspects.length} Active Links)
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
              {synastryReport.crossAspects.map((ca, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '12px',
                    borderRadius: '6px',
                    background: 'var(--bg-subtle)',
                    border: '1px solid var(--border)',
                    borderLeft: `4px solid ${ca.nature === 'harmonious' ? '#059669' : ca.nature === 'challenging' ? '#dc2626' : '#2563eb'}`,
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <span style={{ fontWeight: 700, fontSize: '13px', color: 'var(--text)' }}>
                      {chart.input.name}'s {ca.planet1} ↔ {partnerChart.input.name}'s {ca.planet2}
                    </span>
                    <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)' }}>
                      {ca.aspectType} (orb {ca.orbDeg}°)
                    </span>
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text)', lineHeight: 1.5 }}>
                    {ca.interpretation}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Birth Time Rectification */}
      {activeTab === 'btr' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Best Recommendation Hero */}
          <div style={{ padding: '20px', borderRadius: '10px', background: 'rgba(180, 83, 9, 0.08)', border: '1.5px solid var(--accent)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '10px' }}>
              <div>
                <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Optimal Rectified Time Recommended
                </span>
                <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text)', marginTop: '2px' }}>
                  {btrReport.bestCandidate.rectifiedTime}{' '}
                  <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--accent)' }}>
                    ({btrReport.bestCandidate.offsetMinutes >= 0 ? '+' : ''}{btrReport.bestCandidate.offsetMinutes} min)
                  </span>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Rectification Score</span>
                <div style={{ fontSize: '22px', fontWeight: 700, color: '#059669' }}>
                  {btrReport.bestCandidate.totalScore}/100
                </div>
              </div>
            </div>

            <div style={{ fontSize: '13.5px', color: 'var(--text)', lineHeight: 1.6, marginBottom: '6px' }}>
              {btrReport.guidanceEn}
            </div>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              {btrReport.guidanceHi}
            </div>
          </div>

          {/* Event Entry Strip */}
          <div style={{ background: 'var(--bg-elevated)', borderRadius: '10px', border: '1px solid var(--border)', padding: '20px' }}>
            <h4 style={{ margin: '0 0 12px', fontSize: '15px', color: 'var(--text)' }}>
              Verified Major Life Milestones ({events.length} Recorded)
            </h4>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center', marginBottom: '16px' }}>
              <select
                value={newEventType}
                onChange={(e) => setNewEventType(e.target.value as BTREventType)}
                style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--bg-subtle)', color: 'var(--text)', fontSize: '12.5px' }}
              >
                <option value="marriage">Marriage</option>
                <option value="child_birth">Child Birth</option>
                <option value="job_joining">New Job</option>
                <option value="promotion">Promotion</option>
                <option value="illness_surgery">Surgery / Illness</option>
                <option value="foreign_travel">Foreign Travel</option>
                <option value="property_vehicle">Property / Vehicle</option>
                <option value="loss_litigation">Litigation / Loss</option>
                <option value="major_success">Major Success</option>
              </select>

              <input
                type="date"
                value={newEventDate}
                onChange={(e) => setNewEventDate(e.target.value)}
                style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--bg-subtle)', color: 'var(--text)', fontSize: '12.5px' }}
              />

              <input
                type="text"
                placeholder="Brief description (optional)"
                value={newEventDesc}
                onChange={(e) => setNewEventDesc(e.target.value)}
                style={{ flex: 1, minWidth: '180px', padding: '6px 10px', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--bg-subtle)', color: 'var(--text)', fontSize: '12.5px' }}
              />

              <button
                onClick={handleAddEvent}
                style={{ padding: '6px 16px', borderRadius: '6px', border: 'none', background: 'var(--accent)', color: '#fff', fontWeight: 600, fontSize: '12.5px', cursor: 'pointer' }}
              >
                + Add Milestone
              </button>
            </div>

            {/* Event List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {events.map((ev) => (
                <div key={ev.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', borderRadius: '6px', background: 'var(--bg-subtle)', border: '1px solid var(--border)' }}>
                  <div>
                    <strong style={{ fontSize: '13px', color: 'var(--accent)', textTransform: 'capitalize' }}>{ev.eventType.replace('_', ' ')}</strong>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)', marginLeft: '10px' }}>({ev.date})</span>
                    {ev.description && <span style={{ fontSize: '12px', color: 'var(--text)', marginLeft: '10px' }}>· {ev.description}</span>}
                  </div>
                  <button
                    onClick={() => handleRemoveEvent(ev.id)}
                    style={{ background: 'transparent', border: 'none', color: '#dc2626', fontSize: '13px', cursor: 'pointer', fontWeight: 700 }}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Candidate Offsets Table */}
          <div style={{ background: 'var(--bg-elevated)', borderRadius: '10px', border: '1px solid var(--border)', padding: '20px' }}>
            <h4 style={{ margin: '0 0 12px', fontSize: '15px', color: 'var(--text)' }}>
              Offset Simulation Spectrum (-15 to +15 Minutes)
            </h4>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12.5px' }}>
                <thead>
                  <tr style={{ background: 'var(--bg-subtle)', textAlign: 'left', borderBottom: '2px solid var(--border)' }}>
                    <th style={{ padding: '8px' }}>Offset</th>
                    <th style={{ padding: '8px' }}>Candidate Time</th>
                    <th style={{ padding: '8px' }}>D1 Lagna</th>
                    <th style={{ padding: '8px' }}>D9 Lagna</th>
                    <th style={{ padding: '8px' }}>D10 Lagna</th>
                    <th style={{ padding: '8px' }}>KP Sub-Lord</th>
                    <th style={{ padding: '8px' }}>Pranapada</th>
                    <th style={{ padding: '8px' }}>Kunda</th>
                    <th style={{ padding: '8px' }}>Confidence Score</th>
                  </tr>
                </thead>
                <tbody>
                  {btrReport.candidates.map((cand) => (
                    <tr
                      key={cand.offsetMinutes}
                      style={{
                        borderBottom: '1px solid var(--border)',
                        background: cand.offsetMinutes === btrReport.bestCandidate.offsetMinutes ? 'rgba(180, 83, 9, 0.1)' : 'transparent',
                        fontWeight: cand.offsetMinutes === btrReport.bestCandidate.offsetMinutes ? 700 : 400,
                      }}
                    >
                      <td style={{ padding: '8px' }}>{cand.offsetMinutes >= 0 ? `+${cand.offsetMinutes}` : cand.offsetMinutes} min</td>
                      <td style={{ padding: '8px' }}>{cand.rectifiedTime}</td>
                      <td style={{ padding: '8px' }}>{cand.d1AscSign}</td>
                      <td style={{ padding: '8px' }}>{cand.d9AscSign}</td>
                      <td style={{ padding: '8px' }}>{cand.d10AscSign}</td>
                      <td style={{ padding: '8px', color: 'var(--accent)' }}>{cand.kpSubLord}</td>
                      <td style={{ padding: '8px', color: cand.pranapadaAligned ? '#059669' : 'var(--text-muted)' }}>
                        {cand.pranapadaAligned ? '✓ Aligned' : '—'}
                      </td>
                      <td style={{ padding: '8px', color: cand.kundaAligned ? '#059669' : 'var(--text-muted)' }}>
                        {cand.kundaAligned ? '✓ Aligned' : '—'}
                      </td>
                      <td style={{ padding: '8px', color: cand.totalScore >= 75 ? '#059669' : 'var(--text)' }}>
                        {cand.totalScore}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SynastryBTRView;
