/**
 * SadeSatiView.tsx
 * UI for Sade Sati, Dhaiya, Kantaka Shani & Ashtama Shani with Moorti Nirnaya.
 */

import React, { useMemo } from 'react';
import { formatDateDmy, formatDateTimeDmyAmPm } from '../../astro/time';
import { ChartData } from '../../astro/types';
import {
  computeSadeSatiPhases,
  SadeSatiPhase,
  DhaiyaPhase,
  KantakaShaniPhase,
  SadeSatiReport,
  SadeSatiCurrentStatus,
} from '../../astro/sadeSatiTransits';

// ─── Props ────────────────────────────────────────────────────────────────────

interface SadeSatiViewProps {
  chart: ChartData;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function intensityDots(level: 1 | 2 | 3): string {
  return '●'.repeat(level) + '○'.repeat(3 - level);
}

function intensityLabel(level: 1 | 2 | 3): string {
  return level === 1 ? 'Low' : level === 2 ? 'Medium' : 'High';
}

function formatDate(iso: string): string {
  return formatDateDmy(iso);
}

function statusBadgeClass(status: SadeSatiCurrentStatus): string {
  if (status.isInSadeSati) return 'sss-badge sss-badge--sadeSati';
  if (status.isInDhaiya)   return 'sss-badge sss-badge--dhaiya';
  if (status.isInKantaka)  return 'sss-badge sss-badge--kantaka';
  return 'sss-badge sss-badge--none';
}

function statusBadgeText(status: SadeSatiCurrentStatus): string {
  if (status.isInSadeSati) {
    const labels: Record<1|2|3, string> = { 1: 'Rising', 2: 'Peak', 3: 'Setting' };
    return `Sade Sati — ${labels[status.activeSadeSatiCharan!]}`;
  }
  if (status.isInDhaiya) return status.activeDhaiyaSubType === 'ardhaashtama' ? 'Dhaiya (4th)' : 'Dhaiya (8th)';
  if (status.isInKantaka) return `Kantaka Shani (${status.activeKantakaHouse}th)`;
  return 'No Major Affliction';
}

function statusBadgeTextHi(status: SadeSatiCurrentStatus): string {
  if (status.isInSadeSati) {
    const labelsHi: Record<1|2|3, string> = { 1: 'उदय', 2: 'मध्य', 3: 'अस्त' };
    return `साढ़ेसाती — ${labelsHi[status.activeSadeSatiCharan!]}`;
  }
  if (status.isInDhaiya) return status.activeDhaiyaSubType === 'ardhaashtama' ? 'ढय्या (4था)' : 'ढय्या (8वाँ)';
  if (status.isInKantaka) return `कंटक शनि (${status.activeKantakaHouse}वाँ)`;
  return 'कोई प्रमुख दोष नहीं';
}

function moortiColor(moorti: string): string {
  switch (moorti) {
    case 'Swarna': return '#f59e0b';
    case 'Rajat':  return '#94a3b8';
    case 'Tamra':  return '#b45309';
    case 'Loha':   return '#6b7280';
    default:       return '#6b7280';
  }
}

// ─── Sub-components ───────────────────────────────────────────────────────────

const StatusCard: React.FC<{ status: SadeSatiCurrentStatus }> = ({ status }) => (
  <div className="sss-status-card">
    <div className="sss-status-header">
      <span className="sss-status-title">Shani Gochar Status / शनि गोचर स्थिति</span>
      <span className={statusBadgeClass(status)}>
        {statusBadgeText(status)}
        <br />
        <small>{statusBadgeTextHi(status)}</small>
      </span>
    </div>

    <div className="sss-status-grid">
      <div className="sss-status-cell">
        <span className="sss-status-cell-label">Transit Saturn / गोचर शनि</span>
        <span className="sss-status-cell-value">{status.currentSaturnSignName}</span>
      </div>
      <div className="sss-status-cell">
        <span className="sss-status-cell-label">Natal Moon / जन्म चंद्र</span>
        <span className="sss-status-cell-value">{status.moonSignName}</span>
      </div>
      <div className="sss-status-cell">
        <span className="sss-status-cell-label">Natal Lagna / जन्म लग्न</span>
        <span className="sss-status-cell-value">{status.lagnaSignName}</span>
      </div>
    </div>

    <div className="sss-status-summary">
      <p>{status.statusSummaryEn}</p>
      <p className="sss-hindi">{status.statusSummaryHi}</p>
    </div>
  </div>
);

const MoortiCard: React.FC<{ status: SadeSatiCurrentStatus }> = ({ status }) => {
  const { moortiNirnaya } = status;
  const color = moortiColor(moortiNirnaya.moortiType);
  return (
    <div className="sss-moorti-card" style={{ borderLeftColor: color }}>
      <div className="sss-moorti-header">
        <span className="sss-moorti-icon" style={{ color }}>◆</span>
        <div>
          <span className="sss-moorti-title">Moorti Nirnaya / मूर्ति निर्णय</span>
          <span className="sss-moorti-type" style={{ color }}>
            {moortiNirnaya.moortiType} — {moortiNirnaya.moortiHi}
          </span>
        </div>
      </div>
      <div className="sss-moorti-body">
        <p>{moortiNirnaya.description}</p>
        <p className="sss-hindi">{moortiNirnaya.descriptionHi}</p>
        <div className="sss-moorti-detail-row">
          <span>Transit Nakshatra: <strong>{moortiNirnaya.transitSaturnNakshatraName}</strong></span>
          <span>Position from Lord's Sign: <strong>{moortiNirnaya.relativePosition}th</strong></span>
        </div>
      </div>
    </div>
  );
};

const RemedyCard: React.FC<{ status: SadeSatiCurrentStatus; report: SadeSatiReport }> = ({ status, report }) => {
  let remedy = '';
  let titleEn = 'No Active Affliction';
  let titleHi = 'कोई सक्रिय दोष नहीं';

  if (status.isInSadeSati && status.activeSadeSatiCharan) {
    const phase = report.sadeSatiPhases.find(p => {
      const start = new Date(p.startDate).getTime();
      const end   = new Date(p.endDate).getTime();
      const now   = Date.now();
      return p.charan === status.activeSadeSatiCharan && now >= start && now <= end;
    }) || report.sadeSatiPhases.find(p => p.charan === status.activeSadeSatiCharan);
    remedy = phase?.classicalRemedy ?? '';
    titleEn = `Remedy for Sade Sati — ${phase?.charanLabel ?? ''}`;
    titleHi = `साढ़ेसाती उपाय — ${phase?.charanLabelHi ?? ''}`;
  } else if (status.isInDhaiya && status.activeDhaiyaSubType) {
    const phase = report.dhaiyaPhases.find(p => p.subType === status.activeDhaiyaSubType);
    remedy = phase?.classicalRemedy ?? '';
    titleEn = 'Remedy for Dhaiya';
    titleHi = 'ढय्या उपाय';
  } else if (status.isInKantaka && status.activeKantakaHouse) {
    const phase = report.kantakaPhases.find(
      p => p.kantakaHouse === status.activeKantakaHouse && p.reference === status.activeKantakaReference,
    );
    remedy = phase?.classicalRemedy ?? '';
    titleEn = `Remedy for Kantaka Shani (${status.activeKantakaHouse}th)`;
    titleHi = `कंटक शनि उपाय (${status.activeKantakaHouse}वाँ)`;
  }

  return (
    <div className="sss-moorti-card sss-remedy-card">
      <div className="sss-moorti-header">
        <div>
          <span className="sss-moorti-title">{titleEn}</span>
          <span className="sss-moorti-type" style={{ color: '#10b981' }}>{titleHi}</span>
        </div>
      </div>
      {remedy ? (
        <div className="sss-moorti-body">
          <p>{remedy}</p>
        </div>
      ) : (
        <div className="sss-moorti-body">
          <p className="sss-muted">No specific remedy needed. Maintain regular spiritual practice.</p>
          <p className="sss-hindi sss-muted">कोई विशेष उपाय आवश्यक नहीं। नियमित साधना जारी रखें।</p>
        </div>
      )}
    </div>
  );
};

// ─── Timeline table rows ───────────────────────────────────────────────────────

const SadeSatiRow: React.FC<{ phase: SadeSatiPhase }> = ({ phase }) => {
  const now = Date.now();
  const start = new Date(phase.startDate).getTime();
  const end   = new Date(phase.endDate).getTime();
  const isActive = now >= start && now <= end;
  const isPast   = now > end;

  return (
    <tr className={`sss-phase-row ${isActive ? 'sss-phase-row--active' : ''} ${isPast ? 'sss-phase-row--past' : ''}`}>
      <td><span className="sss-type-badge sss-type-badge--ss">Sade Sati</span></td>
      <td>
        <span>{phase.charanLabel}</span>
        <span className="sss-hindi-sm">{phase.charanLabelHi}</span>
      </td>
      <td>{phase.signName}<span className="sss-hindi-sm">{phase.signNameHi}</span></td>
      <td>{formatDate(phase.startDate)}</td>
      <td>{formatDate(phase.endDate)}</td>
      <td>
        <span className={`sss-intensity sss-intensity--${phase.intensityLevel}`}>
          {intensityDots(phase.intensityLevel)} {intensityLabel(phase.intensityLevel)}
        </span>
      </td>
      {isActive && <td><span className="sss-active-label">▶ Active</span></td>}
      {!isActive && <td>{isPast ? '✓ Past' : '⬤ Upcoming'}</td>}
    </tr>
  );
};

const DhaiyaRow: React.FC<{ phase: DhaiyaPhase }> = ({ phase }) => {
  const now = Date.now();
  const start = new Date(phase.startDate).getTime();
  const end   = new Date(phase.endDate).getTime();
  const isActive = now >= start && now <= end;
  const isPast   = now > end;

  return (
    <tr className={`sss-phase-row ${isActive ? 'sss-phase-row--active' : ''} ${isPast ? 'sss-phase-row--past' : ''}`}>
      <td><span className="sss-type-badge sss-type-badge--dhaiya">Dhaiya</span></td>
      <td>
        <span>{phase.subType === 'ardhaashtama' ? 'Ardhaashtama (4th)' : 'Ashtama (8th)'}</span>
        <span className="sss-hindi-sm">{phase.subType === 'ardhaashtama' ? 'अर्धाष्टम' : 'अष्टम'}</span>
      </td>
      <td>{phase.signName}<span className="sss-hindi-sm">{phase.signNameHi}</span></td>
      <td>{formatDate(phase.startDate)}</td>
      <td>{formatDate(phase.endDate)}</td>
      <td>
        <span className={`sss-intensity sss-intensity--${phase.intensityLevel}`}>
          {intensityDots(phase.intensityLevel)} {intensityLabel(phase.intensityLevel)}
        </span>
      </td>
      {isActive && <td><span className="sss-active-label">▶ Active</span></td>}
      {!isActive && <td>{isPast ? '✓ Past' : '⬤ Upcoming'}</td>}
    </tr>
  );
};

const KantakaRow: React.FC<{ phase: KantakaShaniPhase }> = ({ phase }) => {
  const now = Date.now();
  const start = new Date(phase.startDate).getTime();
  const end   = new Date(phase.endDate).getTime();
  const isActive = now >= start && now <= end;
  const isPast   = now > end;

  return (
    <tr className={`sss-phase-row ${isActive ? 'sss-phase-row--active' : ''} ${isPast ? 'sss-phase-row--past' : ''}`}>
      <td><span className="sss-type-badge sss-type-badge--kantaka">Kantaka</span></td>
      <td>
        <span>{phase.kantakaHouse}th from {phase.reference === 'moon' ? 'Moon' : 'Lagna'}</span>
        <span className="sss-hindi-sm">{`${phase.reference === 'moon' ? 'चंद्र' : 'लग्न'} से ${phase.kantakaHouse}वाँ`}</span>
      </td>
      <td>{phase.signName}<span className="sss-hindi-sm">{phase.signNameHi}</span></td>
      <td>{formatDate(phase.startDate)}</td>
      <td>{formatDate(phase.endDate)}</td>
      <td>
        <span className={`sss-intensity sss-intensity--${phase.intensityLevel}`}>
          {intensityDots(phase.intensityLevel)} {intensityLabel(phase.intensityLevel)}
        </span>
      </td>
      {isActive && <td><span className="sss-active-label">▶ Active</span></td>}
      {!isActive && <td>{isPast ? '✓ Past' : '⬤ Upcoming'}</td>}
    </tr>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

const SadeSatiView: React.FC<SadeSatiViewProps> = ({ chart }) => {
  const report: SadeSatiReport = useMemo(() => computeSadeSatiPhases(chart), [chart]);

  return (
    <div className="sss-root">
      {/* ── Desktop Software Titlebar ── */}
      <div className="sw-titlebar" style={{ borderRadius: '12px' }}>
        <div className="sw-title-left">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span className="sw-badge sw-badge-warning">
              गोचर शनि विश्लेषण
            </span>
            <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
              Parashara Shani Gochar · Moorti Nirnaya · 20-Year Timeline
            </span>
          </div>
          <h2>
            शनि गोचर एवं साढ़ेसाती महा-विश्लेषण / Saturn Transit &amp; Sade Sati Workstation
          </h2>
          <p>
            गोचर शनि, जन्म चंद्र एवं लग्न सापेक्ष स्थिति, मूर्ति निर्णय (स्वर्ण/रजत/ताम्र/लोह) एवं २० वर्षीय संपूर्ण कालक्रम।
          </p>
        </div>
        <div className="sw-native-pill">
          {chart.input.name} ({formatDateTimeDmyAmPm(chart.input.date, chart.input.time)})
        </div>
      </div>

      {/* ── Current Status ── */}
      <StatusCard status={report.currentStatus} />

      {/* ── Moorti Nirnaya ── */}
      <MoortiCard status={report.currentStatus} />

      {/* ── Classical Remedy ── */}
      <RemedyCard status={report.currentStatus} report={report} />

      {/* ── Timeline Table ── */}
      <div className="sss-section">
        <h3 className="sss-section-title">Saturn Transit Timeline / शनि गोचर कालक्रम</h3>
        <p className="sss-section-subtitle">
          Showing phases from last 10 years to next 20 years &nbsp;|&nbsp;
          <span className="sss-hindi">पिछले 10 वर्ष से अगले 20 वर्ष तक के चरण</span>
        </p>

        <div className="sss-timeline-scroll">
          <table className="sss-timeline-table">
            <thead>
              <tr>
                <th>Type / प्रकार</th>
                <th>Phase / चरण</th>
                <th>Sign / राशि</th>
                <th>Start / आरम्भ</th>
                <th>End / अंत</th>
                <th>Intensity / तीव्रता</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {report.sadeSatiPhases.map((p, i) => <SadeSatiRow key={`ss-${i}`} phase={p} />)}
              {report.dhaiyaPhases.map((p, i) => <DhaiyaRow key={`dh-${i}`} phase={p} />)}
              {report.kantakaPhases.map((p, i) => <KantakaRow key={`kt-${i}`} phase={p} />)}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Affected Areas ── */}
      {(report.currentStatus.isInSadeSati || report.currentStatus.isInDhaiya || report.currentStatus.isInKantaka) && (
        <div className="sss-section">
          <h3 className="sss-section-title">Currently Affected Areas / प्रभावित क्षेत्र</h3>
          <div className="sss-affected-areas">
            {(() => {
              const st = report.currentStatus;
              let areas: string[] = [];
              if (st.isInSadeSati && st.activeSadeSatiCharan) {
                const phase = report.sadeSatiPhases.find(p => p.charan === st.activeSadeSatiCharan);
                areas = phase?.affectedAreas ?? [];
              } else if (st.isInDhaiya && st.activeDhaiyaSubType) {
                const phase = report.dhaiyaPhases.find(p => p.subType === st.activeDhaiyaSubType);
                areas = phase?.affectedAreas ?? [];
              } else if (st.isInKantaka && st.activeKantakaHouse) {
                const phase = report.kantakaPhases.find(
                  p => p.kantakaHouse === st.activeKantakaHouse && p.reference === st.activeKantakaReference,
                );
                areas = phase?.affectedAreas ?? [];
              }
              return areas.map((area, i) => (
                <span key={i} className="sss-area-tag">{area}</span>
              ));
            })()}
          </div>
        </div>
      )}

      {/* ── Legend ── */}
      <div className="sss-legend">
        <span className="sss-type-badge sss-type-badge--ss">Sade Sati</span>
        <span className="sss-type-badge sss-type-badge--dhaiya">Dhaiya</span>
        <span className="sss-type-badge sss-type-badge--kantaka">Kantaka</span>
        <span className="sss-muted" style={{ fontSize: '12px' }}>
          Approximate dates based on mean Saturn motion · Saturn reference: 0° Capricorn on Jan 24, 2020
        </span>
      </div>
    </div>
  );
};

export default SadeSatiView;
