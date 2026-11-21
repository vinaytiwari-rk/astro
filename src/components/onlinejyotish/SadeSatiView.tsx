/**
 * SadeSatiView.tsx
 * Complete Classical Shani Gochar, Sade Sati, Kantaka Shani & Moorti Nirnaya Workstation.
 */

import React, { useMemo } from 'react';
import {
  Activity,
  AlertTriangle,
  Award,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  Compass,
  Eye,
  Flame,
  Info,
  Layers,
  Shield,
  Sparkles,
  Zap,
} from 'lucide-react';
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

function ordinalEn(n: number): string {
  if (n === 1) return '1st';
  if (n === 2) return '2nd';
  if (n === 3) return '3rd';
  return `${n}th`;
}

function ordinalHi(n: number): string {
  if (n === 1) return 'प्रथम (1st)';
  if (n === 2) return 'द्वितीय (2nd)';
  if (n === 3) return 'तृतीय (3rd)';
  if (n === 4) return 'चतुर्थ (4th)';
  if (n === 7) return 'सप्तम (7th)';
  if (n === 8) return 'अष्टम (8th)';
  if (n === 10) return 'दशम (10th)';
  return `${n}वाँ`;
}

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
    const labels: Record<1|2|3, string> = { 1: 'Rising (Uday)', 2: 'Peak (Madhya)', 3: 'Setting (Asta)' };
    return `Sade Sati — ${labels[status.activeSadeSatiCharan!]}`;
  }
  if (status.isInDhaiya) {
    return status.activeDhaiyaSubType === 'ardhaashtama' ? 'Ardhaashtama Dhaiya (4th House)' : 'Ashtama Dhaiya (8th House)';
  }
  if (status.isInKantaka) {
    return `Kantaka Shani (${ordinalEn(status.activeKantakaHouse!)} House)`;
  }
  return 'Favorable Shani Gochar (No Affliction)';
}

function statusBadgeTextHi(status: SadeSatiCurrentStatus): string {
  if (status.isInSadeSati) {
    const labelsHi: Record<1|2|3, string> = { 1: 'उदय चरण', 2: 'मध्य चरण', 3: 'अस्त चरण' };
    return `साढ़ेसाती — ${labelsHi[status.activeSadeSatiCharan!]}`;
  }
  if (status.isInDhaiya) {
    return status.activeDhaiyaSubType === 'ardhaashtama' ? 'अर्धाष्टम ढय्या (चतुर्थ भाव)' : 'अष्टम ढय्या (अष्टम भाव)';
  }
  if (status.isInKantaka) {
    return `कंटक शनि (${ordinalHi(status.activeKantakaHouse!)} भाव)`;
  }
  return 'शुभ शनि गोचर (कोई दोष नहीं)';
}

function moortiColor(moorti: string): string {
  switch (moorti) {
    case 'Swarna': return '#f59e0b';
    case 'Rajat':  return '#94a3b8';
    case 'Tamra':  return '#b45309';
    case 'Loha':   return '#ef4444';
    default:       return '#6b7280';
  }
}

function moortiFavorability(moorti: string): { percent: number; labelEn: string; labelHi: string } {
  switch (moorti) {
    case 'Swarna':
      return { percent: 95, labelEn: 'Exceptional (Royal Blessings & Unexpected Wealth)', labelHi: 'परम शुभ (राजकृपा व अप्रत्याशित धन)' };
    case 'Rajat':
      return { percent: 75, labelEn: 'Highly Auspicious (Wisdom, Harmony & Gains)', labelHi: 'अति शुभ (विद्या, शांति व आर्थिक लाभ)' };
    case 'Tamra':
      return { percent: 50, labelEn: 'Moderate (Progress Through Persistent Effort)', labelHi: 'मध्यम शुभ (परिश्रम से कार्यसिद्धि)' };
    case 'Loha':
      return { percent: 25, labelEn: 'Challenging (Delays & Heavy Karmic Testing — Remedies Advised)', labelHi: 'कठिन काल (बाधाएं व कर्म परीक्षा — उपाय अनिवार्य)' };
    default:
      return { percent: 50, labelEn: 'Neutral', labelHi: 'तटस्थ' };
  }
}

