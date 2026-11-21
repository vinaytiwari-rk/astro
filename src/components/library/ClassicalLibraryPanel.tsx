import React, { useState } from 'react';
import {
  Award,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  Compass,
  ExternalLink,
  Flame,
  HelpCircle,
  Layers,
  Search,
  Shield,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';
import { SIGNS } from '../../astro/constants';
import { AIFAS_YOGINI_BOOK_METADATA } from '../../astro/predictions/aifasYoginiDashaKb';
import {
  DR_CHARAK_BOOK_METADATA,
  FARFARAWAY_SYNTHESIS_METADATA,
} from '../../astro/predictions/charakElementsKb';
import {
  PVR_NARASIMHA_RAO_BOOK_METADATA,
  PVR_SHODASHAVARGA_CORPUS,
  PVR_BIRTHTIME_SENSITIVITY_TABLE,
  evaluatePvrYogadaSystem,
  evaluatePvrArgalaOnHouse,
  computePvrTransitMurthi,
} from '../../astro/predictions/pvrNarasimhaRaoKb';
import type { ChartData } from '../../astro/types';
import { useLanguage } from '../../i18n/LanguageContext';
import { trPlanet, trSign } from '../../i18n/translations';

interface ClassicalLibraryPanelProps {
  chart: ChartData;
}

export const ClassicalLibraryPanel: React.FC<ClassicalLibraryPanelProps> = ({ chart }) => {
  const { lang } = useLanguage();
  const isHi = lang === 'hi';

  const [activeTab, setActiveTab] = useState<'catalog' | 'vargas' | 'yogada' | 'argala' | 'murthi'>('catalog');
  const [selectedVargaCode, setSelectedVargaCode] = useState<string>('D9');
  const [selectedArgalaHouse, setSelectedArgalaHouse] = useState<number>(1);
  const [simTransitMoonSign, setSimTransitMoonSign] = useState<number>(chart.planets.find((p) => p.id === 'Moon')?.signIndex ?? 0);

  // Compute live Yogada report for active chart
  const yogadaReport = evaluatePvrYogadaSystem(chart);

  // Compute live Argala report for selected house
  const argalaItems = evaluatePvrArgalaOnHouse(chart, selectedArgalaHouse);

  // Compute live Murthi simulation
  const natalMoonSign = chart.planets.find((p) => p.id === 'Moon')?.signIndex ?? 0;
  const murthiReport = computePvrTransitMurthi(simTransitMoonSign, natalMoonSign);

  const selectedVarga = PVR_SHODASHAVARGA_CORPUS[selectedVargaCode] || PVR_SHODASHAVARGA_CORPUS.D9;

  return (
    <div className="amm-container" style={{ padding: '16px' }}>
      {/* Header Banner */}
      <div className="amm-hero-card" style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span className="amm-grade-pill grade-A-plus">
              {isHi ? 'AV Astro Vibe — प्रामाणिक ग्रंथालय' : 'AV Astro Vibe — Classical Shastra Library'}
            </span>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              {isHi ? 'पराशर, जैमिनी, ताजिक व आधुनिक शास्त्रीय शोध' : 'Parashara, Jaimini, Tajaka & Standard Modern Treatises'}
            </span>
          </div>
          <h2 style={{ margin: 0, fontSize: '1.4rem', color: 'var(--text)' }}>
            {isHi
              ? 'वैदिक ज्योतिष शास्त्रीय ग्रंथालय एवं पी.वी.आर. एकीकृत दृष्टिकोण'
              : 'Classical Vedic Library & P.V.R. Narasimha Rao Integrated Approach'}
          </h2>
          <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--text-muted)' }}>
            {isHi
              ? 'पी.वी.आर. नरसिम्हा राव, डॉ. के.एस. चरक, एआईएफएएस, १००१ योग एवं फार फार अवे के आधिकारिक ग्रंथों का शोधपरक संग्रह।'
              : 'Authoritative treatises by P.V.R. Narasimha Rao, Dr. K.S. Charak, AIFAS, 1001 Yogas, and Far Far Away.'}
          </p>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <nav className="amm-tabs-nav no-print" aria-label="Library Tabs" style={{ marginBottom: '18px' }}>
        <button
          type="button"
          className={`amm-tab-btn ${activeTab === 'catalog' ? 'is-active' : ''}`}
          onClick={() => setActiveTab('catalog')}
        >
          <BookOpen size={15} />
          <span>{isHi ? '१. ग्रंथ संग्रह एवं संदर्भ' : '1. Treatise Catalog'}</span>
        </button>

        <button
          type="button"
          className={`amm-tab-btn ${activeTab === 'vargas' ? 'is-active' : ''}`}
          onClick={() => setActiveTab('vargas')}
        >
          <Layers size={15} />
          <span>{isHi ? '२. षोडशवर्ग (D1-D60) एवं समय-संवेदनशीलता' : '2. 16 Vargas & Sensitivity'}</span>
        </button>

        <button
          type="button"
          className={`amm-tab-btn ${activeTab === 'yogada' ? 'is-active' : ''}`}
          onClick={() => setActiveTab('yogada')}
        >
          <Award size={15} />
          <span>{isHi ? '३. योगदा एवं महा योगदा परीक्षण' : '3. Yogada & Maha Yogada'}</span>
        </button>

        <button
          type="button"
          className={`amm-tab-btn ${activeTab === 'argala' ? 'is-active' : ''}`}
          onClick={() => setActiveTab('argala')}
        >
          <Shield size={15} />
          <span>{isHi ? '४. अर्गला एवं विरोधाग्रला' : '4. Argala & Virodhargala'}</span>
        </button>

        <button
          type="button"
          className={`amm-tab-btn ${activeTab === 'murthi' ? 'is-active' : ''}`}
          onClick={() => setActiveTab('murthi')}
        >
          <Clock size={15} />
          <span>{isHi ? '५. गोचर मूर्ति निर्णय (स्वर्ण, रजत, ताम्र, लौह)' : '5. Gochara Murthi Nirnaya'}</span>
        </button>
      </nav>

      {/* =========================================================================
          TAB 1: TREATISE CATALOG (5 Authoritative Texts)
         ========================================================================= */}
      {activeTab === 'catalog' && (
        <div className="amm-card">
          <div className="oj-card-header">
            <div>
              <h3 style={{ margin: 0, fontSize: '1.2rem' }}>
                {isHi ? 'आधिकारिक वैदिक ज्योतिष ग्रंथ संग्रह (Authoritative Reference Catalog)' : 'Authoritative Reference Catalog'}
              </h3>
              <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                {isHi
                  ? 'सटीक गणनाओं, दशाओं, वर्ग कुंडलियों एवं भविष्यवाणियों के मूल शास्त्रीय स्रोत।'
                  : 'Foundational classical textbooks powering AV Astro Vibe\'s algorithms and predictions.'}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '16px' }}>
            {/* 1. PVR Narasimha Rao */}
            <div
              style={{
                padding: '18px',
                borderRadius: '12px',
                background: 'rgba(217, 119, 6, 0.05)',
                border: '1px solid rgba(217, 119, 6, 0.25)',
                borderLeft: '6px solid #d97706',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
                <div>
                  <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#b45309', textTransform: 'uppercase' }}>
                    {isHi ? 'मूल आधार ग्रंथ · सागर पब्लिकेशन्स नई दिल्ली' : 'Core Masterwork · Sagar Publications New Delhi'}
                  </span>
                  <h4 style={{ margin: '4px 0', fontSize: '1.25rem', color: '#92400e' }}>
                    {PVR_NARASIMHA_RAO_BOOK_METADATA.title} ({PVR_NARASIMHA_RAO_BOOK_METADATA.edition})
                  </h4>
                  <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                    <strong>{isHi ? 'लेखक:' : 'Author:'}</strong> {PVR_NARASIMHA_RAO_BOOK_METADATA.author} ·{' '}
                    <strong>{isHi ? 'प्राक्कथन:' : 'Foreword:'}</strong> {PVR_NARASIMHA_RAO_BOOK_METADATA.forewordBy} ·{' '}
                    <strong>{isHi ? 'विस्तार:' : 'Pages:'}</strong> {PVR_NARASIMHA_RAO_BOOK_METADATA.totalPages} {isHi ? 'पृष्ठ' : 'pages'}
                  </div>
                </div>
                <a
                  href={PVR_NARASIMHA_RAO_BOOK_METADATA.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary btn-sm"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  <ExternalLink size={14} />
                  <span>{isHi ? 'मूल PDF ग्रंथ देखें' : 'View Treatise PDF'}</span>
                </a>
              </div>

              <div style={{ margin: '12px 0 8px', fontSize: '0.88rem', color: 'var(--text)', lineHeight: 1.5 }}>
                <strong>{isHi ? 'मौलिक सिद्धांत (Axiom):' : 'Core Axiom:'}</strong>{' '}
                {isHi ? PVR_NARASIMHA_RAO_BOOK_METADATA.fundamentalAxiomHi : PVR_NARASIMHA_RAO_BOOK_METADATA.fundamentalAxiomEn}
              </div>

              <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)', background: '#ffffff', padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.06)' }}>
                <strong>{isHi ? 'ग्रंथ का शास्त्रीय विषय-क्षेत्र:' : 'Scope & Contents:'}</strong> {PVR_NARASIMHA_RAO_BOOK_METADATA.scope}
              </div>
            </div>

            {/* 2. Dr. K.S. Charak */}
            <div
              style={{
                padding: '18px',
                borderRadius: '12px',
                background: 'rgba(5, 150, 105, 0.05)',
                border: '1px solid rgba(5, 150, 105, 0.25)',
                borderLeft: '6px solid #059669',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
                <div>
                  <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#047857', textTransform: 'uppercase' }}>
                    {isHi ? 'भारतीय विद्या भवन मानक ग्रंथ' : 'Bharatiya Vidya Bhavan (BVB) Standard Textbook'}
                  </span>
                  <h4 style={{ margin: '4px 0', fontSize: '1.25rem', color: '#065f46' }}>
                    {DR_CHARAK_BOOK_METADATA.title}
                  </h4>
                  <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                    <strong>{isHi ? 'लेखक:' : 'Author:'}</strong> {DR_CHARAK_BOOK_METADATA.author} ({DR_CHARAK_BOOK_METADATA.affiliation}) ·{' '}
                    <strong>{isHi ? 'विस्तार:' : 'Pages:'}</strong> {DR_CHARAK_BOOK_METADATA.pagesOrLength}
                  </div>
                </div>
                <a
                  href={DR_CHARAK_BOOK_METADATA.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary btn-sm"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  <ExternalLink size={14} />
                  <span>{isHi ? 'मूल PDF ग्रंथ देखें' : 'View Treatise PDF'}</span>
                </a>
              </div>

              <div style={{ margin: '12px 0 8px', fontSize: '0.88rem', color: 'var(--text)', lineHeight: 1.5 }}>
                <strong>{isHi ? 'मौलिक सिद्धांत (Axiom):' : 'Core Axiom:'}</strong>{' '}
                {isHi ? DR_CHARAK_BOOK_METADATA.fundamentalAxiomHi : DR_CHARAK_BOOK_METADATA.fundamentalAxiomEn}
              </div>

              <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)', background: '#ffffff', padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.06)' }}>
                <strong>{isHi ? 'ग्रंथ का शास्त्रीय विषय-क्षेत्र:' : 'Scope & Contents:'}</strong> {DR_CHARAK_BOOK_METADATA.scope}
              </div>
            </div>

            {/* 3. AIFAS Yogini & Dasha */}
            <div
              style={{
                padding: '18px',
                borderRadius: '12px',
                background: 'rgba(59, 130, 246, 0.05)',
                border: '1px solid rgba(59, 130, 246, 0.25)',
                borderLeft: '6px solid #2563eb',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
                <div>
                  <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#1d4ed8', textTransform: 'uppercase' }}>
                    {isHi ? 'अखिल भारतीय ज्योतिष संघ (AIFAS) मानक दशा ग्रंथ' : 'AIFAS Standard Textbook on Dasha & Yogini'}
                  </span>
                  <h4 style={{ margin: '4px 0', fontSize: '1.25rem', color: '#1e40af' }}>
                    {AIFAS_YOGINI_BOOK_METADATA.title}
                  </h4>
                  <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                    <strong>{isHi ? 'प्रकाशक:' : 'Publisher:'}</strong> {AIFAS_YOGINI_BOOK_METADATA.author} ·{' '}
                    <strong>{isHi ? 'विस्तार:' : 'Pages:'}</strong> 296 {isHi ? 'पृष्ठ' : 'pages'}
                  </div>
                </div>
                <a
                  href={AIFAS_YOGINI_BOOK_METADATA.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary btn-sm"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  <ExternalLink size={14} />
                  <span>{isHi ? 'मूल PDF ग्रंथ देखें' : 'View Treatise PDF'}</span>
                </a>
              </div>

              <div style={{ margin: '12px 0 8px', fontSize: '0.88rem', color: 'var(--text)', lineHeight: 1.5 }}>
                <strong>{isHi ? 'मौलिक सिद्धांत (Axiom):' : 'Core Axiom:'}</strong>{' '}
                {isHi ? AIFAS_YOGINI_BOOK_METADATA.fundamentalAxiomHi : AIFAS_YOGINI_BOOK_METADATA.fundamentalAxiomEn}
              </div>

              <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)', background: '#ffffff', padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.06)' }}>
                <strong>{isHi ? 'ग्रंथ का शास्त्रीय विषय-क्षेत्र:' : 'Scope & Contents:'}</strong> {AIFAS_YOGINI_BOOK_METADATA.scope}
              </div>
            </div>

            {/* 4. 1001 Yogas of Vedic Astrology */}
            <div
              style={{
                padding: '18px',
                borderRadius: '12px',
                background: 'rgba(139, 92, 246, 0.05)',
                border: '1px solid rgba(139, 92, 246, 0.25)',
                borderLeft: '6px solid #8b5cf6',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
                <div>
                  <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#6d28d9', textTransform: 'uppercase' }}>
                    {isHi ? 'शास्त्रीय योग महाकोश' : 'Classical Yoga Encyclopedia'}
                  </span>
                  <h4 style={{ margin: '4px 0', fontSize: '1.25rem', color: '#5b21b6' }}>
                    1001 Yogas of Vedic Astrology
                  </h4>
                  <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                    <strong>{isHi ? 'आधार शास्त्र:' : 'Classical Roots:'}</strong> Brihat Parasara Hora Sastra, Saravali, Jataka Parijata & Phaladeepika
                  </div>
                </div>
              </div>

              <div style={{ margin: '12px 0 8px', fontSize: '0.88rem', color: 'var(--text)', lineHeight: 1.5 }}>
                <strong>{isHi ? 'मौलिक सिद्धांत (Axiom):' : 'Core Axiom:'}</strong>{' '}
                {isHi
                  ? 'योग केवल ग्रहों की उपस्थिति नहीं, बल्कि उनके परस्पर भाव, स्वामित्‍व, युति, दृष्टि और बल का सूक्ष्म गणितीय समन्वय है जो जीवन में अप्रत्याशित सफलता या कठिन परीक्षा उत्पन्न करता है।'
                  : 'Yogas represent precise synergistic combinations of lordship, planetary dignity, aspects, and house disposition that create breakthrough milestones or karmic tests.'}
              </div>

              <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)', background: '#ffffff', padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.06)' }}>
                <strong>{isHi ? 'ग्रंथ का शास्त्रीय विषय-क्षेत्र:' : 'Scope & Contents:'}</strong>{' '}
                {isHi
                  ? '१००१ शास्त्रीय योग: पंचमहापुरुष, राजयोग, विपरीत राजयोग, नीचभंग राजयोग, गजकेसरी, चंद्र-मंगल, नाभस योग (३२ भेद), एवं दरिद्र-अरिष्ट निवारक योग।'
                  : '1001 Classical Yogas: Pancha Mahapurusha, Raja Yogas, Viparita Raja Yogas, Neechabhanga, Gaja Kesari, Chandra-Mangala, Nabhasa Yogas (32 types), and Daridra/Arishta remedies.'}
              </div>
            </div>

            {/* 5. Far Far Away Modern Synthesis */}
            <div
              style={{
                padding: '18px',
                borderRadius: '12px',
                background: 'rgba(236, 72, 153, 0.05)',
                border: '1px solid rgba(236, 72, 153, 0.25)',
                borderLeft: '6px solid #ec4899',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
                <div>
                  <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#be185d', textTransform: 'uppercase' }}>
                    {isHi ? 'आधुनिक शास्त्रीय समन्वय' : 'Modern Applied Classical Synthesis'}
                  </span>
                  <h4 style={{ margin: '4px 0', fontSize: '1.25rem', color: '#9d174d' }}>
                    {FARFARAWAY_SYNTHESIS_METADATA.title}
                  </h4>
                  <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                    <strong>{isHi ? 'लेखक:' : 'Author:'}</strong> {FARFARAWAY_SYNTHESIS_METADATA.author} ({FARFARAWAY_SYNTHESIS_METADATA.affiliation})
                  </div>
                </div>
                <a
                  href={FARFARAWAY_SYNTHESIS_METADATA.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary btn-sm"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  <ExternalLink size={14} />
                  <span>{isHi ? 'ऑनलाइन संदर्भ देखें' : 'View Online Guide'}</span>
                </a>
              </div>

              <div style={{ margin: '12px 0 8px', fontSize: '0.88rem', color: 'var(--text)', lineHeight: 1.5 }}>
                <strong>{isHi ? 'मौलिक सिद्धांत (Axiom):' : 'Core Axiom:'}</strong>{' '}
                {isHi ? FARFARAWAY_SYNTHESIS_METADATA.fundamentalAxiomHi : FARFARAWAY_SYNTHESIS_METADATA.fundamentalAxiomEn}
              </div>

              <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)', background: '#ffffff', padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.06)' }}>
                <strong>{isHi ? 'ग्रंथ का शास्त्रीय विषय-क्षेत्र:' : 'Scope & Contents:'}</strong> {FARFARAWAY_SYNTHESIS_METADATA.scope}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 2: SHODASHAVARGA (16 VARGAS) & BIRTHTIME SENSITIVITY (PVR CHAPTER 6 & 32)
         ========================================================================= */}
      {activeTab === 'vargas' && (
        <div className="amm-card">
          <div className="oj-card-header">
            <div>
              <h3 style={{ margin: 0, fontSize: '1.2rem' }}>
                {isHi ? 'षोडशवर्ग (१६ वर्ग कुंडलियां) एवं जन्म समय संवेदनशीलता' : 'Shodashavarga (16 Divisional Charts) & Time Sensitivity'}
              </h3>
              <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                {isHi
                  ? 'पी.वी.आर. नरसिम्हा राव: प्रत्येक वर्ग कुंडली का अपना स्वतंत्र लग्न होता है और वह जीवन के विशिष्ट सूक्ष्म क्षेत्र को प्रकट करती है।'
                  : 'P.V.R. Narasimha Rao Doctrine: Divisional charts act as independent charts with their own lagnas for micro-environments.'}
              </p>
            </div>
          </div>

          {/* Varga Quick Selector Pills */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', margin: '16px 0' }}>
            {Object.keys(PVR_SHODASHAVARGA_CORPUS).map((code) => {
              const item = PVR_SHODASHAVARGA_CORPUS[code];
              const isSelected = selectedVargaCode === code;
              return (
                <button
                  key={code}
                  type="button"
                  onClick={() => setSelectedVargaCode(code)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '8px',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    background: isSelected ? '#d97706' : 'rgba(0,0,0,0.04)',
                    color: isSelected ? '#ffffff' : 'var(--text)',
                    border: `1px solid ${isSelected ? '#d97706' : 'rgba(0,0,0,0.1)'}`,
                  }}
                >
                  {code} · {isHi ? item.sanskritName.split(' ')[0] : item.englishName.split(' ')[0]}
                </button>
              );
            })}
          </div>

          {/* Selected Varga Deep Profile Card */}
          <div
            style={{
              padding: '18px',
              borderRadius: '12px',
              background: 'rgba(217, 119, 6, 0.05)',
              border: '1px solid rgba(217, 119, 6, 0.25)',
              marginBottom: '20px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <h4 style={{ margin: 0, fontSize: '1.25rem', color: '#92400e' }}>
                {selectedVarga.code}: {selectedVarga.sanskritName} ({selectedVarga.englishName})
              </h4>
              <span
                style={{
                  padding: '3px 10px',
                  borderRadius: '9999px',
                  fontSize: '0.8rem',
                  fontWeight: 800,
                  background: '#d97706',
                  color: '#ffffff',
                }}
              >
                {isHi ? `परिवर्तन काल: ~${selectedVarga.timeWindowMinutes} मिनट` : `Changes every ~${selectedVarga.timeWindowMinutes} mins`}
              </span>
            </div>

            <p style={{ margin: '0 0 10px', fontSize: '0.92rem', color: 'var(--text)', lineHeight: 1.5 }}>
              <strong>{isHi ? 'जीवन कार्यक्षेत्र:' : 'Domain of Life:'}</strong>{' '}
              {isHi ? selectedVarga.domainHi : selectedVarga.domainEn}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px', marginBottom: '10px' }}>
              <div style={{ background: '#ffffff', padding: '12px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.06)' }}>
                <strong style={{ fontSize: '0.85rem', color: '#047857' }}>
                  {isHi ? 'प्रमुख शास्त्रीय कारकत्व (Significations):' : 'Key Significations:'}
                </strong>
                <ul style={{ margin: '6px 0 0', paddingLeft: '18px', fontSize: '0.84rem', color: 'var(--text)' }}>
                  {(isHi ? selectedVarga.significationsHi : selectedVarga.significationsEn).map((sig, idx) => (
                    <li key={idx}>{sig}</li>
                  ))}
                </ul>
              </div>

              <div style={{ background: '#ffffff', padding: '12px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.06)' }}>
                <strong style={{ fontSize: '0.85rem', color: '#b45309' }}>
                  {isHi ? 'स्वतंत्र लग्न विश्लेषण नियम (PVR Independent Lagna Rule):' : 'Independent Lagna Analysis Rule:'}
                </strong>
                <p style={{ margin: '6px 0 0', fontSize: '0.84rem', color: 'var(--text)', lineHeight: 1.45 }}>
                  {isHi ? selectedVarga.independentLagnaRuleHi : selectedVarga.independentLagnaRuleEn}
                </p>
                <div style={{ marginTop: '6px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  <strong>{isHi ? 'निरीक्षण हेतु प्रमुख भाव:' : 'Primary Houses to Inspect:'}</strong>{' '}
                  {selectedVarga.keyHousesToAnalyze.join(', ')} {isHi ? 'भाव' : 'houses'}
                </div>
              </div>
            </div>
          </div>

          {/* Complete 16-Varga Sensitivity Reference Table */}
          <h4 style={{ margin: '20px 0 10px', fontSize: '1.05rem', color: 'var(--text)' }}>
            {isHi ? 'पी.वी.आर. जन्म समय त्रुटि संवेदनशीलता सारणी (PVR Chapter 32):' : 'Birth Time Error Sensitivity & Rectification Table (PVR Chapter 32):'}
          </h4>
          <div className="amm-synastry-table-wrapper">
            <table className="amm-synastry-table">
              <thead>
                <tr>
                  <th style={{ width: '20%' }}>{isHi ? 'वर्ग चक्र' : 'Divisional Chart'}</th>
                  <th style={{ width: '22%' }}>{isHi ? 'लग्न परिवर्तन समय' : 'Lagna Shift Window'}</th>
                  <th style={{ width: '58%' }}>{isHi ? 'शास्त्रीय परीक्षण एवं घटना सत्यापन' : 'Diagnostic Focus & Event Verification'}</th>
                </tr>
              </thead>
              <tbody>
                {PVR_BIRTHTIME_SENSITIVITY_TABLE.map((item, idx) => (
                  <tr key={idx}>
                    <td><strong>{item.varga}</strong></td>
                    <td>
                      <span className="amm-synastry-badge badge-caution">
                        {item.durationMinutes} {isHi ? 'मिनट में बदलाव' : 'mins shift'}
                      </span>
                    </td>
                    <td>{isHi ? item.diagnosticFocusHi : item.diagnosticFocusEn}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 3: YOGADA, MAHA YOGADA & KEVALA MAHA YOGADA (PVR CHAPTER 11 & 13)
         ========================================================================= */}
      {activeTab === 'yogada' && (
        <div className="amm-card">
          <div className="oj-card-header">
            <div>
              <h3 style={{ margin: 0, fontSize: '1.2rem' }}>
                {isHi ? 'योगदा एवं महा योगदा परीक्षण (PVR Yogada Doctrine)' : 'Yogada & Maha Yogada Doctrine (PVR Chapter 11 & 13)'}
              </h3>
              <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                {isHi
                  ? 'पी.वी.आर. नरसिम्हा राव: जो ग्रह लग्न, होरा लग्न (HL) और घटि लग्न (GL) को एक साथ जोड़ता है, वह महा योगदा बनकर अपार सत्ता और धन प्रदान करता है।'
                  : 'A planet connecting Lagna, Hora Lagna (wealth), and Ghati Lagna (power) becomes a Maha Yogada of immense authority.'}
              </p>
            </div>
          </div>

          {/* Real-time Yogada Assessment for Native */}
          <div
            style={{
              padding: '18px',
              borderRadius: '12px',
              margin: '16px 0',
              background: yogadaReport.hasMahaYogada ? 'rgba(5, 150, 105, 0.08)' : 'rgba(217, 119, 6, 0.06)',
              borderLeft: `6px solid ${yogadaReport.hasMahaYogada ? '#059669' : '#d97706'}`,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <h4 style={{ margin: 0, color: yogadaReport.hasMahaYogada ? '#065f46' : '#92400e', fontSize: '1.15rem' }}>
                {isHi ? 'जातक की कुंडली में योगदा विश्लेषण निष्कर्ष:' : 'Yogada Analysis for Native:'}
              </h4>
              <span
                style={{
                  padding: '3px 10px',
                  borderRadius: '9999px',
                  fontWeight: 800,
                  fontSize: '0.82rem',
                  background: yogadaReport.hasMahaYogada ? '#059669' : '#d97706',
                  color: '#ffffff',
                }}
              >
                {yogadaReport.hasKevalaMahaYogada
                  ? 'Kevala Maha Yogada'
                  : yogadaReport.hasMahaYogada
                  ? 'Maha Yogada Active'
                  : yogadaReport.hasYogada
                  ? 'Yogada Active'
                  : 'Standard'}
              </span>
            </div>
            <p style={{ margin: 0, fontSize: '0.92rem', color: 'var(--text)', lineHeight: 1.5 }}>
              {isHi ? yogadaReport.summaryHi : yogadaReport.summaryEn}
            </p>
          </div>

          {/* Yogada Types Explanation Cards */}
          <div className="amm-classical-grid">
            {/* Dhana Yogada */}
            <div className="amm-classical-card" style={{ borderLeft: '5px solid #d97706' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong style={{ fontSize: '0.96rem', color: '#b45309' }}>
                  {isHi ? 'धन योगदा (Lagna + Hora Lagna)' : 'Dhana Yogada (Lagna + HL)'}
                </strong>
                <span className="amm-synastry-badge badge-strong">
                  {yogadaReport.dhanaYogadas.length > 0 ? yogadaReport.dhanaYogadas.join(', ') : (isHi ? 'कोई नहीं' : 'None')}
                </span>
              </div>
              <p style={{ margin: 0, fontSize: '0.84rem', color: 'var(--text)', lineHeight: 1.45 }}>
                {isHi
                  ? 'जो ग्रह लग्न और होरा लग्न (HL) दोनों को राशि दृष्टि, युति अथवा स्वामित्व से जोड़ता है, वह जातक को प्रचुर धन, स्थायी संपत्ति व वित्तीय सुरक्षा प्रदान करता है।'
                  : 'A planet linking Lagna and Hora Lagna (HL) through aspect, conjunction, or ownership confers sustained wealth and material prosperity.'}
              </p>
            </div>

            {/* Raja Yogada */}
            <div className="amm-classical-card" style={{ borderLeft: '5px solid #2563eb' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong style={{ fontSize: '0.96rem', color: '#1e40af' }}>
                  {isHi ? 'राज योगदा (Lagna + Ghati Lagna)' : 'Raja Yogada (Lagna + GL)'}
                </strong>
                <span className="amm-synastry-badge badge-strong">
                  {yogadaReport.rajaYogadas.length > 0 ? yogadaReport.rajaYogadas.join(', ') : (isHi ? 'कोई नहीं' : 'None')}
                </span>
              </div>
              <p style={{ margin: 0, fontSize: '0.84rem', color: 'var(--text)', lineHeight: 1.45 }}>
                {isHi
                  ? 'जो ग्रह लग्न और घटि लग्न (GL) दोनों से संबद्ध होता है, वह जातक को प्रशासनिक शक्ति, उच्च पद, जनता में सम्मान और नेतृत्व का अधिकार देता है।'
                  : 'A planet linking Lagna and Ghati Lagna (GL) confers administrative command, executive rank, public honor, and political leadership.'}
              </p>
            </div>

            {/* Maha Yogada */}
            <div className="amm-classical-card" style={{ borderLeft: '5px solid #059669' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong style={{ fontSize: '0.96rem', color: '#065f46' }}>
                  {isHi ? 'महा योगदा (Lagna + HL + GL)' : 'Maha Yogada (Lagna + HL + GL)'}
                </strong>
                <span className="amm-synastry-badge badge-strong">
                  {yogadaReport.mahaYogadas.length > 0 ? yogadaReport.mahaYogadas.join(', ') : (isHi ? 'कोई नहीं' : 'None')}
                </span>
              </div>
              <p style={{ margin: 0, fontSize: '0.84rem', color: 'var(--text)', lineHeight: 1.45 }}>
                {isHi
                  ? 'जो ग्रह लग्न, होरा लग्न और घटि लग्न तीनों से एक साथ संबंध स्थापित करता है, वह महा योगदा कहलाता है। ऐसा जातक धन और सत्ता दोनों का सर्वोच्च शिखर प्राप्त करता है।'
                  : 'A planet simultaneously linking Lagna, HL, and GL confers both supreme wealth and paramount executive power.'}
              </p>
            </div>

            {/* Kevala Maha Yogada */}
            <div className="amm-classical-card" style={{ borderLeft: '5px solid #8b5cf6' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong style={{ fontSize: '0.96rem', color: '#6d28d9' }}>
                  {isHi ? 'केवल महा योगदा (Lagna + HL + GL + AL)' : 'Kevala Maha Yogada'}
                </strong>
                <span className="amm-synastry-badge badge-strong">
                  {yogadaReport.kevalaMahaYogadas.length > 0 ? yogadaReport.kevalaMahaYogadas.join(', ') : (isHi ? 'कोई नहीं' : 'None')}
                </span>
              </div>
              <p style={{ margin: 0, fontSize: '0.84rem', color: 'var(--text)', lineHeight: 1.45 }}>
                {isHi
                  ? 'यदि महा योगदा ग्रह आरूढ़ लग्न (AL) से भी संबद्ध हो जाए, तो वह केवल महा योगदा बन जाता है। जातक का प्रभाव भौतिक जगत और जनमानस में चिरस्थायी इतिहास रचता है।'
                  : 'When a Maha Yogada planet also links with Arudha Lagna (AL), it becomes Kevala Maha Yogada, ensuring global renown and historical prominence.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 4: ARGALA & VIRODHARGALA INTERVENTION (PVR CHAPTER 10)
         ========================================================================= */}
      {activeTab === 'argala' && (
        <div className="amm-card">
          <div className="oj-card-header">
            <div>
              <h3 style={{ margin: 0, fontSize: '1.2rem' }}>
                {isHi ? 'अर्गला एवं विरोधाग्रला विश्लेषक (PVR Argala & Virodhargala)' : 'Argala & Virodhargala Mechanics (PVR Chapter 10)'}
              </h3>
              <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                {isHi
                  ? 'अर्गला का अर्थ है "सांकल/कुंडी" या निर्णायक हस्तक्षेप। द्वितीय, चतुर्थ व एकादश भाव किसी भी भाव या ग्रह पर प्राथमिक अर्गला डालते हैं।'
                  : 'Argala represents intervention on a house or planet. Houses 2, 4, 11 cause primary argala, obstructed by 12, 10, 3.'}
              </p>
            </div>
          </div>

          {/* House Selector for Argala */}
          <div style={{ margin: '14px 0', display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <strong style={{ fontSize: '0.9rem', color: 'var(--text)' }}>
              {isHi ? 'जिस भाव पर अर्गला देखना है चुनें:' : 'Select Target House to Analyze Argala:'}
            </strong>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {Array.from({ length: 12 }, (_, i) => i + 1).map((hNum) => (
                <button
                  key={hNum}
                  type="button"
                  onClick={() => setSelectedArgalaHouse(hNum)}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    background: selectedArgalaHouse === hNum ? '#2563eb' : 'rgba(0,0,0,0.04)',
                    color: selectedArgalaHouse === hNum ? '#ffffff' : 'var(--text)',
                    border: '1px solid rgba(0,0,0,0.1)',
                  }}
                >
                  {isHi ? `भाव ${hNum}` : `H${hNum}`}
                </button>
              ))}
            </div>
          </div>

          {/* Active Argala Display */}
          <h4 style={{ margin: '18px 0 10px', fontSize: '1.05rem', color: 'var(--text)' }}>
            {isHi ? `${selectedArgalaHouse}वें भाव पर सक्रिय अर्गला एवं विरोधाग्रला:` : `Active Argalas on House ${selectedArgalaHouse}:`}
          </h4>

          {argalaItems.length === 0 ? (
            <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)', background: 'rgba(0,0,0,0.02)', borderRadius: '8px' }}>
              {isHi ? 'इस भाव पर कोई प्रत्यक्ष अर्गला डालने वाले ग्रह उपस्थित नहीं हैं।' : 'No direct occupied planetary argalas active on this house.'}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {argalaItems.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '14px 18px',
                    borderRadius: '10px',
                    background: item.isObstructed ? 'rgba(239, 68, 68, 0.05)' : 'rgba(5, 150, 105, 0.05)',
                    borderLeft: `5px solid ${item.isObstructed ? '#ef4444' : '#059669'}`,
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <strong style={{ fontSize: '0.94rem', color: item.isObstructed ? '#991b1b' : '#065f46' }}>
                      {item.argalaType}: {isHi ? `भाव ${item.houseNumber} में स्थित ग्रह` : `Planets in House ${item.houseNumber}`} ({item.argalaPlanets.map((p) => trPlanet(p, lang)).join(', ')})
                    </strong>
                    <span
                      style={{
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        background: item.isObstructed ? '#fee2e2' : '#d1fae5',
                        color: item.isObstructed ? '#991b1b' : '#065f46',
                      }}
                    >
                      {item.isObstructed
                        ? (isHi ? `अवरुद्ध (भाव ${item.obstructingHouse} द्वारा)` : `Obstructed by H${item.obstructingHouse}`)
                        : (isHi ? 'अनवरुद्ध शुभ अर्गला' : 'Unobstructed')}
                    </span>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.86rem', color: 'var(--text)', lineHeight: 1.45 }}>
                    {isHi ? item.manifestationHi : item.manifestationEn}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Classical Summary Guide */}
          <div style={{ marginTop: '20px', background: '#ffffff', padding: '14px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.08)' }}>
            <strong style={{ fontSize: '0.88rem', color: 'var(--text)' }}>
              {isHi ? 'अर्गला एवं विरोधाग्रला शास्त्रीय नियम संक्षेप (PVR Guidelines):' : 'Argala & Obstruction Summary Rules:'}
            </strong>
            <ul style={{ margin: '8px 0 0', paddingLeft: '20px', fontSize: '0.84rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              <li><strong>{isHi ? '२रा भाव (अवरोध: १२वां):' : '2nd House (Obstructed by 12th):'}</strong> {isHi ? 'कुटुंब, संसाधन व वाणी का अर्गला' : 'Resources, speech, and grooming intervention.'}</li>
              <li><strong>{isHi ? '४था भाव (अवरोध: १०वां):' : '4th House (Obstructed by 10th):'}</strong> {isHi ? 'घरेलू सुख, संपत्ति व आधारभूत संबल का अर्गला' : 'Domestic happiness, schooling, and property support.'}</li>
              <li><strong>{isHi ? '११वां भाव (अवरोध: ३रा):' : '11th House (Obstructed by 3rd):'}</strong> {isHi ? 'आर्थिक लाभ, मित्र व महत्वाकांक्षाओं का उत्प्रेरक अर्गला' : 'Financial gains and influential catalyst intervention.'}</li>
              <li><strong>{isHi ? '५वां भाव (अवरोध: ९वां):' : '5th House (Obstructed by 9th):'}</strong> {isHi ? 'बुद्धि, पूर्व-पुण्य व भावुकता का द्वितीयक अर्गला' : 'Intelligence and emotional contributing factor.'}</li>
            </ul>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 5: GOCHARA MURTHI NIRNAYA (PVR CHAPTER 26)
         ========================================================================= */}
      {activeTab === 'murthi' && (
        <div className="amm-card">
          <div className="oj-card-header">
            <div>
              <h3 style={{ margin: 0, fontSize: '1.2rem' }}>
                {isHi ? 'गोचर मूर्ति निर्णय (PVR Gochara Murthi Nirnaya)' : 'Gochara Murthi Nirnaya (PVR Chapter 26)'}
              </h3>
              <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                {isHi
                  ? 'पी.वी.आर. नरसिम्हा राव: जब कोई ग्रह नई राशि में प्रवेश करता है, उस क्षण गोचर चंद्र का जातक के जन्म चंद्र से भाव उसकी मूर्ति तय करता है।'
                  : 'P.V.R. Narasimha Rao Doctrine: Transit Moon\'s position from natal Moon on planetary ingress day determines the Murthi vessel.'}
              </p>
            </div>
          </div>

          {/* Interactive Ingress Moon Simulator */}
          <div style={{ margin: '16px 0', padding: '16px', borderRadius: '12px', background: 'rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.08)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', marginBottom: '10px' }}>
              <div>
                <strong>{isHi ? 'जातक की जन्म चंद्र राशि:' : 'Native Natal Moon Sign:'}</strong>{' '}
                <span style={{ color: '#0369a1', fontWeight: 800 }}>{trSign(natalMoonSign, lang)}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.86rem' }}>{isHi ? 'गोचर प्रवेश पर चंद्र राशि:' : 'Moon at Ingress:'}</span>
                <select
                  aria-label="Transit Moon at Ingress"
                  value={simTransitMoonSign}
                  onChange={(e) => setSimTransitMoonSign(Number(e.target.value))}
                  style={{ padding: '4px 8px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                >
                  {SIGNS.map((s, idx) => (
                    <option key={idx} value={idx}>
                      {trSign(idx, lang)} ({idx + 1})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Simulated Murthi Outcome */}
            <div
              style={{
                padding: '16px',
                borderRadius: '10px',
                background:
                  murthiReport.type.startsWith('Swarna')
                    ? 'rgba(217, 119, 6, 0.08)'
                    : murthiReport.type.startsWith('Rajata')
                    ? 'rgba(14, 165, 233, 0.08)'
                    : murthiReport.type.startsWith('Taamra')
                    ? 'rgba(180, 83, 9, 0.08)'
                    : 'rgba(239, 68, 68, 0.08)',
                borderLeft: `6px solid ${
                  murthiReport.type.startsWith('Swarna')
                    ? '#d97706'
                    : murthiReport.type.startsWith('Rajata')
                    ? '#0284c7'
                    : murthiReport.type.startsWith('Taamra')
                    ? '#b45309'
                    : '#dc2626'
                }`,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <h4 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text)' }}>
                  {isHi ? murthiReport.meaningHi : murthiReport.meaningEn}
                </h4>
                <span
                  style={{
                    padding: '3px 10px',
                    borderRadius: '9999px',
                    fontWeight: 800,
                    fontSize: '0.85rem',
                    background: murthiReport.favourabilityPercentage >= 75 ? '#059669' : murthiReport.favourabilityPercentage >= 50 ? '#d97706' : '#dc2626',
                    color: '#ffffff',
                  }}
                >
                  {isHi ? `शुभता: ${murthiReport.favourabilityPercentage}%` : `Efficacy: ${murthiReport.favourabilityPercentage}%`}
                </span>
              </div>
              <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--text)', lineHeight: 1.5 }}>
                {isHi ? murthiReport.manifestationNoteHi : murthiReport.manifestationNoteEn}
              </p>
            </div>
          </div>

          {/* Murthi Nirnaya 4-Vessel Standard Table */}
          <div className="amm-synastry-table-wrapper">
            <table className="amm-synastry-table">
              <thead>
                <tr>
                  <th style={{ width: '22%' }}>{isHi ? 'मूर्ति स्वरूप' : 'Murthi Form'}</th>
                  <th style={{ width: '20%' }}>{isHi ? 'जन्म चंद्र से भाव' : 'Houses from Moon'}</th>
                  <th style={{ width: '18%' }}>{isHi ? 'शुभता स्तर' : 'Efficacy'}</th>
                  <th style={{ width: '40%' }}>{isHi ? 'शास्त्रीय फलकथन' : 'Classical Manifestation'}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>{isHi ? '१. स्वर्ण मूर्ति (Gold)' : '1. Swarna (Gold)'}</strong></td>
                  <td>{isHi ? '१, ६, ११वां भाव' : 'Houses 1, 6, 11'}</td>
                  <td><span className="amm-synastry-badge badge-strong">100% {isHi ? 'सर्वोत्तम' : 'Optimal'}</span></td>
                  <td>{isHi ? 'अत्यंत शुभ; प्रतिकूल गोचर भी न्यूनतम हानि करता है और अनुकूल गोचर में पूर्ण सफलता मिलती है।' : 'Highly favorable; even tough transits cause minimal distress, and good transits yield maximum gains.'}</td>
                </tr>
                <tr>
                  <td><strong>{isHi ? '२. रजत मूर्ति (Silver)' : '2. Rajata (Silver)'}</strong></td>
                  <td>{isHi ? '२, ५, ९वां भाव' : 'Houses 2, 5, 9'}</td>
                  <td><span className="amm-synastry-badge badge-balanced">75% {isHi ? 'शुभ' : 'Favorable'}</span></td>
                  <td>{isHi ? 'शुभ व सुखद; आर्थिक प्रगति, पारिवारिक सौख्य एवं मान-सम्मान की वृद्धि होती है।' : 'Favorable and progressive; steady financial growth and domestic harmony.'}</td>
                </tr>
                <tr>
                  <td><strong>{isHi ? '३. ताम्र मूर्ति (Copper)' : '3. Taamra (Copper)'}</strong></td>
                  <td>{isHi ? '३, ७, १०वां भाव' : 'Houses 3, 7, 10'}</td>
                  <td><span className="amm-synastry-badge badge-caution">50% {isHi ? 'मध्यम' : 'Moderate'}</span></td>
                  <td>{isHi ? 'सामान्य व श्रमसाध्य; सफलता केवल अत्यधिक पुरुषार्थ एवं सतर्कता से ही प्राप्त होती है।' : 'Moderate results; success demands disciplined labor and proactive caution.'}</td>
                </tr>
                <tr>
                  <td><strong>{isHi ? '४. लौह मूर्ति (Iron)' : '4. Loha (Iron)'}</strong></td>
                  <td>{isHi ? '४, ८, १२वां भाव' : 'Houses 4, 8, 12'}</td>
                  <td><span className="amm-synastry-badge badge-caution" style={{ background: '#fee2e2', color: '#991b1b', borderColor: '#f87171' }}>25% {isHi ? 'कष्टकारी' : 'Difficult'}</span></td>
                  <td>{isHi ? 'अत्यंत संघर्षपूर्ण व अरिष्टदायक; शुभ गोचर में भी न्यून फल तथा अशुभ गोचर में भारी व्यय व स्वास्थ्य संकट संभव।' : 'Severe testing; even favorable transits yield poor results, while tough transits cause acute friction.'}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
