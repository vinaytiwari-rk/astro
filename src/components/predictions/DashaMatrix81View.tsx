import React, { useMemo, useState } from 'react';
import {
  Award,
  BookOpen,
  Briefcase,
  Calendar,
  CheckCircle2,
  Clock,
  Compass,
  DollarSign,
  Flame,
  Globe,
  Heart,
  Info,
  Layers,
  Printer,
  Shield,
  Sparkles,
  Zap,
} from 'lucide-react';
import {
  getDashaCombinationInsight,
  type DashaCombinationPrediction,
} from '../../astro/predictions/dashaCombinations81';
import { computeVimshottariDasha, findActiveDashaPath } from '../../astro/dasha';
import type { ChartData, NineGrahaId } from '../../astro/types';
import { useLanguage } from '../../i18n/LanguageContext';

interface DashaMatrix81ViewProps {
  chart: ChartData;
  onNavigate?: (view: string) => void;
}

const NINE_GRAHAS: NineGrahaId[] = [
  'Ketu',
  'Venus',
  'Sun',
  'Moon',
  'Mars',
  'Rahu',
  'Jupiter',
  'Saturn',
  'Mercury',
];

const PLANET_NAMES_HI: Record<NineGrahaId, string> = {
  Sun: 'सूर्य',
  Moon: 'चंद्र',
  Mars: 'मंगल',
  Mercury: 'बुध',
  Jupiter: 'गुरु',
  Venus: 'शुक्र',
  Saturn: 'शनि',
  Rahu: 'राहु',
  Ketu: 'केतु',
};