// ─── Sub-components ───────────────────────────────────────────────────────────

const StatusCard: React.FC<{ status: SadeSatiCurrentStatus; chart: ChartData }> = ({ status, chart }) => {
  // Calculate relative houses from Lagna and Moon
  const lagnaSign = status.lagnaSignIndex;
  const moonSign = status.moonSignIndex;
  const saturnSign = status.currentSaturnSignIndex;

  const houseFromLagna = ((saturnSign - lagnaSign + 12) % 12) + 1;
  const houseFromMoon = ((saturnSign - moonSign + 12) % 12) + 1;

  return (
    <div className="sss-status-card" style={{ borderTop: '4px solid #3b82f6', background: 'var(--bg-card, #ffffff)' }}>
      <div className="sss-status-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Activity className="h-5 w-5 text-blue-500" />
          <span className="sss-status-title">Shani Gochar Status / शनि गोचर वर्तमान स्थिति</span>
        </div>
        <span className={statusBadgeClass(status)}>
          {statusBadgeText(status)}
          <br />
          <small>{statusBadgeTextHi(status)}</small>
        </span>
      </div>

      <div className="sss-status-grid">
        <div className="sss-status-cell">
          <span className="sss-status-cell-label">Transit Saturn / गोचर शनि</span>
          <span className="sss-status-cell-value" style={{ color: '#2563eb', fontWeight: 800 }}>
            {status.currentSaturnSignName} (मीन)
          </span>
          <span style={{ fontSize: '0.74rem', color: '#64748b' }}>
            Lagna से {ordinalHi(houseFromLagna)} | Moon से {ordinalHi(houseFromMoon)}
          </span>
        </div>
        <div className="sss-status-cell">
          <span className="sss-status-cell-label">Natal Lagna / जन्म लग्न</span>
          <span className="sss-status-cell-value">
            {status.lagnaSignName}
          </span>
          <span style={{ fontSize: '0.74rem', color: '#64748b' }}>
            {houseFromLagna === 1 || houseFromLagna === 4 || houseFromLagna === 7 || houseFromLagna === 10
              ? `कंटक शनि (${ordinalHi(houseFromLagna)} केंद्र भाव)`
              : `भाव ${houseFromLagna} प्रभाव`}
          </span>
        </div>
        <div className="sss-status-cell">
          <span className="sss-status-cell-label">Natal Moon / जन्म चंद्र (राशि)</span>
          <span className="sss-status-cell-value">
            {status.moonSignName}
          </span>
          <span style={{ fontSize: '0.74rem', color: '#64748b' }}>
            {houseFromMoon === 6 ? '६ठा भाव (उपचय - शत्रुहंता व विजय)' : `चंद्र से ${houseFromMoon} भाव`}
          </span>
        </div>
        <div className="sss-status-cell">
          <span className="sss-status-cell-label">Active Phase / सक्रिय अवस्था</span>
          <span className="sss-status-cell-value" style={{ color: '#d97706', fontWeight: 800 }}>
            {status.isInSadeSati
              ? 'साढ़ेसाती'
              : status.isInDhaiya
                ? 'ढय्या'
                : status.isInKantaka
                  ? `कंटक शनि (${ordinalHi(status.activeKantakaHouse!)})`
                  : 'सामान्य गोचर'}
          </span>
          <span style={{ fontSize: '0.74rem', color: '#64748b' }}>
            {status.isInKantaka ? 'शारीरिक व कार्यक्षेत्र परीक्षा' : 'प्राकृतिक कर्म चक्र'}
          </span>
        </div>
      </div>

      <div className="sss-status-summary" style={{ background: 'var(--bg-subtle, #f8fafc)', padding: '14px', borderRadius: '8px', border: '1px solid var(--border-color, #e2e8f0)' }}>
        <p style={{ margin: '0 0 6px 0', fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary, #0f172a)' }}>
          {status.statusSummaryEn}
        </p>
        <p className="sss-hindi" style={{ margin: 0, fontSize: '0.84rem', color: '#475569' }}>
          {status.statusSummaryHi}
        </p>
      </div>
    </div>
  );
};

const MoortiCard: React.FC<{ status: SadeSatiCurrentStatus }> = ({ status }) => {
  const { moortiNirnaya } = status;
  const color = moortiColor(moortiNirnaya.moortiType);
  const favor = moortiFavorability(moortiNirnaya.moortiType);

  return (
    <div className="sss-moorti-card" style={{ borderLeft: `6px solid ${color}`, background: 'var(--bg-card, #ffffff)' }}>
      <div className="sss-moorti-header">
        <Shield className="h-6 w-6" style={{ color }} />
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
            <span className="sss-moorti-title" style={{ fontSize: '1.1rem', fontWeight: 700 }}>
              Moorti Nirnaya Engine / मूर्ति निर्णय (शास्त्रीय धातु फल)
            </span>
            <span
              style={{
                background: `${color}18`,
                color,
                border: `1px solid ${color}55`,
                padding: '4px 12px',
                borderRadius: '6px',
                fontWeight: 700,
                fontSize: '0.85rem',
              }}
            >
              {moortiNirnaya.moortiType} Moorti — {moortiNirnaya.moortiHi} ({favor.percent}% Auspicious)
            </span>
          </div>
          <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
            शास्त्रीय नियम: गोचर शनि के राशि प्रवेश काल में जन्म चंद्र से गोचर चंद्र की स्थिति अनुसार ४ मूर्तियां (स्वर्ण, रजत, ताम्र, लोह)
          </span>
        </div>
      </div>

      <div className="sss-moorti-body">
        {/* Progress Bar */}
        <div style={{ margin: '10px 0 14px 0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '4px' }}>
            <span style={{ fontWeight: 600 }}>{favor.labelEn}</span>
            <span style={{ fontWeight: 700, color }}>{favor.percent}%</span>
          </div>
          <div style={{ height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${favor.percent}%`, background: color, borderRadius: '4px' }} />
          </div>
        </div>

        <p style={{ margin: '0 0 6px 0', fontSize: '0.86rem', lineHeight: 1.5 }}>{moortiNirnaya.description}</p>
        <p className="sss-hindi" style={{ margin: '0 0 12px 0', fontSize: '0.84rem', color: '#475569', lineHeight: 1.5 }}>
          {moortiNirnaya.descriptionHi}
        </p>

        <div className="sss-moorti-detail-row" style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', fontSize: '0.8rem', background: 'var(--bg-subtle, #f8fafc)', padding: '10px 14px', borderRadius: '8px' }}>
          <span>
            गोचर शनि नक्षत्र: <strong>{moortiNirnaya.transitSaturnNakshatraName}</strong>
          </span>
          <span>
            गोचर चंद्र स्थिति: <strong>{ordinalHi(moortiNirnaya.relativePosition)} भाव ({ordinalEn(moortiNirnaya.relativePosition)} House from Moon)</strong>
          </span>
          <span>
            शास्त्रीय वर्ग: <strong>{moortiNirnaya.relativePosition === 1 || moortiNirnaya.relativePosition === 6 || moortiNirnaya.relativePosition === 11 ? 'स्वर्ण (1,6,11)' : moortiNirnaya.relativePosition === 2 || moortiNirnaya.relativePosition === 5 || moortiNirnaya.relativePosition === 9 ? 'रजत (2,5,9)' : moortiNirnaya.relativePosition === 3 || moortiNirnaya.relativePosition === 7 || moortiNirnaya.relativePosition === 10 ? 'ताम्र (3,7,10)' : 'लोह (4,8,12)'}</strong>
          </span>
        </div>
      </div>
    </div>
  );
};

const ShaniAspectsCard: React.FC<{ status: SadeSatiCurrentStatus; chart: ChartData }> = ({ status, chart }) => {
  const saturnSign = status.currentSaturnSignIndex;
  const lagnaSign = status.lagnaSignIndex;
  const moonSign = status.moonSignIndex;

  // 3rd, 7th, 10th signs from Saturn
  const thirdSign = (saturnSign + 2) % 12;
  const seventhSign = (saturnSign + 6) % 12;
  const tenthSign = (saturnSign + 9) % 12;

  const signNamesEn = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
  const signNamesHi = ['मेष', 'वृषभ', 'मिथुन', 'कर्क', 'सिंह', 'कन्या', 'तुला', 'वृश्चिक', 'धनु', 'मकर', 'कुम्भ', 'मीन'];

  const houseFromLagna = (sign: number) => ((sign - lagnaSign + 12) % 12) + 1;
  const houseFromMoon = (sign: number) => ((sign - moonSign + 12) % 12) + 1;

  const aspects = [
    {
      drish: '3rd Aspect (तृतीय दृष्टि)',
      signEn: signNamesEn[thirdSign],
      signHi: signNamesHi[thirdSign],
      hLagna: houseFromLagna(thirdSign),
      hMoon: houseFromMoon(thirdSign),
      meaningEn: 'Courage, siblings, speech, liquid cash, and mental resolve. Requires patience in financial outlays.',
      meaningHi: 'पराक्रम, वाणी, संचित धन, भाई-बहन एवं मानसिक धैर्य पर प्रभाव। व्यर्थ वाद-विवाद से बचें।',
    },
    {
      drish: '7th Aspect (सप्तम दृष्टि)',
      signEn: signNamesEn[seventhSign],
      signHi: signNamesHi[seventhSign],
      hLagna: houseFromLagna(seventhSign),
      hMoon: houseFromMoon(seventhSign),
      meaningEn: 'Partnerships, spouse, commercial contracts, and public image. Demands transparency.',
      meaningHi: 'दाम्पत्य जीवन, साझेदारी व्यापार, अनुबंध एवं लोक व्यवहार पर प्रभाव। सहयोगियों से तालमेल रखें।',
    },
    {
      drish: '10th Aspect (दशम दृष्टि)',
      signEn: signNamesEn[tenthSign],
      signHi: signNamesHi[tenthSign],
      hLagna: houseFromLagna(tenthSign),
      hMoon: houseFromMoon(tenthSign),
      meaningEn: 'Career karma, authority, superiors, government dealings, and long-term status.',
      meaningHi: 'कर्मक्षेत्र, पद-प्रतिष्ठा, उच्चाधिकारियों से संबंध एवं आजीविका पर प्रभाव। निष्ठा से दायित्व निभाएं।',
    },
  ];

  return (
    <div className="sss-status-card" style={{ borderTop: '4px solid #8b5cf6', background: 'var(--bg-card, #ffffff)' }}>
      <div className="sss-status-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Eye className="h-5 w-5 text-purple-500" />
          <span className="sss-status-title">Shani Special 3rd, 7th & 10th Aspects / शनि की विशेष दृष्टियां</span>
        </div>
        <span className="sw-badge sw-badge-neutral">
          मीन राशि से दृष्ट भाव
        </span>
      </div>

      <p style={{ fontSize: '0.82rem', color: '#64748b', margin: '0 0 14px 0', lineHeight: 1.5 }}>
        महर्षि पराशर सिद्धांत: गोचर शनि अपनी स्थिति (मीन) से ३रे, ७वें और १०वें भाव पर पूर्ण दृष्टि डालते हैं। यह दृष्टियां जातक के संबंधित भावों में कर्म परीक्षा और पुनर्गठन करती हैं:
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
        {aspects.map((asp, idx) => (
          <div
            key={idx}
            style={{
              background: 'var(--bg-subtle, #f8fafc)',
              border: '1px solid var(--border-color, #e2e8f0)',
              borderRadius: '8px',
              padding: '12px 14px',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 700, fontSize: '0.88rem', color: '#7c3aed' }}>{asp.drish}</span>
              <span className="sw-badge sw-badge-warning">{asp.signEn} ({asp.signHi})</span>
            </div>
            <div style={{ fontSize: '0.78rem', color: '#334155', fontWeight: 600 }}>
              लग्न से: {ordinalHi(asp.hLagna)} भाव ({ordinalEn(asp.hLagna)} House) | चंद्र से: {ordinalHi(asp.hMoon)} भाव
            </div>
            <div style={{ fontSize: '0.78rem', color: '#475569', lineHeight: 1.4 }}>
              <strong>फलित: </strong>{asp.meaningHi}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ClassicalRemediesCard: React.FC<{ status: SadeSatiCurrentStatus; report: SadeSatiReport }> = ({ status, report }) => {
  let titleEn = 'Classical Shani Upayas & Remedial Protocol';
  let titleHi = 'शास्त्रीय शनि शांति उपाय एवं रक्षा कवच';

  if (status.isInSadeSati && status.activeSadeSatiCharan) {
    const phase = report.sadeSatiPhases.find((p) => p.charan === status.activeSadeSatiCharan);
    titleEn = `Classical Remedy for Sade Sati — ${phase?.charanLabel ?? ''}`;
    titleHi = `साढ़ेसाती विशेष उपाय — ${phase?.charanLabelHi ?? ''}`;
  } else if (status.isInDhaiya) {
    titleEn = status.activeDhaiyaSubType === 'ardhaashtama' ? 'Remedy for Ardhaashtama Dhaiya (4th House)' : 'Remedy for Ashtama Dhaiya (8th House)';
    titleHi = status.activeDhaiyaSubType === 'ardhaashtama' ? 'अर्धाष्टम ढय्या शांति उपाय (चतुर्थ भाव)' : 'अष्टम ढय्या शांति उपाय (अष्टम भाव)';
  } else if (status.isInKantaka) {
    titleEn = `Classical Remedy for Kantaka Shani (${ordinalEn(status.activeKantakaHouse!)} House)`;
    titleHi = `कंटक शनि शांति उपाय (${ordinalHi(status.activeKantakaHouse!)} भाव)`;
  }

  return (
    <div className="sss-moorti-card sss-remedy-card" style={{ borderLeft: '6px solid #10b981', background: 'var(--bg-card, #ffffff)' }}>
      <div className="sss-moorti-header">
        <Sparkles className="h-6 w-6 text-emerald-500" />
        <div>
          <span className="sss-moorti-title" style={{ fontSize: '1.1rem', fontWeight: 700 }}>
            {titleEn} / {titleHi}
          </span>
          <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
            पद्म पुराण, बृहत्पाराशर एवं नारद संहिता सम्मत प्रामाणिक कर्म शोधन
          </span>
        </div>
      </div>

      <div className="sss-moorti-body">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px', marginTop: '8px' }}>
          {/* Remedy 1 */}
          <div style={{ padding: '12px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.06)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
            <h5 style={{ margin: '0 0 4px 0', fontSize: '0.86rem', color: '#065f46', fontWeight: 700 }}>
              १. दशरथ कृत शनि स्तोत्र (Sovereign Parihara)
            </h5>
            <p style={{ margin: 0, fontSize: '0.8rem', color: '#334155', lineHeight: 1.4 }}>
              प्रतिदिन सूर्यास्त के पश्चात अथवा प्रत्येक शनिवार को राजा दशरथ रचित "शनि स्तोत्र" का पाठ करें। यह स्तोत्र साढ़ेसाती और कंटक शनि के समस्त अनिष्टों का शमन करता है।
            </p>
          </div>

          {/* Remedy 2 */}
          <div style={{ padding: '12px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.06)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
            <h5 style={{ margin: '0 0 4px 0', fontSize: '0.86rem', color: '#065f46', fontWeight: 700 }}>
              २. शनि वैदिक एवं बीज मंत्र जप
            </h5>
            <p style={{ margin: 0, fontSize: '0.8rem', color: '#334155', lineHeight: 1.4 }}>
              <strong>मंत्र: </strong> <code>ॐ प्रां प्रीं प्रौं सः शनैश्चराय नमः</code> अथवा <code>ॐ शं शनैश्चराय नमः</code>। रुद्राक्ष की माला से १०८ बार जप करें।
            </p>
          </div>

          {/* Remedy 3 */}
          <div style={{ padding: '12px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.06)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
            <h5 style={{ margin: '0 0 4px 0', fontSize: '0.86rem', color: '#065f46', fontWeight: 700 }}>
              ३. छाया दान (Chhaya Daan on Saturday)
            </h5>
            <p style={{ margin: 0, fontSize: '0.8rem', color: '#334155', lineHeight: 1.4 }}>
              शनिवार को कांसे या लोहे के कटोरे में सरसों का तेल भरकर उसमें अपना मुख देखें और डाकौत अथवा शनि मंदिर में दान करें। इससे शारीरिक व्याधियां दूर होती हैं।
            </p>
          </div>

          {/* Remedy 4 */}
          <div style={{ padding: '12px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.06)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
            <h5 style={{ margin: '0 0 4px 0', fontSize: '0.86rem', color: '#065f46', fontWeight: 700 }}>
              ४. हनुमान उपासना एवं सुंदरकांड
            </h5>
            <p style={{ margin: 0, fontSize: '0.8rem', color: '#334155', lineHeight: 1.4 }}>
              मंगलवार और शनिवार को हनुमान चालीसा का ७ बार पाठ करें। हनुमान जी के भक्तों पर शनि देव की वक्र दृष्टि का प्रभाव निष्फल हो जाता है।
            </p>
          </div>

          {/* Remedy 5: Gemstone Alert */}
          <div style={{ padding: '12px', borderRadius: '8px', background: 'rgba(239, 68, 68, 0.06)', border: '1px solid rgba(239, 68, 68, 0.2)', gridColumn: '1 / -1' }}>
            <h5 style={{ margin: '0 0 4px 0', fontSize: '0.86rem', color: '#991b1b', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <AlertTriangle className="h-4 w-4 text-red-500" />
              नीलम रत्न (Blue Sapphire) धारण संबंधी शास्त्रीय चेतावनी
            </h5>
            <p style={{ margin: 0, fontSize: '0.8rem', color: '#334155', lineHeight: 1.4 }}>
              लोह मूर्ति (Iron Moorti) अथवा कंटक शनि में बिना पूर्ण परीक्षण के नीलम कदापि धारण न करें। यदि शनि कुंडली में मारक या अकारक हैं, तो रत्न के स्थान पर शनिवार को मध्यमा अंगुली में <strong>काले घोड़े की नाल अथवा नाव की कील का अभिमंत्रित छल्ला</strong> धारण करना ही शास्त्रसम्मत है।
            </p>
          </div>
        </div>
      </div>
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
        <strong>{phase.charanLabel}</strong>
        <span className="sss-hindi-sm" style={{ display: 'block', color: '#64748b' }}>{phase.charanLabelHi}</span>
      </td>
      <td>
        <strong>{phase.signName}</strong>
        <span className="sss-hindi-sm" style={{ display: 'block', color: '#64748b' }}>{phase.signNameHi}</span>
      </td>
      <td style={{ fontFamily: 'monospace', fontWeight: 600 }}>{formatDate(phase.startDate)}</td>
      <td style={{ fontFamily: 'monospace', fontWeight: 600 }}>{formatDate(phase.endDate)}</td>
      <td>
        <span className={`sss-intensity sss-intensity--${phase.intensityLevel}`}>
          {intensityDots(phase.intensityLevel)} {intensityLabel(phase.intensityLevel)}
        </span>
      </td>
      {isActive && (
        <td>
          <span className="sw-badge sw-badge-warning">
            ▶ Active
          </span>
        </td>
      )}
      {!isActive && (
        <td>
          <span className={`sw-badge ${isPast ? 'sw-badge-neutral' : 'sw-badge-success'}`}>
            {isPast ? '✓ Past' : '⬤ Upcoming'}
          </span>
        </td>
      )}
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
        <strong>{phase.subType === 'ardhaashtama' ? 'Ardhaashtama (4th House)' : 'Ashtama (8th House)'}</strong>
        <span className="sss-hindi-sm" style={{ display: 'block', color: '#64748b' }}>{phase.subType === 'ardhaashtama' ? 'अर्धाष्टम (4था भाव)' : 'अष्टम (8वाँ भाव)'}</span>
      </td>
      <td>
        <strong>{phase.signName}</strong>
        <span className="sss-hindi-sm" style={{ display: 'block', color: '#64748b' }}>{phase.signNameHi}</span>
      </td>
      <td style={{ fontFamily: 'monospace', fontWeight: 600 }}>{formatDate(phase.startDate)}</td>
      <td style={{ fontFamily: 'monospace', fontWeight: 600 }}>{formatDate(phase.endDate)}</td>
      <td>
        <span className={`sss-intensity sss-intensity--${phase.intensityLevel}`}>
          {intensityDots(phase.intensityLevel)} {intensityLabel(phase.intensityLevel)}
        </span>
      </td>
      {isActive && (
        <td>
          <span className="sw-badge sw-badge-warning">
            ▶ Active
          </span>
        </td>
      )}
      {!isActive && (
        <td>
          <span className={`sw-badge ${isPast ? 'sw-badge-neutral' : 'sw-badge-success'}`}>
            {isPast ? '✓ Past' : '⬤ Upcoming'}
          </span>
        </td>
      )}
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
        <strong>{ordinalEn(phase.kantakaHouse)} from {phase.reference === 'moon' ? 'Moon' : 'Lagna'}</strong>
        <span className="sss-hindi-sm" style={{ display: 'block', color: '#64748b' }}>{`${phase.reference === 'moon' ? 'चंद्र' : 'लग्न'} से ${ordinalHi(phase.kantakaHouse)} भाव`}</span>
      </td>
      <td>
        <strong>{phase.signName}</strong>
        <span className="sss-hindi-sm" style={{ display: 'block', color: '#64748b' }}>{phase.signNameHi}</span>
      </td>
      <td style={{ fontFamily: 'monospace', fontWeight: 600 }}>{formatDate(phase.startDate)}</td>
      <td style={{ fontFamily: 'monospace', fontWeight: 600 }}>{formatDate(phase.endDate)}</td>
      <td>
        <span className={`sss-intensity sss-intensity--${phase.intensityLevel}`}>
          {intensityDots(phase.intensityLevel)} {intensityLabel(phase.intensityLevel)}
        </span>
      </td>
      {isActive && (
        <td>
          <span className="sw-badge sw-badge-warning">
            ▶ Active
          </span>
        </td>
      )}
      {!isActive && (
        <td>
          <span className={`sw-badge ${isPast ? 'sw-badge-neutral' : 'sw-badge-success'}`}>
            {isPast ? '✓ Past' : '⬤ Upcoming'}
          </span>
        </td>
      )}
    </tr>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

const SadeSatiView: React.FC<SadeSatiViewProps> = ({ chart }) => {
  const report: SadeSatiReport = useMemo(() => computeSadeSatiPhases(chart), [chart]);

  return (
    <div className="sw-chassis sss-root" style={{ padding: '0', maxWidth: '1240px', margin: '0 auto 24px auto' }}>
      {/* ── Desktop Software Titlebar ── */}
      <div className="sw-titlebar">
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
            गोचर शनि, जन्म चंद्र एवं लग्न सापेक्ष स्थिति, मूर्ति निर्णय (स्वर्ण/रजत/ताम्र/लोह), ३-७-१० दृष्टियां एवं २० वर्षीय संपूर्ण कालक्रम।
          </p>
        </div>
        <div className="sw-native-pill">
          {chart.input.name} ({formatDateTimeDmyAmPm(chart.input.date, chart.input.time)})
        </div>
      </div>

      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* ── Current Status ── */}
        <StatusCard status={report.currentStatus} chart={chart} />

        {/* ── Moorti Nirnaya ── */}
        <MoortiCard status={report.currentStatus} />

        {/* ── Shani Drishti 3-7-10 ── */}
        <ShaniAspectsCard status={report.currentStatus} chart={chart} />

        {/* ── Classical Remedies & Protection ── */}
        <ClassicalRemediesCard status={report.currentStatus} report={report} />

        {/* ── Timeline Table ── */}
        <div className="sw-card">
          <div className="sw-card-header">
            <span className="sw-card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Calendar className="h-4 w-4 text-amber-500" />
              Saturn Transit Timeline / शनि गोचर कालक्रम (पिछले 10 वर्ष से अगले 20 वर्ष तक)
            </span>
            <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
              तिथि प्रारूप: DD-MM-YYYY
            </span>
          </div>

          <div className="sw-table-container">
            <table className="sw-table">
              <thead>
                <tr>
                  <th>Type / प्रकार</th>
                  <th>Phase / चरण</th>
                  <th>Sign / राशि</th>
                  <th>Start / आरम्भ (DD-MM-YYYY)</th>
                  <th>End / अंत (DD-MM-YYYY)</th>
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
          <div className="sw-card">
            <div className="sw-card-header">
              <span className="sw-card-title">Currently Affected Areas / प्रभावित क्षेत्र एवं सावधानियां</span>
            </div>
            <div className="sss-affected-areas" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {(() => {
                const st = report.currentStatus;
                let areas: string[] = [];
                if (st.isInSadeSati && st.activeSadeSatiCharan) {
                  const phase = report.sadeSatiPhases.find((p) => p.charan === st.activeSadeSatiCharan);
                  areas = phase?.affectedAreas ?? [];
                } else if (st.isInDhaiya && st.activeDhaiyaSubType) {
                  const phase = report.dhaiyaPhases.find((p) => p.subType === st.activeDhaiyaSubType);
                  areas = phase?.affectedAreas ?? [];
                } else if (st.isInKantaka && st.activeKantakaHouse) {
                  const phase = report.kantakaPhases.find(
                    (p) => p.kantakaHouse === st.activeKantakaHouse && p.reference === st.activeKantakaReference,
                  );
                  areas = phase?.affectedAreas ?? [];
                }
                return areas.map((area, i) => (
                  <span
                    key={i}
                    style={{
                      padding: '6px 14px',
                      borderRadius: '6px',
                      background: 'rgba(239, 68, 68, 0.08)',
                      border: '1px solid rgba(239, 68, 68, 0.25)',
                      color: '#b91c1c',
                      fontWeight: 600,
                      fontSize: '0.82rem',
                    }}
                  >
                    {area}
                  </span>
                ));
              })()}
            </div>
          </div>
        )}

        {/* ── Legend ── */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', fontSize: '0.78rem', color: '#64748b', padding: '10px 0' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <span className="sss-type-badge sss-type-badge--ss">Sade Sati</span>
            <span className="sss-type-badge sss-type-badge--dhaiya">Dhaiya</span>
            <span className="sss-type-badge sss-type-badge--kantaka">Kantaka</span>
          </div>
          <span>
            Approximate dates based on mean Saturn motion · Saturn reference: 0° Capricorn on Jan 24, 2020
          </span>
        </div>
      </div>
    </div>
  );
};

export default SadeSatiView;
