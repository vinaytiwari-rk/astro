import React, { useMemo, useState } from 'react';
import {
  Award,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  Compass,
  Flame,
  Globe,
  Heart,
  Info,
  Layers,
  Printer,
  Shield,
  ShieldAlert,
  Sparkles,
  Zap,
} from 'lucide-react';
import { computeKotaChakra, type KotaChakraReport } from '../../astro/predictions/kotaChakraEngine';
import { computeAyurdaya, type LongevityReport } from '../../astro/predictions/ayurdayaEngine';
import { computeUpagrahas, type UpagrahaReport } from '../../astro/predictions/upagrahaEngine';
import { computeAshtakavargaKakshya, type AshtakavargaKakshyaReport } from '../../astro/predictions/ashtakavargaKakshya';
import { computeNadiYogasAndKarma, type NadiKarmaReport } from '../../astro/predictions/nadiYogasAndKarma';
import type { ChartData } from '../../astro/types';
import { useLanguage } from '../../i18n/LanguageContext';

interface KotaAndAyurdayaViewProps {
  chart: ChartData;
  onNavigate?: (view: string) => void;
}

export const KotaAndAyurdayaView: React.FC<KotaAndAyurdayaViewProps> = ({ chart, onNavigate }) => {
  const { lang } = useLanguage();
  const isHi = lang === 'hi';

  const [activeTab, setActiveTab] = useState<'kota' | 'ayurdaya' | 'kakshya' | 'upagrahas' | 'karma'>('kota');

  const kotaReport: KotaChakraReport = useMemo(() => computeKotaChakra(chart), [chart]);
  const ayurReport: LongevityReport = useMemo(() => computeAyurdaya(chart), [chart]);
  const upagrahaReport: UpagrahaReport = useMemo(() => computeUpagrahas(chart), [chart]);
  const kakshyaReport: AshtakavargaKakshyaReport = useMemo(() => computeAshtakavargaKakshya(chart), [chart]);
  const karmaReport: NadiKarmaReport = useMemo(() => computeNadiYogasAndKarma(chart), [chart]);

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
          {isHi ? 'कोटा चक्र, आयुर्दाय, अष्टकवर्ग कक्षा व उपग्रह' : 'Kota Chakra, Ayurdaya, Kakshya & Upagrahas'}
        </span>
      </nav>

      {/* Header Card */}
      <div className="oj-page-header-card">
        <div className="oj-header-badge">
          {isHi
            ? 'दुर्ग वेध (कोटा चक्र), जैमिनी आयुर्दाय, अष्टकवर्ग कक्षा ट्रिगर एवं पूर्वजन्म कर्म शाप'
            : 'Kota Chakra Fort Defense, Jaimini Longevity, Ashtakavarga Kakshya Triggers & Past-Life Curses'}
        </div>
        <h1 className="oj-page-title">
          {isHi
            ? 'कोटा चक्र एवं गहन शास्त्रीय भविष्यकथन महा-सूट'
            : 'Kota Chakra, Ayurdaya & Esoteric Planetary Mechanics'}
        </h1>
        <p className="oj-page-subtitle">
          {isHi
            ? 'मुकदमों, चुनाव एवं संकट में पराजय/विजय का कोटा चक्र वेध, जैमिनी ३-युगल आयुर्दाय, ३°४५\' अष्टकवर्ग कक्षा तात्कालिक गोचर, एवं गुलिक-मांदि उपग्रहों का यथार्थ फलादेश।'
            : 'Evaluation of Fort Defense (Kota Chakra) during legal and physical crises, Jaimini 3-Pair Longevity, 3°45\' Kakshya event triggers, and hidden Upagraha nodes.'}
        </p>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '12px' }}>
          <button
            onClick={() => window.print()}
            className="oj-action-btn no-print"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <Printer size={15} />
            <span>{isHi ? 'रिपोर्ट प्रिंट करें' : 'Print Master Report'}</span>
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="oj-card" style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setActiveTab('kota')}
            className={`oj-tab-pill ${activeTab === 'kota' ? 'is-active' : ''}`}
          >
            {isHi ? '१. कोटा चक्र (दुर्ग वेध)' : '1. Kota Chakra (Fort Defense)'}
          </button>
          <button
            onClick={() => setActiveTab('ayurdaya')}
            className={`oj-tab-pill ${activeTab === 'ayurdaya' ? 'is-active' : ''}`}
          >
            {isHi ? '२. आयुर्दाय व मारक निर्णय' : '2. Ayurdaya & Maraka'}
          </button>
          <button
            onClick={() => setActiveTab('kakshya')}
            className={`oj-tab-pill ${activeTab === 'kakshya' ? 'is-active' : ''}`}
          >
            {isHi ? '३. अष्टकवर्ग कक्षा गोचर' : '3. Ashtakavarga Kakshya'}
          </button>
          <button
            onClick={() => setActiveTab('upagrahas')}
            className={`oj-tab-pill ${activeTab === 'upagrahas' ? 'is-active' : ''}`}
          >
            {isHi ? '४. गुलिक, मांदि व उपग्रह' : '4. Gulika & Upagrahas'}
          </button>
          <button
            onClick={() => setActiveTab('karma')}
            className={`oj-tab-pill ${activeTab === 'karma' ? 'is-active' : ''}`}
          >
            {isHi ? '५. पूर्वजन्म कर्म व शाप' : '5. Past Life Karma Curses'}
          </button>
        </div>
      </div>

      {/* TAB 1: KOTA CHAKRA */}
      {activeTab === 'kota' && (
        <div>
          {/* Verdict Banner */}
          <div
            className="oj-card"
            style={{
              background:
                kotaReport.fortVulnerabilityStatus === 'Fortified & Triumphant'
                  ? '#f0fdf4'
                  : kotaReport.fortVulnerabilityStatus === 'Vulnerable / Under Siege'
                  ? '#fef2f2'
                  : '#f8fafc',
              border: `2px solid ${
                kotaReport.fortVulnerabilityStatus === 'Fortified & Triumphant'
                  ? '#22c55e'
                  : kotaReport.fortVulnerabilityStatus === 'Vulnerable / Under Siege'
                  ? '#ef4444'
                  : '#94a3b8'
              }`,
              marginBottom: '16px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <span
                  style={{
                    background:
                      kotaReport.fortVulnerabilityStatus === 'Fortified & Triumphant'
                        ? '#15803d'
                        : kotaReport.fortVulnerabilityStatus === 'Vulnerable / Under Siege'
                        ? '#b91c1c'
                        : '#475569',
                    color: '#ffffff',
                    padding: '3px 10px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                  }}
                >
                  {isHi ? kotaReport.fortVulnerabilityStatusHi : kotaReport.fortVulnerabilityStatus}
                </span>
                <h3 style={{ margin: '8px 0 0 0', fontSize: '18px', color: '#0f172a' }}>
                  {isHi ? kotaReport.fortVerdictHi : kotaReport.fortVerdictEn}
                </h3>
              </div>

              <div style={{ textAlign: 'right', fontSize: '12px', color: '#475569' }}>
                <div>
                  <strong>{isHi ? 'कोटा स्वामी (दुर्ग अधिपति):' : 'Kota Swami (Fort Lord):'}</strong> {kotaReport.kotaSwamiHi} ({kotaReport.kotaSwami})
                </div>
                <div>
                  <strong>{isHi ? 'कोटा पाल (दुर्ग रक्षक):' : 'Kota Pala (Fort Sentinel):'}</strong> {kotaReport.kotaPalaHi} ({kotaReport.kotaPala})
                </div>
                <div>
                  <strong>{isHi ? 'जन्म नक्षत्र:' : 'Janma Nakshatra:'}</strong> {isHi ? kotaReport.janmaNakshatraHi : kotaReport.janmaNakshatra}
                </div>
              </div>
            </div>
          </div>

          {/* SVG Kota Chakra 4 Concentric Quadrangles */}
          <div className="oj-card" style={{ marginBottom: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h2 className="oj-card-title" style={{ alignSelf: 'flex-start' }}>
              <Shield size={18} color="#d97706" />
              {isHi ? 'कोटा चक्र (४ संकेंद्री दुर्ग प्राचीर)' : 'Kota Chakra 4 Concentric Walls Visualizer'}
            </h2>

            <div style={{ width: '100%', maxWidth: '440px', background: '#fafaf9', borderRadius: '12px', border: '1px solid #e7e5e4', padding: '12px' }}>
              <svg viewBox="0 0 400 400" style={{ width: '100%', height: 'auto', display: 'block' }}>
                {/* Bahya (Outer) */}
                <rect x="20" y="20" width="360" height="360" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="2" rx="8" />
                <text x="30" y="40" fill="#64748b" fontSize="11" fontWeight="bold">BAHYA (बाह्य परकोटा)</text>

                {/* Prakara (Boundary) */}
                <rect x="65" y="65" width="270" height="270" fill="#e2e8f0" stroke="#64748b" strokeWidth="2" rx="6" />
                <text x="75" y="85" fill="#475569" fontSize="11" fontWeight="bold">PRAKARA (प्राकार प्राचीर)</text>

                {/* Durg (Inner Fort) */}
                <rect x="110" y="110" width="180" height="180" fill="#cbd5e1" stroke="#475569" strokeWidth="2" rx="4" />
                <text x="120" y="130" fill="#334155" fontSize="11" fontWeight="bold">DURG (भीतरी दुर्ग)</text>

                {/* Stambha (Center Pillar) */}
                <rect x="155" y="155" width="90" height="90" fill="#fef08a" stroke="#ca8a04" strokeWidth="3" rx="4" />
                <text x="165" y="195" fill="#854d0e" fontSize="11" fontWeight="bold" textAnchor="middle">
                  <tspan x="200" dy="0">STAMBHA</tspan>
                  <tspan x="200" dy="14">स्तंभ केंद्र</tspan>
                </text>

                {/* Plot Planets in sections */}
                <text x="200" y="172" fill="#b45309" fontSize="9" fontWeight="bold" textAnchor="middle">
                  {kotaReport.stambhaPlanets.join(', ') || '(रिक्त)'}
                </text>
                <text x="200" y="270" fill="#1e293b" fontSize="10" fontWeight="bold" textAnchor="middle">
                  Durg: {kotaReport.durgPlanets.join(', ') || '(रिक्त)'}
                </text>
                <text x="200" y="320" fill="#1e293b" fontSize="10" fontWeight="bold" textAnchor="middle">
                  Prakara: {kotaReport.prakaraPlanets.join(', ') || '(रिक्त)'}
                </text>
                <text x="200" y="365" fill="#1e293b" fontSize="10" fontWeight="bold" textAnchor="middle">
                  Bahya: {kotaReport.bahyaPlanets.join(', ') || '(रिक्त)'}
                </text>
              </svg>
            </div>
          </div>

          {/* Placements Table */}
          <div className="oj-card">
            <h2 className="oj-card-title">
              <Award size={18} color="#d97706" />
              {isHi ? 'ग्रहों की दुर्ग स्थिति एवं युद्ध भूमिका' : 'Planetary Garrison & Siege Placements'}
            </h2>
            <div style={{ overflowX: 'auto' }}>
              <table className="oj-table" style={{ width: '100%', fontSize: '12px' }}>
                <thead>
                  <tr>
                    <th>{isHi ? 'ग्रह' : 'Planet'}</th>
                    <th>{isHi ? 'दुर्ग खंड (Section)' : 'Fort Section'}</th>
                    <th>{isHi ? 'नक्षत्र' : 'Nakshatra'}</th>
                    <th>{isHi ? 'गति (Motion)' : 'Motion Vector'}</th>
                    <th>{isHi ? 'शास्त्रीय भूमिका' : 'Strategic Role'}</th>
                  </tr>
                </thead>
                <tbody>
                  {kotaReport.placements.map((p) => (
                    <tr key={p.planet}>
                      <td style={{ fontWeight: 600 }}>{p.planetHi} ({p.planet})</td>
                      <td>{isHi ? p.sectionHi : p.section}</td>
                      <td>{isHi ? p.nakshatraNameHi : p.nakshatraName}</td>
                      <td>{isHi ? p.entryExitMotionHi : p.entryExitMotion}</td>
                      <td>{isHi ? p.battleRoleHi : p.battleRoleEn}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: AYURDAYA */}
      {activeTab === 'ayurdaya' && (
        <div>
          {/* Longevity Banner */}
          <div
            className="oj-card"
            style={{
              background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
              border: '2px solid #16a34a',
              marginBottom: '16px',
            }}
          >
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
              <div>
                <div style={{ fontSize: '11px', color: '#166534', fontWeight: 600, textTransform: 'uppercase' }}>
                  {isHi ? 'आयुर्दाय वर्ग (Longevity Category)' : 'Longevity Category'}
                </div>
                <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#14532d', marginTop: '2px' }}>
                  {isHi ? ayurReport.categoryHi : ayurReport.category}
                </div>
                <div style={{ fontSize: '12px', color: '#166534', marginTop: '4px' }}>
                  <strong>{isHi ? 'संभावित आयु विस्तार:' : 'Estimated Range:'}</strong> {ayurReport.estimatedAgeRange}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '11px', color: '#166534', fontWeight: 600, textTransform: 'uppercase' }}>
                  {isHi ? 'मारक अधिपति (Maraka Lords)' : 'Maraka Lords'}
                </div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: '#14532d', marginTop: '2px' }}>
                  {ayurReport.marakaLords.map((m) => `${m.planetHi} (${m.role})`).join(' · ')}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '11px', color: '#166534', fontWeight: 600, textTransform: 'uppercase' }}>
                  {isHi ? 'बाधक भाव व स्वामी (Badhaka)' : 'Badhaka Lord'}
                </div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: '#14532d', marginTop: '2px' }}>
                  {ayurReport.badhakaLord.planetHi} ({isHi ? `भाव ${ayurReport.badhakaLord.house}` : `House ${ayurReport.badhakaLord.house}`})
                </div>
                <div style={{ fontSize: '11px', color: '#166534', marginTop: '2px' }}>
                  {isHi ? ayurReport.badhakaLord.reasonHi : ayurReport.badhakaLord.reason}
                </div>
              </div>
            </div>

            <div style={{ marginTop: '14px', paddingTop: '10px', borderTop: '1px solid #bbf7d0', fontSize: '12px', color: '#14532d' }}>
              <strong>{isHi ? 'प्राण रक्षा व स्वास्थ्य विधान:' : 'Vitality Preservation Protocol:'}</strong> {isHi ? ayurReport.vitalityPrescriptionHi : ayurReport.vitalityPrescriptionEn}
            </div>
          </div>

          {/* Jaimini 3-Pair Table */}
          <div className="oj-card" style={{ marginBottom: '16px' }}>
            <h2 className="oj-card-title">
              <Award size={18} color="#d97706" />
              {isHi ? 'जैमिनी ३-युगल आयु गणना सूत्र' : 'Jaimini 3-Pair Longevity Determination'}
            </h2>
            <div style={{ overflowX: 'auto', marginTop: '8px' }}>
              <table className="oj-table" style={{ width: '100%', fontSize: '12px' }}>
                <thead>
                  <tr>
                    <th>{isHi ? 'युगल' : 'Pair'}</th>
                    <th>{isHi ? 'प्रथम घटक' : 'Component 1'}</th>
                    <th>{isHi ? 'द्वितीय घटक' : 'Component 2'}</th>
                    <th>{isHi ? 'संकेत' : 'Indication'}</th>
                  </tr>
                </thead>
                <tbody>
                  {ayurReport.jaiminiPairs.map((pair, idx) => (
                    <tr key={idx}>
                      <td style={{ fontWeight: 600 }}>{isHi ? pair.pairNameHi : pair.pairName}</td>
                      <td>{pair.sign1Type}</td>
                      <td>{pair.sign2Type}</td>
                      <td style={{ fontWeight: 'bold', color: '#0369a1' }}>{pair.indication}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Critical Vulnerability Ages */}
          <div className="oj-card">
            <h2 className="oj-card-title">
              <ShieldAlert size={18} color="#dc2626" />
              {isHi ? 'संवेदनशील आयु वर्ष व स्वास्थ्य सतर्कता काल' : 'Critical Lifespan Vulnerability Milestones'}
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '12px', marginTop: '8px' }}>
              {ayurReport.criticalVulnerabilityAges.map((v, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '10px',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    background: v.severity === 'High' ? '#fff1f2' : '#f8fafc',
                    borderLeft: `4px solid ${v.severity === 'High' ? '#e11d48' : '#f59e0b'}`,
                  }}
                >
                  <div style={{ fontWeight: 'bold', fontSize: '13px', color: '#0f172a' }}>
                    {isHi ? `आयु वर्ष ${v.ageYear}` : `Age ${v.ageYear}`}
                  </div>
                  <div style={{ fontSize: '11px', color: '#475569', marginTop: '4px' }}>
                    {isHi ? v.descriptionHi : v.descriptionEn}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: ASHTAKAVARGA KAKSHYA */}
      {activeTab === 'kakshya' && (
        <div>
          <div className="oj-card" style={{ marginBottom: '16px' }}>
            <h2 className="oj-card-title">
              <Zap size={18} color="#d97706" />
              {isHi ? '३°४५\' अष्टकवर्ग कक्षा तात्कालिक गोचर वेध' : 'Real-Time 3°45\' Ashtakavarga Kakshya Triggers'}
            </h2>
            <p style={{ fontSize: '12px', color: '#475569', margin: '4px 0 12px 0' }}>
              {isHi ? kakshyaReport.sarvashtakavargaSummaryHi : kakshyaReport.sarvashtakavargaSummaryEn}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
              {kakshyaReport.transitKakshyaStatuses.map((k, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    background: k.hasBindu ? '#f0fdf4' : '#fef2f2',
                    borderLeft: `4px solid ${k.hasBindu ? '#22c55e' : '#ef4444'}`,
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <div style={{ fontWeight: 'bold', fontSize: '14px', color: '#0f172a' }}>
                      {k.planetHi} ({k.planet})
                    </div>
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: 700,
                        color: k.hasBindu ? '#15803d' : '#b91c1c',
                      }}
                    >
                      {k.hasBindu ? '१ बिंदु (Green)' : '० बिंदु (Red)'}
                    </span>
                  </div>

                  <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
                    {isHi ? k.transitingSignHi : k.transitingSign} ({k.degreeInSign}°) · {isHi ? 'कक्षा:' : 'Kakshya:'} {k.kakshyaLordHi}
                  </div>

                  <div style={{ fontSize: '12px', color: '#334155', marginTop: '6px' }}>
                    {isHi ? k.triggerStatusHi : k.triggerStatusEn}
                  </div>

                  <div style={{ fontSize: '11px', color: '#0369a1', marginTop: '4px' }}>
                    <strong>{isHi ? 'निर्देश:' : 'Guidance:'}</strong> {isHi ? k.actionGuidanceHi : k.actionGuidanceEn}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shodhya Pinda Sutras */}
          <div className="oj-card">
            <h2 className="oj-card-title">
              <Sparkles size={18} color="#d97706" />
              {isHi ? 'शोध पिंड गुणनफल एवं भविष्यकथन' : 'Shodhya Pinda Planetary Multipliers'}
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '8px' }}>
              {kakshyaReport.shodhyaPindaInsights.map((sp, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '10px',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    background: '#f8fafc',
                  }}
                >
                  <div style={{ fontWeight: 'bold', fontSize: '13px', color: '#0f172a' }}>
                    {sp.planetHi} का शोध पिंड: {sp.pindaScore} (संवेदनशील नक्षत्र: {sp.sensitiveNakshatra})
                  </div>
                  <div style={{ fontSize: '12px', color: '#334155', marginTop: '3px' }}>
                    {isHi ? sp.eventForecastHi : sp.eventForecastEn}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: UPAGRAHAS */}
      {activeTab === 'upagrahas' && (
        <div className="oj-card">
          <h2 className="oj-card-title">
            <Compass size={18} color="#d97706" />
            {isHi ? 'गुलिक, मांदि एवं सूर्य-जनित ५ अप्रकाशित उपग्रह' : 'Gulika, Mandi & 5 Non-Luminous Upagrahas'}
          </h2>
          <p style={{ fontSize: '12px', color: '#475569', margin: '4px 0 12px 0' }}>
            {isHi ? upagrahaReport.summaryHi : upagrahaReport.summaryEn}
          </p>

          <div style={{ overflowX: 'auto' }}>
            <table className="oj-table" style={{ width: '100%', fontSize: '12px' }}>
              <thead>
                <tr>
                  <th>{isHi ? 'उपग्रह' : 'Upagraha'}</th>
                  <th>{isHi ? 'जनक ग्रह' : 'Parent'}</th>
                  <th>{isHi ? 'राशि' : 'Sign'}</th>
                  <th>{isHi ? 'अंश (DMS)' : 'Longitude'}</th>
                  <th>{isHi ? 'भाव' : 'House'}</th>
                  <th>{isHi ? 'प्रकृति' : 'Nature'}</th>
                  <th>{isHi ? 'शास्त्रीय प्रभाव' : 'Classical Effect'}</th>
                </tr>
              </thead>
              <tbody>
                {upagrahaReport.upagrahas.map((u) => (
                  <tr key={u.id}>
                    <td style={{ fontWeight: 600 }}>{isHi ? u.nameHi : u.nameEn}</td>
                    <td>{isHi ? u.parentPlanetHi : u.parentPlanet}</td>
                    <td>{isHi ? u.signNameHi : u.signName}</td>
                    <td>{u.dms}</td>
                    <td>{u.house}</td>
                    <td style={{ fontWeight: 600, color: u.nature === 'Auspicious Benefic' ? '#15803d' : '#b91c1c' }}>
                      {isHi ? u.natureHi : u.nature}
                    </td>
                    <td>{isHi ? u.classicalEffectHi : u.classicalEffectEn}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: PAST LIFE KARMA */}
      {activeTab === 'karma' && (
        <div>
          {/* Nadi Conjunctions */}
          <div className="oj-card" style={{ marginBottom: '16px' }}>
            <h2 className="oj-card-title">
              <Layers size={18} color="#d97706" />
              {isHi ? 'भृगु नंदी नाड़ी ग्रह युति एवं त्रिकोण योग' : 'Bhrigu Nandi Nadi Conjunction & Trine Yogas'}
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '8px' }}>
              {karmaReport.nadiCombinations.map((nc, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    background: '#f8fafc',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <h3 style={{ margin: 0, fontSize: '15px', color: '#0f172a' }}>
                      {isHi ? nc.combinationTitleHi : nc.combinationTitleEn}
                    </h3>
                    <span style={{ fontSize: '11px', color: '#0369a1', fontWeight: 600 }}>
                      {isHi ? nc.lifeMilestoneAgeHi : nc.lifeMilestoneAge}
                    </span>
                  </div>

                  <div style={{ fontSize: '12px', color: '#334155', marginTop: '4px' }}>
                    {isHi ? nc.nativeManifestationHi : nc.nativeManifestationEn}
                  </div>

                  <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
                    <strong>{isHi ? 'नाड़ी सूत्र:' : 'Sutra:'}</strong> {isHi ? nc.sutrasHi : nc.sutrasEn}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 6 Past-Life Curses */}
          <div className="oj-card">
            <h2 className="oj-card-title">
              <Flame size={18} color="#dc2626" />
              {isHi ? 'बृहत् पराशर ६ पूर्वजन्म शाप एवं प्रायश्चित्त परिहार' : '6 Classical Parashari Past-Life Curses & Prayaschitta'}
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '14px', marginTop: '8px' }}>
              {karmaReport.pastLifeCurses.map((shapa) => (
                <div
                  key={shapa.shapaId}
                  style={{
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    background: shapa.active ? '#fff1f2' : '#ffffff',
                    borderLeft: `4px solid ${shapa.active ? '#e11d48' : '#cbd5e1'}`,
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontWeight: 'bold', fontSize: '13px', color: '#0f172a' }}>
                      {isHi ? shapa.nameHi : shapa.nameEn}
                    </div>
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: 700,
                        color: shapa.active ? '#b91c1c' : '#64748b',
                      }}
                    >
                      {isHi ? shapa.intensityHi : shapa.intensity}
                    </span>
                  </div>

                  <div style={{ fontSize: '11px', color: '#475569', marginTop: '4px' }}>
                    <strong>{isHi ? 'पूर्वजन्म कारण:' : 'Cause:'}</strong> {isHi ? shapa.karmicCauseHi : shapa.karmicCauseEn}
                  </div>

                  <div style={{ fontSize: '11px', color: '#475569', marginTop: '2px' }}>
                    <strong>{isHi ? 'बाधा:' : 'Manifestation:'}</strong> {isHi ? shapa.manifestingObstacleHi : shapa.manifestingObstacleEn}
                  </div>

                  <div style={{ borderTop: '1px dashed #e2e8f0', paddingTop: '6px', marginTop: '6px', fontSize: '11px', color: '#0369a1' }}>
                    <strong>{isHi ? 'शास्त्रीय प्रायश्चित्त:' : 'Prayaschitta:'}</strong> {isHi ? shapa.parashariPrayaschittaHi : shapa.parashariPrayaschittaEn}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KotaAndAyurdayaView;