export const DashaMatrix81View: React.FC<DashaMatrix81ViewProps> = ({ chart, onNavigate }) => {
  const { lang } = useLanguage();
  const isHi = lang === 'hi';

  const moon = chart.planets.find((p) => p.id === 'Moon');
  const moonLon = moon ? moon.longitude : 0;

  // Compute active dasha right now
  const dashaTree = useMemo(() => {
    return computeVimshottariDasha(moonLon, chart.utcMs, chart.settings.dashaYearType || 'sidereal');
  }, [moonLon, chart.utcMs, chart.settings.dashaYearType]);

  const activePath = useMemo(() => {
    return findActiveDashaPath(dashaTree, Date.now());
  }, [dashaTree]);

  const activeMdLord = (activePath[0]?.lord as NineGrahaId) || 'Jupiter';
  const activeAdLord = (activePath[1]?.lord as NineGrahaId) || 'Saturn';

  const [selectedMd, setSelectedMd] = useState<NineGrahaId>(activeMdLord);
  const [selectedAd, setSelectedAd] = useState<NineGrahaId>(activeAdLord);

  const insight: DashaCombinationPrediction = useMemo(() => {
    return getDashaCombinationInsight(chart, selectedMd, selectedAd);
  }, [chart, selectedMd, selectedAd]);

  const isCurrentRunning = selectedMd === activeMdLord && selectedAd === activeAdLord;

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
          {isHi ? '८१ महादशा-अंतर्दशा संयुक्त फलकथन' : '81 Dasha Combinations Matrix'}
        </span>
      </nav>

      {/* Header Card */}
      <div className="oj-page-header-card">
        <div className="oj-header-badge">
          {isHi
            ? 'महादशा-अंतर्दशा आपसी दृष्टि, षडाष्टक (6/8), द्वि-द्वादश (2/12) व नवपंचम (5/9) फल'
            : 'Synthesis of Mutual Angular Relationship (Sambandha) between MD Lord and AD Lord'}
        </div>
        <h1 className="oj-page-title">
          {isHi
            ? '८१ महादशा-अंतर्दशा का गहन संयुक्त फलादेश'
            : '81 Mahadasha-Antardasha Interactive Deep Matrix'}
        </h1>
        <p className="oj-page-subtitle">
          {isHi
            ? 'केवल महादशा या अंतर्दशा का पृथक फल देखना भ्रामक होता है। फलित ज्योतिष के नियमानुसार दोनों ग्रहों का पारस्परिक संबंध (युति, षडाष्टक, द्वि-द्वादश, नवपंचम) ही वास्तविक घटना को निर्धारित करता है।'
            : 'Evaluates the mutual angular relationship and natural friendship between the Mahadasha and Antardasha lords to deliver specific unvarnished predictions for career, finance, health, and family.'}
        </p>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center', marginTop: '14px' }}>
          <button
            onClick={() => {
              setSelectedMd(activeMdLord);
              setSelectedAd(activeAdLord);
            }}
            className="oj-action-btn no-print"
            style={{
              background: isCurrentRunning ? '#166534' : '#0284c7',
              color: '#ffffff',
              border: 'none',
              padding: '6px 14px',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: 'bold',
              cursor: 'pointer',
            }}
          >
            {isHi ? `वर्तमान चालू दशा चुनें (${PLANET_NAMES_HI[activeMdLord]}/${PLANET_NAMES_HI[activeAdLord]})` : `Select Currently Running Dasha (${activeMdLord}/${activeAdLord})`}
          </button>

          <button
            onClick={() => window.print()}
            className="oj-action-btn no-print"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <Printer size={15} />
            <span>{isHi ? 'दशा फल प्रिंट करें' : 'Print Dasha Analysis'}</span>
          </button>
        </div>
      </div>

      {/* Selectors Bar */}
      <div className="oj-card" style={{ marginBottom: '16px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
          {/* MD Selector */}
          <div>
            <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#1e293b', marginBottom: '6px' }}>
              {isHi ? '१. महादशा स्वामी (Mahadasha Lord):' : '1. Select Mahadasha Lord:'}
            </div>
            <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
              {NINE_GRAHAS.map((p) => (
                <button
                  key={`md-${p}`}
                  onClick={() => setSelectedMd(p)}
                  className={`oj-tab-pill ${selectedMd === p ? 'is-active' : ''}`}
                  style={{ fontSize: '11px', padding: '4px 8px' }}
                >
                  {isHi ? PLANET_NAMES_HI[p] : p}
                </button>
              ))}
            </div>
          </div>

          {/* AD Selector */}
          <div>
            <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#1e293b', marginBottom: '6px' }}>
              {isHi ? '२. अंतर्दशा स्वामी (Antardasha Lord):' : '2. Select Antardasha Lord:'}
            </div>
            <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
              {NINE_GRAHAS.map((p) => (
                <button
                  key={`ad-${p}`}
                  onClick={() => setSelectedAd(p)}
                  className={`oj-tab-pill ${selectedAd === p ? 'is-active' : ''}`}
                  style={{ fontSize: '11px', padding: '4px 8px' }}
                >
                  {isHi ? PLANET_NAMES_HI[p] : p}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Selected Dasha Combination Card */}
      <div
        className="oj-card"
        style={{
          border: '2px solid #0284c7',
          background: 'linear-gradient(135deg, #f8fafc 0%, #f0f9ff 100%)',
          marginBottom: '20px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <span
              style={{
                background: '#0284c7',
                color: '#ffffff',
                padding: '3px 10px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: 'bold',
              }}
            >
              {isHi ? `${insight.mdLordHi} महादशा में ${insight.adLordHi} अंतर्दशा` : `${insight.mdLord} MD / ${insight.adLord} AD`}
            </span>
            {isCurrentRunning && (
              <span
                style={{
                  marginLeft: '8px',
                  background: '#dcfce7',
                  color: '#15803d',
                  padding: '3px 8px',
                  borderRadius: '12px',
                  fontSize: '11px',
                  fontWeight: 'bold',
                }}
              >
                {isHi ? 'वर्तमान में सक्रिय' : 'Currently Active'}
              </span>
            )}
            <h2 style={{ fontSize: '20px', margin: '8px 0 0 0', color: '#0c4a6e' }}>
              {isHi ? insight.generalThemeHi : insight.generalThemeEn}
            </h2>
          </div>

          <div
            style={{
              background: '#ffffff',
              border: '1px solid #bae6fd',
              borderRadius: '8px',
              padding: '6px 14px',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '11px', color: '#0369a1', fontWeight: 600 }}>
              {isHi ? 'परस्पर भाव संबंध' : 'Mutual Angular Axis'}
            </div>
            <div style={{ fontSize: '15px', fontWeight: 'bold', color: '#0c4a6e', marginTop: '2px' }}>
              {isHi ? insight.mutualAxisHi : insight.mutualAxis}
            </div>
          </div>
        </div>

        {/* 4 Pillars Breakdown */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px', marginTop: '16px' }}>
          {/* Career & Status */}
          <div style={{ background: '#ffffff', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 'bold', fontSize: '13px', color: '#0369a1', marginBottom: '6px' }}>
              <Briefcase size={16} />
              <span>{isHi ? 'कॅरियर, पद व सामाजिक प्रतिष्ठा' : 'Career & Authority'}</span>
            </div>
            <div style={{ fontSize: '12px', color: '#334155' }}>
              {isHi ? insight.careerImpactHi : insight.careerImpactEn}
            </div>
          </div>

          {/* Wealth & Finance */}
          <div style={{ background: '#ffffff', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 'bold', fontSize: '13px', color: '#15803d', marginBottom: '6px' }}>
              <DollarSign size={16} />
              <span>{isHi ? 'धन, संपत्ति व व्यापारिक लाभ' : 'Wealth & Prosperity'}</span>
            </div>
            <div style={{ fontSize: '12px', color: '#334155' }}>
              {isHi ? insight.wealthImpactHi : insight.wealthImpactEn}
            </div>
          </div>

          {/* Health & Domestic Life */}
          <div style={{ background: '#ffffff', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 'bold', fontSize: '13px', color: '#854d0e', marginBottom: '6px' }}>
              <Heart size={16} />
              <span>{isHi ? 'स्वास्थ्य, परिवार व मानसिक संतुलन' : 'Health & Domestic Peace'}</span>
            </div>
            <div style={{ fontSize: '12px', color: '#334155' }}>
              {isHi ? insight.healthFamilyHi : insight.healthFamilyEn}
            </div>
          </div>

          {/* Shastric Remedy */}
          <div style={{ background: '#ffffff', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 'bold', fontSize: '13px', color: '#6d28d9', marginBottom: '6px' }}>
              <Sparkles size={16} />
              <span>{isHi ? 'शास्त्रीय परिहार व वैदिक उपाय' : 'Shastric Upaya / Remedy'}</span>
            </div>
            <div style={{ fontSize: '12px', color: '#334155' }}>
              {isHi ? insight.classicalRemedyHi : insight.classicalRemedyEn}
            </div>
          </div>
        </div>

        {/* Unvarnished Reality Box */}
        <div
          style={{
            background: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '8px',
            padding: '12px',
            marginTop: '14px',
            fontSize: '12px',
            color: '#991b1b',
          }}
        >
          <strong>{isHi ? 'यथार्थवादी सत्य व सावधानी (Unvarnished Truth):' : 'Unvarnished Truth & Critical Caution:'}</strong>{' '}
          {isHi ? insight.unvarnishedRealityHi : insight.unvarnishedRealityEn}
        </div>
      </div>
    </div>
  );
};

export default DashaMatrix81View;
