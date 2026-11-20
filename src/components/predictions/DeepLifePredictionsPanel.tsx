import React, { useMemo, useState } from 'react';
import {
  AlertTriangle,
  Award,
  BookOpen,
  Briefcase,
  Calendar,
  CheckCircle,
  Clock,
  Coins,
  Compass,
  Heart,
  Layers,
  Moon,
  Shield,
  Sparkles,
  Sun,
  User,
} from 'lucide-react';
import {
  computeDeepLifePredictions,
} from '../../astro/predictions/deepLifePredictions';
import type { ChartData } from '../../astro/types';
import { useLanguage } from '../../i18n/LanguageContext';

interface DeepLifePredictionsPanelProps {
  chart: ChartData;
}

export const DeepLifePredictionsPanel: React.FC<DeepLifePredictionsPanelProps> = ({
  chart,
}) => {
  const { lang } = useLanguage();
  const isHi = lang === 'hi';
  const [selectedDomainId, setSelectedDomainId] = useState<string>('all');
  const [birthProfileTab, setBirthProfileTab] = useState<'panchanga' | 'seasonal' | 'navamsha' | 'avakhada' | 'grid'>('panchanga');

  const report = useMemo(() => computeDeepLifePredictions(chart), [chart]);

  const domainIcons: Record<string, React.ReactNode> = {
    personality: <User size={16} />,
    wealth: <Coins size={16} />,
    career: <Briefcase size={16} />,
    marriage: <Heart size={16} />,
    health: <Shield size={16} />,
    spirituality: <Sparkles size={16} />,
  };

  const filteredDomains =
    selectedDomainId === 'all'
      ? report.domains
      : report.domains.filter((d) => d.id === selectedDomainId);

  const tithiFactor = report.birthProfile.factors.find((f) => f.id === 'tithi');
  const varaFactor = report.birthProfile.factors.find((f) => f.id === 'weekday');
  const nakshatraFactor = report.birthProfile.factors.find((f) => f.id === 'nakshatra-charan');
  const yogaFactor = report.birthProfile.factors.find((f) => f.id === 'surya-yoga');
  const karanaFactor = report.birthProfile.factors.find((f) => f.id === 'karana');

  const navProfile = report.birthProfile.navamshaLagna;
  const tithiDetails = report.birthProfile.tithiDetails;
  const seasonal = report.birthProfile.seasonalDetails;

  return (
    <div className="view-stack">
      {/* Top Banner: Authentic Indication-Based Reading */}
      <div className="card" style={{ borderLeft: '4px solid var(--accent)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={20} style={{ color: 'var(--accent)' }} />
              <span>{isHi ? 'विस्तृत सामान्य फलादेश (General & Foundational Predictions)' : 'General & Foundational Life Predictions'}</span>
            </h2>
            <p className="muted" style={{ margin: '4px 0 0', fontSize: '13px' }}>
              {isHi
                ? 'जन्म पंचांग, नित्या देवी, पृथु यशस् नवांश लग्न, ऋतुचक्र एवं ६ प्रमुख जीवन-क्षेत्रों का प्रामाणिक फलादेश'
                : 'Authentic Shastric predictions based on Panchanga, Nitya Devis, Prithu Yasas Navamsha, and 6 core life spheres'}
            </p>
          </div>

          <span className="badge badge-subtle">
            {isHi ? 'AV Astro Vibe प्रामाणिक फलादेश' : 'AV Astro Vibe Classical Synthesis'}
          </span>
        </div>
      </div>

      {/* 4 Master Prediction Pillars: Stature, Prime Golden Era, Testing Periods, and Karmic Mission */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '12px' }}>
        {/* Pillar 1: Life Stature */}
        <div className="card" style={{ padding: '14px', borderTop: '3px solid #d97706', background: 'var(--bg-elevated)' }}>
          <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            {isHi ? 'जीवन प्रतिष्ठा व वर्ग' : 'Life Stature & Social Class'}
          </div>
          <div style={{ fontSize: '15px', fontWeight: 700, margin: '4px 0 6px', color: '#b45309' }}>
            {isHi ? (report.lifeStatureClassHi || 'समृद्ध व कुलीन वर्ग') : (report.lifeStatureClassEn || 'Affluent & Dignified Class')}
          </div>
          <div style={{ fontSize: '12.5px', lineHeight: 1.45, color: 'var(--text)' }}>
            {isHi ? report.lifeStatureMeaningHi : report.lifeStatureMeaningEn}
          </div>
        </div>

        {/* Pillar 2: Prime Golden Rise Era */}
        <div className="card" style={{ padding: '14px', borderTop: '3px solid #16a34a', background: 'var(--bg-elevated)' }}>
          <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            {isHi ? 'महा-भाग्योदय स्वर्ण काल' : 'Peak Rise Golden Era'}
          </div>
          <div style={{ fontSize: '15px', fontWeight: 700, margin: '4px 0 6px', color: '#16a34a' }}>
            {isHi ? report.peakRiseAgeWindowHi : report.peakRiseAgeWindowEn}
          </div>
          <div style={{ fontSize: '12.5px', lineHeight: 1.45, color: 'var(--text)' }}>
            {isHi
              ? 'इस कालखंड में करियर, संपत्ति व सामाजिक प्रतिष्ठा का सर्वोच्च उत्कर्ष होगा।'
              : 'Maximum accumulation of wealth, professional elevation and authority manifests here.'}
          </div>
        </div>

        {/* Pillar 3: Testing Eras / Crisis Warning */}
        <div className="card" style={{ padding: '14px', borderTop: '3px solid #dc2626', background: 'var(--bg-elevated)' }}>
          <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            {isHi ? 'जीवन परीक्षा व सतर्कता काल' : 'Testing / Caution Periods'}
          </div>
          <ul style={{ margin: '6px 0 0', paddingLeft: '16px', fontSize: '12px', lineHeight: 1.45, color: 'var(--text)' }}>
            {(isHi ? (report.crisisErasHi || []) : (report.crisisErasEn || [])).slice(0, 2).map((era, eIdx) => (
              <li key={eIdx} style={{ marginBottom: '3px' }}>{era}</li>
            ))}
          </ul>
        </div>

        {/* Pillar 4: Karmic Mission */}
        <div className="card" style={{ padding: '14px', borderTop: '3px solid #2563eb', background: 'var(--bg-elevated)' }}>
          <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            {isHi ? 'मूल आत्मिक कर्म पथ' : 'Soul Karmic Mission'}
          </div>
          <div style={{ fontSize: '14px', fontWeight: 700, margin: '4px 0 6px', color: '#2563eb' }}>
            {isHi ? report.karmicMissionHi : report.karmicMissionEn}
          </div>
          <div style={{ fontSize: '12.5px', lineHeight: 1.45, color: 'var(--text)' }}>
            {isHi
              ? 'सांसारिक उपलब्धियों के साथ-साथ संस्थागत न्याय व धर्म का निर्वहन जीवन का सर्वोच्च उद्देश्य है।'
              : 'Balancing executive success with institutional righteousness defines the ultimate destiny.'}
          </div>
        </div>
      </div>

      {/* Comprehensive Shastric Birth Foundations Section */}
      <div className="card" style={{ padding: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BookOpen size={18} style={{ color: 'var(--accent)' }} />
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700 }}>
              {isHi ? 'जन्म पंचांग, नित्या देवी एवं पृथु यशस् नवांश फलादेश' : 'Classical Panchanga, Nitya Devi & Prithu Yasas Navamsha'}
            </h3>
          </div>
          <span className="badge badge-subtle">
            {isHi ? 'वैदिक मूल फलकथन' : 'Vedic Shastric Foundations'}
          </span>
        </div>

        {/* Section Sub-Navigation Buttons */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '14px' }}>
          <button
            type="button"
            className={`btn btn-sm ${birthProfileTab === 'panchanga' ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setBirthProfileTab('panchanga')}
            style={{ fontWeight: 600, fontSize: '12.5px' }}
          >
            {isHi ? 'पंच महा-अंग एवं नित्या देवी' : 'Panchanga & Nitya Devi'}
          </button>
          <button
            type="button"
            className={`btn btn-sm ${birthProfileTab === 'seasonal' ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setBirthProfileTab('seasonal')}
            style={{ fontWeight: 600, fontSize: '12.5px' }}
          >
            {isHi ? 'कालचक्र, अयन व ऋतु फल' : 'Ayana, Season, Prahar & Hora'}
          </button>
          <button
            type="button"
            className={`btn btn-sm ${birthProfileTab === 'navamsha' ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setBirthProfileTab('navamsha')}
            style={{ fontWeight: 600, fontSize: '12.5px' }}
          >
            {isHi ? 'पृथु यशस् - नवांश लग्न व संवेदनशील वर्ष' : 'Prithu Yasas Navamsha & Ages'}
          </button>
          <button
            type="button"
            className={`btn btn-sm ${birthProfileTab === 'avakhada' ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setBirthProfileTab('avakhada')}
            style={{ fontWeight: 600, fontSize: '12.5px' }}
          >
            {isHi ? 'अवकहड़ा चक्र व आत्मकारक' : 'Avakhada Chakra & AK'}
          </button>
          <button
            type="button"
            className={`btn btn-sm ${birthProfileTab === 'grid' ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setBirthProfileTab('grid')}
            style={{ fontWeight: 600, fontSize: '12.5px' }}
          >
            {isHi ? 'समस्त २० जन्म कारक तालिका' : 'All 20 Factors Overview'}
          </button>
        </div>

        {/* TAB 1: PANCHANGA & NITYA DEVI */}
        {birthProfileTab === 'panchanga' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {/* Vara Card */}
            {varaFactor && (
              <div style={{ padding: '12px 14px', borderRadius: '8px', background: 'var(--bg-subtle)', borderLeft: '4px solid #b45309' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '6px', marginBottom: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Calendar size={15} style={{ color: '#b45309' }} />
                    <span style={{ fontWeight: 700, fontSize: '14px' }}>
                      {isHi ? 'वार फलादेश (Day of Week)' : 'Vara Prediction (Day of Week)'}
                    </span>
                  </div>
                  <span className="badge" style={{ background: 'rgba(180, 83, 9, 0.12)', color: '#b45309', fontWeight: 650 }}>
                    {isHi ? varaFactor.valueHi : varaFactor.valueEn}
                  </span>
                </div>
                <div style={{ fontSize: '13px', lineHeight: 1.55 }}>
                  {isHi ? varaFactor.interpretationHi : varaFactor.interpretationEn}
                </div>
              </div>
            )}

            {/* Tithi, Category, Nitya Devi & Combination Card */}
            {tithiDetails && (
              <div style={{ padding: '14px', borderRadius: '8px', background: 'var(--bg-subtle)', borderLeft: '4px solid #7c3aed' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '6px', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Moon size={15} style={{ color: '#7c3aed' }} />
                    <span style={{ fontWeight: 700, fontSize: '14px' }}>
                      {isHi ? 'तिथि एवं नित्या देवी फलादेश' : 'Tithi, Classification & Nitya Devi Prediction'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    <span className="badge" style={{ background: 'rgba(124, 58, 237, 0.12)', color: '#7c3aed', fontWeight: 650 }}>
                      {isHi ? tithiDetails.tithiNameHi : tithiDetails.tithiNameEn} ({isHi ? tithiDetails.categoryHi : tithiDetails.category})
                    </span>
                    {tithiDetails.combinationYoga?.alertType ? (
                      <span className="badge" style={{ background: 'rgba(220, 38, 38, 0.12)', color: '#dc2626', fontWeight: 650 }}>
                        {isHi ? tithiDetails.combinationYoga.combinationTitleHi : tithiDetails.combinationYoga.combinationTitleEn}
                      </span>
                    ) : (
                      <span className="badge" style={{ background: 'rgba(22, 163, 74, 0.12)', color: '#16a34a', fontWeight: 650 }}>
                        {isHi ? (tithiDetails.combinationYoga?.combinationTitleHi || 'शुभ योग') : (tithiDetails.combinationYoga?.combinationTitleEn || 'Auspicious Yoga')}
                      </span>
                    )}
                  </div>
                </div>

                <div style={{ fontSize: '13px', lineHeight: 1.55, marginBottom: '10px' }}>
                  {tithiFactor ? (isHi ? tithiFactor.interpretationHi : tithiFactor.interpretationEn) : ''}
                </div>

                {/* Nitya Devi Sacred Mantra Box */}
                {tithiDetails.nityaDeviMantra && (
                  <div style={{ padding: '10px 12px', background: 'var(--bg-elevated)', borderRadius: '6px', border: '1px solid rgba(124, 58, 237, 0.25)', marginBottom: '8px' }}>
                    <div style={{ fontSize: '11px', color: '#7c3aed', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '3px' }}>
                      {isHi ? `अधिष्ठात्री नित्या देवी: ${tithiDetails.governingNityaDeviHi} (पवित्र मंत्र)` : `Governing Nitya Devi: ${tithiDetails.governingNityaDeviEn} (Sacred Mantra)`}
                    </div>
                    <div style={{ fontSize: '12.5px', fontWeight: 600, fontStyle: 'italic', color: 'var(--text)', wordBreak: 'break-word' }}>
                      "{tithiDetails.nityaDeviMantra}"
                    </div>
                  </div>
                )}

                <div style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.45 }}>
                  <strong>{isHi ? 'अधिष्ठाता देव: ' : 'Presiding Deity: '}</strong>
                  <span>{isHi ? tithiDetails.presidingDeityHi : tithiDetails.presidingDeityEn}</span>
                </div>
              </div>
            )}

            {/* Nakshatra Card */}
            {nakshatraFactor && (
              <div style={{ padding: '12px 14px', borderRadius: '8px', background: 'var(--bg-subtle)', borderLeft: '4px solid #0284c7' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '6px', marginBottom: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Compass size={15} style={{ color: '#0284c7' }} />
                    <span style={{ fontWeight: 700, fontSize: '14px' }}>
                      {isHi ? 'जन्म नक्षत्र व चरण फलादेश' : 'Birth Nakshatra & Pada Profile'}
                    </span>
                  </div>
                  <span className="badge" style={{ background: 'rgba(2, 132, 199, 0.12)', color: '#0284c7', fontWeight: 650 }}>
                    {isHi ? nakshatraFactor.valueHi : nakshatraFactor.valueEn}
                  </span>
                </div>
                <div style={{ fontSize: '13px', lineHeight: 1.55 }}>
                  {isHi ? nakshatraFactor.interpretationHi : nakshatraFactor.interpretationEn}
                </div>
              </div>
            )}

            {/* Yoga & Karana 2-Column Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '10px' }}>
              {yogaFactor && (
                <div style={{ padding: '12px', borderRadius: '8px', background: 'var(--bg-subtle)', borderLeft: '4px solid #16a34a' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '3px' }}>
                    {isHi ? 'सूर्य-चंद्र नित्य योग' : 'Surya-Chandra Nitya Yoga'}
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#16a34a', marginBottom: '4px' }}>
                    {isHi ? yogaFactor.valueHi : yogaFactor.valueEn}
                  </div>
                  <div style={{ fontSize: '12.5px', lineHeight: 1.5 }}>
                    {isHi ? yogaFactor.interpretationHi : yogaFactor.interpretationEn}
                  </div>
                </div>
              )}

              {karanaFactor && (
                <div style={{ padding: '12px', borderRadius: '8px', background: 'var(--bg-subtle)', borderLeft: '4px solid #ea580c' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '3px' }}>
                    {isHi ? 'जन्म करण (पुरुषार्थ शक्ति)' : 'Birth Karana (Executive Drive)'}
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#ea580c', marginBottom: '4px' }}>
                    {isHi ? karanaFactor.valueHi : karanaFactor.valueEn}
                  </div>
                  <div style={{ fontSize: '12.5px', lineHeight: 1.5 }}>
                    {isHi ? karanaFactor.interpretationHi : karanaFactor.interpretationEn}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: AYANA, SEASON, PRAHAR & HORA */}
        {birthProfileTab === 'seasonal' && seasonal && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {/* Ayana & Lunar Month */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '10px' }}>
              {/* Ayana */}
              <div style={{ padding: '12px 14px', borderRadius: '8px', background: 'var(--bg-subtle)', borderLeft: '4px solid #d97706' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                  <Sun size={15} style={{ color: '#d97706' }} />
                  <span style={{ fontWeight: 700, fontSize: '13.5px' }}>
                    {isHi ? 'अयन प्रभाव (Uttarayana / Dakshinayana)' : 'Ayana Profile (Solar Half-Year)'}
                  </span>
                </div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#b45309', marginBottom: '4px' }}>
                  {isHi ? seasonal.ayanaHi : seasonal.ayanaEn}
                </div>
                <div style={{ fontSize: '12.5px', lineHeight: 1.5 }}>
                  {isHi ? seasonal.ayanaReadingHi : seasonal.ayanaReadingEn}
                </div>
              </div>

              {/* Maas */}
              <div style={{ padding: '12px 14px', borderRadius: '8px', background: 'var(--bg-subtle)', borderLeft: '4px solid #2563eb' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                  <Moon size={15} style={{ color: '#2563eb' }} />
                  <span style={{ fontWeight: 700, fontSize: '13.5px' }}>
                    {isHi ? 'चांद्र मास एवं अधिकमास' : 'Lunar Month & Adhika Maas'}
                  </span>
                </div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#2563eb', marginBottom: '4px' }}>
                  {isHi ? seasonal.maasHi : seasonal.maasEn}
                  {seasonal.isAdhika && (
                    <span className="badge" style={{ marginLeft: '6px', background: 'rgba(37, 99, 235, 0.12)', color: '#2563eb' }}>
                      {isHi ? 'अधिक मास (पुरुषोत्तम मास)' : 'Adhika Maas'}
                    </span>
                  )}
                </div>
                <div style={{ fontSize: '12.5px', lineHeight: 1.5 }}>
                  {isHi ? seasonal.maasReadingHi : seasonal.maasReadingEn}
                </div>
              </div>
            </div>

            {/* Ritu & Diurnal Prahar / Kaal */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '10px' }}>
              {/* Ritu */}
              <div style={{ padding: '12px 14px', borderRadius: '8px', background: 'var(--bg-subtle)', borderLeft: '4px solid #16a34a' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '3px' }}>
                  {isHi ? 'वैदिक षड् ऋतु फल' : 'Vedic Season (Ritu) Constitution'}
                </div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#16a34a', marginBottom: '4px' }}>
                  {isHi ? seasonal.rituHi : seasonal.rituEn}
                </div>
                <div style={{ fontSize: '12.5px', lineHeight: 1.5 }}>
                  {isHi ? seasonal.rituReadingHi : seasonal.rituReadingEn}
                </div>
              </div>

              {/* Kaal / Prahar */}
              <div style={{ padding: '12px 14px', borderRadius: '8px', background: 'var(--bg-subtle)', borderLeft: '4px solid #7c3aed' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '3px' }}>
                  {isHi ? 'जन्म काल / प्रहर फल' : 'Birth Diurnal Prahar (Kaal)'}
                </div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#7c3aed', marginBottom: '4px' }}>
                  {isHi ? seasonal.kaalHi : seasonal.kaalEn}
                </div>
                <div style={{ fontSize: '12.5px', lineHeight: 1.5 }}>
                  {isHi ? seasonal.kaalReadingHi : seasonal.kaalReadingEn}
                </div>
              </div>
            </div>

            {/* Hora & Gregorian Month */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '10px' }}>
              {/* Hora */}
              <div style={{ padding: '12px 14px', borderRadius: '8px', background: 'var(--bg-subtle)', borderLeft: '4px solid #0891b2' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '3px' }}>
                  {isHi ? 'सूर्य-चंद्र होरा फल' : 'Sun/Moon Hora Profile'}
                </div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#0891b2', marginBottom: '4px' }}>
                  {isHi ? seasonal.horaHi : seasonal.horaEn}
                </div>
                <div style={{ fontSize: '12.5px', lineHeight: 1.5 }}>
                  {isHi ? seasonal.horaReadingHi : seasonal.horaReadingEn}
                </div>
              </div>

              {/* Gregorian Month */}
              <div style={{ padding: '12px 14px', borderRadius: '8px', background: 'var(--bg-subtle)', borderLeft: '4px solid #4f46e5' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '3px' }}>
                  {isHi ? 'अंग्रेजी जन्म मास प्रभाव' : 'Gregorian Month Archetype'}
                </div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#4f46e5', marginBottom: '4px' }}>
                  {isHi ? seasonal.gregorianMonthHi : seasonal.gregorianMonthEn}
                </div>
                <div style={{ fontSize: '12.5px', lineHeight: 1.5 }}>
                  {isHi ? seasonal.gregorianReadingHi : seasonal.gregorianReadingEn}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: PRITHU YASAS NAVAMSHA LAGNA & SENSITIVE AGES */}
        {birthProfileTab === 'navamsha' && navProfile && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ padding: '14px', borderRadius: '8px', background: 'var(--bg-subtle)', borderLeft: '4px solid #dc2626' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Award size={18} style={{ color: '#dc2626' }} />
                  <span style={{ fontWeight: 700, fontSize: '15px' }}>
                    {isHi ? `पृथु यशस् नवांश फल (${navProfile.signNameHi})` : `Prithu Yasas Navamsha Reading (${navProfile.signNameEn})`}
                  </span>
                </div>
                {navProfile.isVargottama && (
                  <span className="badge" style={{ background: 'rgba(22, 163, 74, 0.15)', color: '#16a34a', fontWeight: 700 }}>
                    {isHi ? 'विशेष वर्गोत्तम नवांश लग्न (दोहरा शुभ फल)' : 'Vargottama Navamsha Lagna (Two-Fold Prosperity)'}
                  </span>
                )}
              </div>

              {/* Dictum */}
              <div style={{ fontSize: '13.5px', lineHeight: 1.6, marginBottom: '12px', color: 'var(--text)' }}>
                {isHi ? navProfile.readingHi : navProfile.readingEn}
              </div>

              {/* Critical Vulnerability Ages Row */}
              <div style={{ padding: '10px 14px', background: 'rgba(220, 38, 38, 0.08)', borderRadius: '6px', border: '1px solid rgba(220, 38, 38, 0.2)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#dc2626', fontWeight: 700, fontSize: '13px', marginBottom: '6px', flexWrap: 'wrap' }}>
                  <AlertTriangle size={15} />
                  <span>{isHi ? 'विशेष संवेदनशील व परीक्षा आयु वर्ष (Prithu Yasas Sensitive Ages):' : 'Prithu Yasas Critical Vulnerability Milestones:'}</span>
                </div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '6px' }}>
                  {navProfile.vulnerabilityAges.map((age: number, aIdx: number) => (
                    <span
                      key={aIdx}
                      style={{
                        padding: '3px 9px',
                        background: '#dc2626',
                        color: '#ffffff',
                        borderRadius: '4px',
                        fontWeight: 700,
                        fontSize: '12px',
                      }}
                    >
                      {age} {isHi ? 'वर्ष' : 'Yrs'}
                    </span>
                  ))}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text)', lineHeight: 1.45 }}>
                  {isHi ? navProfile.sageWarningHi : navProfile.sageWarningEn}
                </div>
              </div>

              <div style={{ marginTop: '8px', fontSize: '11.5px', color: 'var(--text-muted)' }}>
                {isHi
                  ? 'शास्त्रीय संदर्भ: वराहमिहिर-पुत्र पृथु यशस् प्रणीत होरासार ग्रन्थ। इन आयु पड़ावों में स्वास्थ्य व निर्णयों में संयम तथा महामृत्युंजय अथवा कुलदेवता आराधना उत्तम फल देती है।'
                  : 'Source: Horasara by Prithu Yasas (son of Varahamihira). Preventive healthcare and spiritual remedies are recommended during these designated milestone years.'}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: AVAKHADA ELEMENTS & SPIRITUAL PILLARS */}
        {birthProfileTab === 'avakhada' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '8px' }}>
              {report.birthProfile.factors
                .filter((f) => ['varna', 'vashya', 'yoni', 'gana', 'nadi', 'nadi-pad', 'tattva', 'paya', 'naam-akshar', 'atmakaraka', 'ishta-dev'].includes(f.id))
                .map((factor) => (
                  <div key={factor.id} style={{ padding: '9px 11px', borderRadius: '7px', background: 'var(--bg-subtle)', minWidth: 0 }}>
                    <div className="muted" style={{ fontSize: '11px', marginBottom: '3px' }}>
                      {isHi ? factor.labelHi : factor.labelEn}
                    </div>
                    <div style={{ fontSize: '13px', fontWeight: 650, lineHeight: 1.4, overflowWrap: 'anywhere', color: 'var(--accent)' }}>
                      {isHi ? factor.valueHi : factor.valueEn}
                    </div>
                    <div style={{ fontSize: '12px', lineHeight: 1.5, marginTop: '6px' }}>
                      {isHi ? factor.interpretationHi : factor.interpretationEn}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* TAB 5: ALL 20 FACTORS OVERVIEW GRID */}
        {birthProfileTab === 'grid' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '8px' }}>
            {report.birthProfile.factors.map((factor) => (
              <div key={factor.id} style={{ padding: '9px 11px', borderRadius: '7px', background: 'var(--bg-subtle)', minWidth: 0 }}>
                <div className="muted" style={{ fontSize: '11px', marginBottom: '3px' }}>
                  {isHi ? factor.labelHi : factor.labelEn}
                </div>
                <div style={{ fontSize: '13px', fontWeight: 650, lineHeight: 1.4, overflowWrap: 'anywhere' }}>
                  {isHi ? factor.valueHi : factor.valueEn}
                </div>
                <div style={{ fontSize: '12px', lineHeight: 1.5, marginTop: '6px' }}>
                  {isHi ? factor.interpretationHi : factor.interpretationEn}
                </div>
              </div>
            ))}
          </div>
        )}

        <p className="muted small-text" style={{ margin: '14px 0 0', lineHeight: 1.5 }}>
          {isHi
            ? 'पद्धति नोट: मास अमान्त गणना पर आधारित है; अधिक मास सौर-चांद्र सामंजस्य का प्रतीक है; नवांश लग्न फल पृथु यशस् (होरासार) के शास्त्रीय सूत्रों के अनुरूप है। इष्ट देव जैमिनी कारकांश (D9) के १२वें भाव से निकाला गया संकेत है।'
            : 'Method note: Maas uses the classical Amanta convention; Adhika Maas balances solar and lunar cycles; Navamsha Lagna dictums follow Prithu Yasas (Horasara). Ishta Devata is derived from the 12th from Karakamsha in D9.'}
        </p>
      </div>

      {/* Domain Quick Dropdown Selector */}
      <div className="card" style={{ padding: '10px 14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontWeight: 600, fontSize: '13px' }}>
              {isHi ? 'जीवन क्षेत्र चुनें (Select Domain):' : 'Select Life Domain:'}
            </span>
            <select
              aria-label="Select Domain"
              className="select-compact"
              value={selectedDomainId}
              onChange={(e) => setSelectedDomainId(e.target.value)}
              style={{ minWidth: '240px', fontWeight: 600 }}
            >
              <option value="all">{isHi ? 'सभी 6 जीवन क्षेत्र (View All)' : 'All 6 Life Spheres'}</option>
              {report.domains.map((d) => (
                <option key={d.id} value={d.id}>
                  {isHi ? d.titleHi : d.titleEn}
                </option>
              ))}
            </select>
          </div>

          <div className="muted small-text">
            {isHi
              ? 'प्रत्येक क्षेत्र में स्पष्ट फलादेश, अनुकूल संकेत, चुनौतियां एवं शास्त्रीय परामर्श दिए गए हैं। दशा और गोचर का समय-फल उनके अलग अनुभागों में है।'
              : 'Each sphere shows a clear reading, supporting factors, cautions and practical guidance. Dasha and transit timing are shown in their own sections.'}
          </div>
        </div>
      </div>

      {/* Render Domains */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {filteredDomains.map((domain) => (
          <div key={domain.id} className="card" style={{ padding: '16px' }}>
            {/* Domain Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', marginBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ color: 'var(--accent)', display: 'flex' }}>
                  {domainIcons[domain.id] || <Sparkles size={16} />}
                </span>
                <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700 }}>
                  {isHi ? domain.titleHi : domain.titleEn}
                </h3>
              </div>

              <span className="badge badge-subtle">
                {isHi ? 'संकेतात्मक विश्लेषण' : 'Indicative analysis'}
              </span>
            </div>

            <div style={{ padding: '10px 12px', background: 'var(--accent-soft)', borderRadius: '8px', marginBottom: '12px', fontSize: '13.5px', lineHeight: 1.55 }}>
              <strong>{isHi ? 'फलादेश: ' : 'Prediction: '}</strong>
              {isHi ? domain.predictionHi : domain.predictionEn}
            </div>

            {/* Active Timing Window & Concrete Event Milestones */}
            {(domain.timingWindowHi || domain.timingWindowEn) && (
              <div
                style={{
                  padding: '10px 14px',
                  background: 'rgba(217, 119, 6, 0.08)',
                  borderLeft: '4px solid #d97706',
                  borderRadius: '6px',
                  marginBottom: '12px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#b45309', fontWeight: 700, fontSize: '13px', marginBottom: '6px', flexWrap: 'wrap' }}>
                  <Clock size={14} />
                  <span>{isHi ? 'सक्रिय फलन समय-सीमा (Timing Window):' : 'Active Manifestation Window:'}</span>
                  <span style={{ color: 'var(--text)', fontWeight: 600 }}>{isHi ? domain.timingWindowHi : domain.timingWindowEn}</span>
                </div>
                {((isHi ? domain.concreteEventsHi : domain.concreteEventsEn) || []).length > 0 && (
                  <div>
                    <div style={{ fontWeight: 650, fontSize: '12.5px', marginBottom: '4px' }}>
                      {isHi ? 'ठोस संभावित जीवन घटनाएं (Concrete Predicted Events):' : 'Concrete Manifesting Events:'}
                    </div>
                    <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '12.5px', lineHeight: 1.5 }}>
                      {((isHi ? domain.concreteEventsHi : domain.concreteEventsEn) || []).map((ev, evIdx) => (
                        <li key={evIdx} style={{ marginBottom: '3px' }}>{ev}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* In-depth Detailed Narrative */}
            <p style={{ margin: '0 0 14px', fontSize: '13.5px', lineHeight: 1.55 }}>
              {isHi ? domain.summaryHi : domain.summaryEn}
            </p>

            {/* Strengths & Watchouts Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px', marginBottom: '14px' }}>
              {/* Key Strengths */}
              <div style={{ padding: '10px 12px', background: 'var(--good-soft)', borderRadius: '8px', border: '1px solid rgba(21, 128, 61, 0.2)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--good)', fontWeight: 700, fontSize: '12.5px', marginBottom: '6px' }}>
                  <CheckCircle size={14} />
                  <span>{isHi ? 'सकारात्मक पक्ष व अनुकूल प्रभाव' : 'Key Auspicious Strengths'}</span>
                </div>
                <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '12.5px', lineHeight: 1.5 }}>
                  {(isHi ? domain.keyStrengthsHi : domain.keyStrengthsEn).map((st, sIdx) => (
                    <li key={sIdx}>{st}</li>
                  ))}
                </ul>
              </div>

              {/* Watchouts & Caution */}
              <div style={{ padding: '10px 12px', background: 'var(--warn-soft)', borderRadius: '8px', border: '1px solid rgba(180, 83, 9, 0.2)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--warn)', fontWeight: 700, fontSize: '12.5px', marginBottom: '6px' }}>
                  <Shield size={14} />
                  <span>{isHi ? 'सावधानियां एवं चुनौतियां' : 'Areas Requiring Caution'}</span>
                </div>
                <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '12.5px', lineHeight: 1.5 }}>
                  {(isHi ? domain.watchoutsHi : domain.watchoutsEn).map((wo, wIdx) => (
                    <li key={wIdx}>{wo}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Practical Guidance */}
            <div style={{ padding: '8px 12px', background: 'var(--accent-soft)', borderRadius: '6px', fontSize: '12.5px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={14} style={{ color: 'var(--accent)', flexShrink: 0 }} />
              <div>
                <strong>{isHi ? 'शास्त्रीय परामर्श व उपाय: ' : 'Classical Guidance & Remedy: '}</strong>
                <span>{isHi ? domain.classicalAdviceHi : domain.classicalAdviceEn}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
