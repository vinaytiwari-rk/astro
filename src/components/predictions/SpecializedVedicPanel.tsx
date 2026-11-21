import React, { useMemo, useState } from 'react';
import {
  Award,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  Compass,
  Crown,
  Flame,
  Heart,
  HelpCircle,
  Layers,
  Moon,
  Shield,
  Sparkles,
  Sun,
  Target,
  Zap,
} from 'lucide-react';
import {
  computeIshtaDevata,
  computeKujaDoshaAnalysis,
  computePanchaPakshi,
  computeTarabalamChandrabalam,
  computeVakriPlanetsAnalysis,
  type IshtaDevataReport,
  type KujaDoshaReport,
  type PanchaPakshiReport,
  type TarabalamReport,
  type VakriPlanetsReport,
} from '../../astro/predictions/specializedVedicEngines';
import { formatDateDmy } from '../../astro/time';
import type { ChartData } from '../../astro/types';
import { useLanguage } from '../../i18n/LanguageContext';
import { DateDmyInput } from '../DateDmyInput';

export interface SpecializedVedicPanelProps {
  chart: ChartData;
}

type TabKey = 'ishta' | 'vakri' | 'tarabalam' | 'panchaPakshi' | 'kujaDosha';

export const SpecializedVedicPanel: React.FC<SpecializedVedicPanelProps> = ({ chart }) => {
  const { lang } = useLanguage();
  const isHi = lang === 'hi';

  const [activeTab, setActiveTab] = useState<TabKey>('ishta');
  const [targetDate, setTargetDate] = useState<string>(() => new Date().toISOString().slice(0, 10));

  // Compute reports from engines
  const ishtaReport: IshtaDevataReport = useMemo(() => computeIshtaDevata(chart), [chart]);
  const vakriReport: VakriPlanetsReport = useMemo(() => computeVakriPlanetsAnalysis(chart), [chart]);
  const tarabalamReport: TarabalamReport = useMemo(
    () => computeTarabalamChandrabalam(chart),
    [chart, targetDate]
  );
  const panchaPakshiReport: PanchaPakshiReport = useMemo(() => computePanchaPakshi(chart), [chart]);
  const kujaReport: KujaDoshaReport = useMemo(() => computeKujaDoshaAnalysis(chart), [chart]);

  return (
    <div className="view-stack">
      {/* 1. Master Software Banner */}
      <div
        className="card"
        style={{
          borderLeft: '4px solid #d97706',
          background: 'var(--bg-elevated)',
          padding: '16px 20px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span className="badge" style={{ background: 'rgba(217, 119, 6, 0.15)', color: '#d97706', fontWeight: 700, fontSize: '11px' }}>
                {isHi ? 'विशिष्ट शास्त्रीय फलित संहिता' : 'Specialized Classical Vedic Predictive Engines'}
              </span>
            </div>
            <h2 style={{ margin: 0, fontSize: '19px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={20} style={{ color: '#d97706' }} />
              <span>
                {isHi
                  ? 'इष्ट देव, वक्री ग्रह, ताराबल, पंच पक्षी एवं कुज दोष'
                  : 'Ishta Devata, Vakri Planets, Tarabalam, Pancha Pakshi & Kuja Dosha'}
              </span>
            </h2>
            <p className="muted" style={{ margin: '4px 0 0', fontSize: '13px' }}>
              {isHi
                ? 'महर्षि जैमिनी कारकांश, वक्री चेष्टा बल, दैनिक ताराबल-चंद्रबल मीटर, पंच पक्षी बायो-रिदम एवं २० शास्त्रीय मांगलिक परिहार।'
                : 'Jaimini Karakamsha 12th house, Retrograde Cheshta Bala, Daily Tarabalam & Chandrabalam, Pancha Pakshi bio-rhythms, and 20 Kuja Dosha exceptions.'}
            </p>
          </div>

          <div
            style={{
              padding: '6px 12px',
              borderRadius: '6px',
              background: 'var(--bg-subtle)',
              border: '1px solid var(--border)',
              fontSize: '12px',
            }}
          >
            <span className="muted">{isHi ? 'सक्रिय जातक: ' : 'Active Native: '}</span>
            <strong>{chart.input.name}</strong>
          </div>
        </div>

        {/* Quick Glance Metric Badges */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '10px',
            marginTop: '16px',
            paddingTop: '12px',
            borderTop: '1px solid var(--border)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Crown size={16} style={{ color: '#d97706' }} />
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{isHi ? 'इष्ट देव' : 'Ishta Devata'}</div>
              <div style={{ fontSize: '12.5px', fontWeight: 700 }}>
                {isHi ? ishtaReport.ishtaDevataNameHi.split('/')[0] : ishtaReport.ishtaDevataNameEn.split('/')[0]}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Zap size={16} style={{ color: '#3b82f6' }} />
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{isHi ? 'वक्री ग्रह संख्या' : 'Retrograde (Vakri)'}</div>
              <div style={{ fontSize: '12.5px', fontWeight: 700 }}>
                {vakriReport.retrogradeCount > 0
                  ? `${vakriReport.retrogradeCount} ${isHi ? 'ग्रह वक्री' : 'Planets Vakri'}`
                  : isHi ? 'सभी ग्रह मार्गी' : 'All Direct'}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Target size={16} style={{ color: '#10b981' }} />
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{isHi ? 'दैनिक ताराबल' : 'Daily Tarabalam'}</div>
              <div style={{ fontSize: '12.5px', fontWeight: 700 }}>
                {tarabalamReport.currentTaraNameEn} ({tarabalamReport.dailyEnergyScore}%)
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Compass size={16} style={{ color: '#8b5cf6' }} />
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{isHi ? 'पंच पक्षी' : 'Pancha Pakshi'}</div>
              <div style={{ fontSize: '12.5px', fontWeight: 700 }}>
                {isHi ? panchaPakshiReport.birdNameHi : panchaPakshiReport.birdNameEn} ({panchaPakshiReport.currentAvastha.stateEn})
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Shield size={16} style={{ color: kujaReport.isCancelled || !kujaReport.hasPotentialDosha ? '#10b981' : '#ef4444' }} />
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{isHi ? 'कुज दोष (मांगलिक)' : 'Kuja (Manglik) Dosha'}</div>
              <div style={{ fontSize: '12.5px', fontWeight: 700, color: kujaReport.isCancelled || !kujaReport.hasPotentialDosha ? '#10b981' : '#ef4444' }}>
                {kujaReport.isCancelled
                  ? (isHi ? '१००% परिहार (दोष भंग)' : '100% Cancelled')
                  : kujaReport.hasPotentialDosha
                  ? (isHi ? 'सक्रिय दोष' : 'Active Dosha')
                  : (isHi ? 'दोष मुक्त' : 'Dosha Free')}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Sub-Navigation Tabs */}
      <div
        className="card"
        style={{
          padding: '8px 12px',
          background: 'var(--bg-elevated)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          flexWrap: 'wrap',
        }}
      >
        <button
          type="button"
          onClick={() => setActiveTab('ishta')}
          className={`btn btn-sm ${activeTab === 'ishta' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ fontWeight: activeTab === 'ishta' ? 700 : 500, fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <Crown size={14} />
          {isHi ? 'इष्ट देव एवं कुलदेवता' : 'Ishta Devata & Upasana'}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('vakri')}
          className={`btn btn-sm ${activeTab === 'vakri' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ fontWeight: activeTab === 'vakri' ? 700 : 500, fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <Zap size={14} />
          {isHi ? 'वक्री ग्रह एवं चेष्टा बल' : 'Vakri Grah (Retrograde)'}
          {vakriReport.retrogradeCount > 0 && (
            <span className="badge" style={{ background: '#3b82f6', color: '#fff', fontSize: '10px', padding: '1px 5px' }}>
              {vakriReport.retrogradeCount}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('tarabalam')}
          className={`btn btn-sm ${activeTab === 'tarabalam' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ fontWeight: activeTab === 'tarabalam' ? 700 : 500, fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <Target size={14} />
          {isHi ? 'दैनिक ताराबल एवं चंद्रबल' : 'Tarabalam & Chandrabalam'}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('panchaPakshi')}
          className={`btn btn-sm ${activeTab === 'panchaPakshi' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ fontWeight: activeTab === 'panchaPakshi' ? 700 : 500, fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <Compass size={14} />
          {isHi ? 'पंच पक्षी शास्त्र' : 'Pancha Pakshi Shastra'}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('kujaDosha')}
          className={`btn btn-sm ${activeTab === 'kujaDosha' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ fontWeight: activeTab === 'kujaDosha' ? 700 : 500, fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <Shield size={14} />
          {isHi ? '२० कुज दोष परिहार' : '20 Kuja Dosha Exceptions'}
        </button>
      </div>

      {/* 3. TAB 1: ISHTA DEVATA & KULA DEVATA UPASANA */}
      {activeTab === 'ishta' && (
        <div className="view-stack">
          {/* Explanation Banner */}
          <div className="card" style={{ background: 'var(--bg-subtle)', padding: '14px 18px', borderLeft: '3px solid #d97706' }}>
            <h4 style={{ margin: '0 0 6px', fontSize: '14px', fontWeight: 700, color: '#d97706', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <BookOpen size={16} />
              {isHi ? 'महर्षि जैमिनी उपदेश सूत्र: कारकांश लग्न एवं जीवन्मुक्तांश' : 'Maharishi Jaimini Upadesha Sutras: Karakamsha & Jivanmuktamsa'}
            </h4>
            <p style={{ margin: 0, fontSize: '13px', lineHeight: 1.5, color: 'var(--text)' }}>
              {isHi ? ishtaReport.spiritualSignificanceHi : ishtaReport.spiritualSignificanceEn}
            </p>
          </div>

          {/* Technical Placements Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '12px',
            }}
          >
            <div className="card" style={{ padding: '12px 16px' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                {isHi ? 'आत्मकारक ग्रह (AK)' : 'Atmakaraka Planet (AK)'}
              </div>
              <div style={{ fontSize: '17px', fontWeight: 700, color: '#d97706', marginTop: '2px' }}>
                {isHi ? ishtaReport.atmakarakaNameHi : ishtaReport.atmakarakaNameEn}
              </div>
              <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '2px' }}>
                {isHi ? 'कुंडली में सर्वोच्च अंशों पर स्थित ग्रह' : 'Highest degree physical planet'}
              </div>
            </div>

            <div className="card" style={{ padding: '12px 16px' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                {isHi ? 'कारकांश लग्न (नवांश D9)' : 'Karakamsha Sign (D9)'}
              </div>
              <div style={{ fontSize: '17px', fontWeight: 700, color: 'var(--accent)', marginTop: '2px' }}>
                {isHi ? ishtaReport.karakamshaSignHi : ishtaReport.karakamshaSignEn}
              </div>
              <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '2px' }}>
                {isHi ? 'D9 नवांश में आत्मकारक की राशि' : 'Navamsha placement of AK'}
              </div>
            </div>

            <div className="card" style={{ padding: '12px 16px' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                {isHi ? '१२वां भाव (जीवन्मुक्तांश)' : '12th from Karakamsha'}
              </div>
              <div style={{ fontSize: '17px', fontWeight: 700, color: '#8b5cf6', marginTop: '2px' }}>
                {isHi ? ishtaReport.twelfthHouseSignHi : ishtaReport.twelfthHouseSignEn}
              </div>
              <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '2px' }}>
                {isHi ? 'मोक्ष एवं साधना का द्वार' : 'Spiritual liberation gateway'}
              </div>
            </div>

            <div className="card" style={{ padding: '12px 16px' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                {isHi ? 'इष्ट देव अधिष्ठाता ग्रह' : 'Ruling Deity Planet'}
              </div>
              <div style={{ fontSize: '17px', fontWeight: 700, color: '#10b981', marginTop: '2px' }}>
                {isHi ? ishtaReport.rulingPlanetHi : ishtaReport.rulingPlanetEn}
              </div>
              <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '2px' }}>
                {isHi ? '१२वें भाव का अधिपति/स्थित ग्रह' : '12th house occupant/lord in D9'}
              </div>
            </div>
          </div>

          {/* Deity Card with Sacred Mantra */}
          <div
            className="card"
            style={{
              padding: '20px',
              background: 'linear-gradient(135deg, rgba(217, 119, 6, 0.08) 0%, rgba(245, 158, 11, 0.03) 100%)',
              border: '1.5px solid rgba(217, 119, 6, 0.3)',
              borderRadius: '10px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Crown size={24} style={{ color: '#d97706' }} />
                <div>
                  <div style={{ fontSize: '11px', color: '#d97706', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    {isHi ? 'परम पूज्य इष्ट देव' : 'Supreme Ishta Devata'}
                  </div>
                  <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 700 }}>
                    {isHi ? ishtaReport.ishtaDevataNameHi : ishtaReport.ishtaDevataNameEn}
                  </h3>
                </div>
              </div>
              <span className="badge" style={{ background: '#d97706', color: '#fff', fontWeight: 700, fontSize: '12px', padding: '4px 10px' }}>
                {isHi ? 'मोक्ष प्रदायक' : 'Soul Liberator'}
              </span>
            </div>

            {/* Sacred Mantra Box */}
            <div
              style={{
                padding: '16px',
                borderRadius: '8px',
                background: 'var(--bg-elevated)',
                border: '1px solid rgba(217, 119, 6, 0.4)',
                textAlign: 'center',
                margin: '12px 0',
              }}
            >
              <div style={{ fontSize: '11.5px', color: '#d97706', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>
                {isHi ? 'शास्त्रीय वैदिक / पौराणिक सिद्ध मंत्र' : 'Sacred Vedic & Puranic Siddha Mantra'}
              </div>
              <div style={{ fontSize: '18px', fontWeight: 700, letterSpacing: '0.8px', color: 'var(--text)', fontFamily: 'serif' }}>
                {ishtaReport.sacredMantra}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '6px' }}>
                {isHi ? 'नित्य प्रातःकाल १०८ बार जप करने से सभी प्रारब्ध दोष शांत होते हैं।' : 'Chanting 108 times at dawn pacifies past karmic debts and secures divine grace.'}
              </div>
            </div>

            {/* Upasana Guidance */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px', marginTop: '14px' }}>
              <div style={{ padding: '12px', borderRadius: '6px', background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
                <strong style={{ fontSize: '13px', display: 'block', marginBottom: '4px', color: '#d97706' }}>
                  {isHi ? 'साधना एवं पूजा विधि:' : 'Prescribed Upasana Method:'}
                </strong>
                <p style={{ margin: 0, fontSize: '12.5px', lineHeight: 1.5 }}>
                  {isHi ? ishtaReport.upasanaMethodHi : ishtaReport.upasanaMethodEn}
                </p>
              </div>

              <div style={{ padding: '12px', borderRadius: '6px', background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
                <strong style={{ fontSize: '13px', display: 'block', marginBottom: '4px', color: '#8b5cf6' }}>
                  {isHi ? 'कुल परम्परा एवं कुलदेवता:' : 'Kula Devata & Lineage Guardian:'}
                </strong>
                <p style={{ margin: 0, fontSize: '12.5px', lineHeight: 1.5 }}>
                  {isHi ? ishtaReport.kulaDevataHi : ishtaReport.kulaDevataEn}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. TAB 2: VAKRI GRAH CHESHTA BALA & PAST LIFE KARMA */}
      {activeTab === 'vakri' && (
        <div className="view-stack">
          {/* Summary Box */}
          <div className="card" style={{ background: 'var(--bg-subtle)', padding: '14px 18px', borderLeft: '3px solid #3b82f6' }}>
            <h4 style={{ margin: '0 0 6px', fontSize: '14px', fontWeight: 700, color: '#3b82f6', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <BookOpen size={16} />
              {isHi ? 'शास्त्रीय फलदीपिका एवं सारावली: वक्री ग्रह चेष्टा बल सिद्धांत' : 'Classical Saravali & Phaladeepika: Retrograde Cheshta Bala Doctrine'}
            </h4>
            <p style={{ margin: 0, fontSize: '13px', lineHeight: 1.5, color: 'var(--text)' }}>
              {isHi ? vakriReport.overallSummaryHi : vakriReport.overallSummaryEn}
            </p>
          </div>

          {/* Retrograde Planets Cards */}
          {vakriReport.planets.length === 0 ? (
            <div className="card" style={{ padding: '30px', textAlign: 'center' }}>
              <CheckCircle2 size={36} style={{ color: '#10b981', margin: '0 auto 10px' }} />
              <h3 style={{ margin: '0 0 6px', fontSize: '16px', fontWeight: 700 }}>
                {isHi ? 'कोई भी प्रमुख ग्रह वक्री नहीं है' : 'No Major Planets in Retrograde Motion'}
              </h3>
              <p className="muted" style={{ margin: 0, fontSize: '13px' }}>
                {isHi
                  ? 'आपकी कुंडली में सूर्य, चंद्र, मंगल, बुध, गुरु, शुक्र और शनि सभी मार्गी हैं। कर्म का फल प्रत्यक्ष रूप से प्राप्त होता है।'
                  : 'All physical planets move direct. Your karmic lessons manifest directly without heavy backward pull or past-life stalls.'}
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {vakriReport.planets.map((planet) => (
                <div
                  key={planet.id}
                  className="card"
                  style={{
                    padding: '16px 20px',
                    borderLeft: '4px solid #3b82f6',
                    background: 'var(--bg-elevated)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', marginBottom: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Zap size={18} style={{ color: '#3b82f6' }} />
                      <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 700 }}>
                        {isHi ? `${planet.nameHi} (वक्री - Retrograde)` : `${planet.nameEn} (Retrograde)`}
                      </h3>
                    </div>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      <span className="badge" style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6', fontWeight: 650 }}>
                        {isHi ? `स्थित भाव: ${planet.currentHouse}वां` : `Placed: House ${planet.currentHouse}`}
                      </span>
                      <span className="badge" style={{ background: 'rgba(139, 92, 246, 0.15)', color: '#8b5cf6', fontWeight: 650 }}>
                        {isHi ? `जाग्रत पिछला भाव: ${planet.priorHouse}वां` : `Activates Prior House: ${planet.priorHouse}`}
                      </span>
                      <span className="badge" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', fontWeight: 650 }}>
                        {planet.cheshtaBalaLevel}
                      </span>
                    </div>
                  </div>

                  {/* 3 Columns: Past Life Karma, Career Trajectory, Upaya */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '12px', marginTop: '10px' }}>
                    <div style={{ padding: '12px', borderRadius: '6px', background: 'var(--bg-subtle)', border: '1px solid var(--border)' }}>
                      <strong style={{ fontSize: '12.5px', color: '#8b5cf6', display: 'block', marginBottom: '4px' }}>
                        {isHi ? 'पूर्व जन्म का संचित कर्म:' : 'Past-Life Unfulfilled Karma:'}
                      </strong>
                      <p style={{ margin: 0, fontSize: '12.5px', lineHeight: 1.5 }}>
                        {isHi ? planet.pastLifeKarmaHi : planet.pastLifeKarmaEn}
                      </p>
                    </div>

                    <div style={{ padding: '12px', borderRadius: '6px', background: 'var(--bg-subtle)', border: '1px solid var(--border)' }}>
                      <strong style={{ fontSize: '12.5px', color: '#3b82f6', display: 'block', marginBottom: '4px' }}>
                        {isHi ? 'कार्यक्षेत्र एवं विलक्षण प्रतिभा:' : 'Career Trajectory & Unconventional Genius:'}
                      </strong>
                      <p style={{ margin: 0, fontSize: '12.5px', lineHeight: 1.5 }}>
                        {isHi ? planet.careerImpactHi : planet.careerImpactEn}
                      </p>
                    </div>

                    <div style={{ padding: '12px', borderRadius: '6px', background: 'var(--bg-subtle)', border: '1px solid var(--border)' }}>
                      <strong style={{ fontSize: '12.5px', color: '#10b981', display: 'block', marginBottom: '4px' }}>
                        {isHi ? 'शास्त्रीय उपाय एवं संतुलन:' : 'Prescribed Remedial Measure:'}
                      </strong>
                      <p style={{ margin: 0, fontSize: '12.5px', lineHeight: 1.5 }}>
                        {isHi ? planet.remedyHi : planet.remedyEn}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 5. TAB 3: DAILY TARABALAM & CHANDRABALAM METER */}
      {activeTab === 'tarabalam' && (
        <div className="view-stack">
          {/* Date Selector Strip */}
          <div
            className="card"
            style={{
              padding: '10px 16px',
              background: 'var(--bg-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '10px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Calendar size={16} className="muted" />
              <span style={{ fontSize: '13px', fontWeight: 600 }}>
                {isHi ? 'दैनिक ऊर्जा आकलन तिथि:' : 'Target Assessment Date:'}
              </span>
              <DateDmyInput
                compact
                className="select-compact mono"
                value={targetDate}
                ariaLabel={isHi ? 'ताराबल तिथि' : 'Tarabalam Date'}
                onChange={setTargetDate}
              />
            </div>

            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              {isHi ? 'जन्म नक्षत्र: ' : 'Birth Nakshatra: '}
              <strong>{tarabalamReport.birthNakshatraNameEn} (#{tarabalamReport.birthNakshatraIndex + 1})</strong>
            </div>
          </div>

          {/* Energy Score Banner */}
          <div
            className="card"
            style={{
              padding: '20px',
              background:
                tarabalamReport.dailyEnergyScore >= 70
                  ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0.02) 100%)'
                  : tarabalamReport.dailyEnergyScore >= 45
                  ? 'linear-gradient(135deg, rgba(217, 119, 6, 0.1) 0%, rgba(217, 119, 6, 0.02) 100%)'
                  : 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(239, 68, 68, 0.02) 100%)',
              border: `1.5px solid ${tarabalamReport.dailyEnergyScore >= 70 ? 'rgba(16, 185, 129, 0.35)' : tarabalamReport.dailyEnergyScore >= 45 ? 'rgba(217, 119, 6, 0.35)' : 'rgba(239, 68, 68, 0.35)'}`,
              borderRadius: '10px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <div style={{ fontSize: '12px', textTransform: 'uppercase', fontWeight: 700, color: tarabalamReport.dailyEnergyScore >= 70 ? '#10b981' : '#d97706' }}>
                  {isHi ? 'दैनिक सिद्धि एवं सफलता मीटर' : 'Daily Tarabalam & Chandrabalam Power Meter'}
                </div>
                <h3 style={{ margin: '4px 0 0', fontSize: '22px', fontWeight: 800 }}>
                  {isHi ? tarabalamReport.currentTaraNameHi : tarabalamReport.currentTaraNameEn} (तारा #{tarabalamReport.currentTaraNumber})
                </h3>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
                  {isHi ? tarabalamReport.taraMeaningHi : tarabalamReport.taraMeaningEn}
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '32px', fontWeight: 800, color: tarabalamReport.dailyEnergyScore >= 70 ? '#10b981' : '#d97706' }}>
                  {tarabalamReport.dailyEnergyScore}%
                </div>
                <span className="badge" style={{ background: tarabalamReport.isAuspicious ? '#10b981' : '#ef4444', color: '#fff', fontWeight: 700 }}>
                  {tarabalamReport.isAuspicious ? (isHi ? 'शुभ एवं कार्यसिद्धि' : 'Auspicious For Action') : (isHi ? 'सतर्कता / शांति आवश्यक' : 'Caution Advised')}
                </span>
              </div>
            </div>

            {/* Actionable Advice Box */}
            <div style={{ marginTop: '14px', padding: '10px 14px', borderRadius: '6px', background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
              <strong>{isHi ? 'आज का शास्त्रीय परामर्श: ' : 'Daily Shastric Guidance: '}</strong>
              <span>{isHi ? tarabalamReport.recommendedActionHi : tarabalamReport.recommendedActionEn}</span>
            </div>
          </div>

          {/* 9 Taras Visual Grid */}
          <div className="card" style={{ padding: '16px' }}>
            <h4 style={{ margin: '0 0 12px', fontSize: '14px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Layers size={16} />
              {isHi ? '९ तारा चक्र एवं फलित क्षमता' : 'The 9 Taras Cosmic Resonance Cycle'}
            </h4>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '8px',
              }}
            >
              {tarabalamReport.all9Taras.map((tara) => (
                <div
                  key={tara.taraNumber}
                  style={{
                    padding: '10px 12px',
                    borderRadius: '6px',
                    background: tara.isActive ? 'rgba(217, 119, 6, 0.12)' : 'var(--bg-subtle)',
                    border: tara.isActive ? '1.5px solid #d97706' : '1px solid var(--border)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>#{tara.taraNumber}</span>
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: 700,
                        color: tara.favorabilityScore >= 70 ? '#10b981' : tara.favorabilityScore >= 45 ? '#d97706' : '#ef4444',
                      }}
                    >
                      {tara.favorabilityScore}%
                    </span>
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: tara.isActive ? '#d97706' : 'var(--text)' }}>
                    {isHi ? tara.nameHi : tara.nameEn}
                    {tara.isActive && (
                      <span className="badge" style={{ marginLeft: '6px', fontSize: '10px', background: '#d97706', color: '#fff' }}>
                        {isHi ? 'आज' : 'Today'}
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                    {isHi ? tara.meaningHi : tara.meaningEn}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 6. TAB 4: PANCHA PAKSHI SHASTRA */}
      {activeTab === 'panchaPakshi' && (
        <div className="view-stack">
          {/* Ruling Bird Profile Card */}
          <div
            className="card"
            style={{
              padding: '20px',
              borderLeft: '4px solid #8b5cf6',
              background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.08) 0%, rgba(139, 92, 246, 0.02) 100%)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Compass size={28} style={{ color: '#8b5cf6' }} />
                <div>
                  <div style={{ fontSize: '11px', color: '#8b5cf6', fontWeight: 700, textTransform: 'uppercase' }}>
                    {isHi ? 'तमिल सिद्ध पंच पक्षी शास्त्र' : 'Tamil Siddha Pancha Pakshi Shastra'}
                  </div>
                  <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 700 }}>
                    {isHi ? `जन्म पक्षी: ${panchaPakshiReport.birdNameHi}` : `Ruling Bird: ${panchaPakshiReport.birdNameEn}`}
                  </h3>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <span className="badge" style={{ background: 'rgba(139, 92, 246, 0.15)', color: '#8b5cf6', fontWeight: 650 }}>
                  {isHi ? `पक्ष: ${panchaPakshiReport.pakshaHi}` : `Paksha: ${panchaPakshiReport.pakshaEn}`}
                </span>
                <span className="badge" style={{ background: '#8b5cf6', color: '#fff', fontWeight: 650 }}>
                  {panchaPakshiReport.currentAvastha.powerPercent}% {isHi ? 'वर्तमान ऊर्जा' : 'Current Potency'}
                </span>
              </div>
            </div>

            <p style={{ margin: '10px 0 0', fontSize: '13px', lineHeight: 1.5, color: 'var(--text)' }}>
              {isHi ? panchaPakshiReport.bioRhythmOverviewHi : panchaPakshiReport.bioRhythmOverviewEn}
            </p>

            {/* Current State Guidance */}
            <div
              style={{
                marginTop: '14px',
                padding: '12px 16px',
                borderRadius: '8px',
                background: 'var(--bg-elevated)',
                border: '1px solid rgba(139, 92, 246, 0.3)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '6px', marginBottom: '4px' }}>
                <strong style={{ fontSize: '13.5px', color: '#8b5cf6' }}>
                  {isHi ? `वर्तमान अवस्था: ${panchaPakshiReport.currentAvastha.stateHi}` : `Active State: ${panchaPakshiReport.currentAvastha.stateEn}`}
                </strong>
                <span style={{ fontSize: '12px', fontWeight: 700 }}>
                  {panchaPakshiReport.currentAvastha.timeWindow}
                </span>
              </div>
              <p style={{ margin: 0, fontSize: '12.5px', lineHeight: 1.5 }}>
                {isHi ? panchaPakshiReport.currentAvastha.guidanceHi : panchaPakshiReport.currentAvastha.guidanceEn}
              </p>
            </div>
          </div>

          {/* 5 Biological Avasthas Table */}
          <div className="card" style={{ padding: '16px' }}>
            <h4 style={{ margin: '0 0 12px', fontSize: '14px', fontWeight: 700 }}>
              {isHi ? '५ अवस्थाओं का दैनिक चक्र एवं सफलता प्रतिशत' : 'The 5 Biological Avasthas & Success Index'}
            </h4>
            <div className="table-scroll">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>{isHi ? 'अवस्था' : 'Avastha'}</th>
                    <th>{isHi ? 'तमिल नाम' : 'Tamil Name'}</th>
                    <th>{isHi ? 'दैनिक समय खंड' : 'Time Arc'}</th>
                    <th>{isHi ? 'सफलता क्षमता' : 'Power Index'}</th>
                    <th>{isHi ? 'शास्त्रीय फलित निर्देश' : 'Classical Guidance'}</th>
                  </tr>
                </thead>
                <tbody>
                  {panchaPakshiReport.schedule.map((item, idx) => (
                    <tr
                      key={idx}
                      style={{
                        background:
                          item.powerPercent >= 80
                            ? 'rgba(16, 185, 129, 0.05)'
                            : item.powerPercent <= 20
                            ? 'rgba(239, 68, 68, 0.05)'
                            : undefined,
                      }}
                    >
                      <td>
                        <strong>{isHi ? item.stateHi : item.stateEn}</strong>
                      </td>
                      <td className="muted">{item.tamilName}</td>
                      <td className="mono">{item.timeWindow}</td>
                      <td>
                        <span
                          className="badge"
                          style={{
                            background:
                              item.powerPercent >= 80
                                ? '#10b981'
                                : item.powerPercent >= 50
                                ? '#d97706'
                                : '#ef4444',
                            color: '#fff',
                            fontWeight: 700,
                          }}
                        >
                          {item.powerPercent}%
                        </span>
                      </td>
                      <td style={{ fontSize: '12px' }}>
                        {isHi ? item.guidanceHi : item.guidanceEn}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 7. TAB 5: 20 CLASSICAL KUJA DOSHA EXCEPTIONS */}
      {activeTab === 'kujaDosha' && (
        <div className="view-stack">
          {/* Master Verdict Banner */}
          <div
            className="card"
            style={{
              padding: '20px',
              borderLeft: `4px solid ${kujaReport.isCancelled || !kujaReport.hasPotentialDosha ? '#10b981' : '#ef4444'}`,
              background: kujaReport.isCancelled || !kujaReport.hasPotentialDosha
                ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(16, 185, 129, 0.02) 100%)'
                : 'linear-gradient(135deg, rgba(239, 68, 68, 0.08) 0%, rgba(239, 68, 68, 0.02) 100%)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Shield size={28} style={{ color: kujaReport.isCancelled || !kujaReport.hasPotentialDosha ? '#10b981' : '#ef4444' }} />
                <div>
                  <div style={{ fontSize: '11px', textTransform: 'uppercase', fontWeight: 700, color: kujaReport.isCancelled || !kujaReport.hasPotentialDosha ? '#10b981' : '#ef4444' }}>
                    {isHi ? 'बृहत्पाराशर होराशास्त्र: कुज दोष एवं परिहार संहिता' : 'Brihat Parashara: Kuja Dosha & Shastric Parihara'}
                  </div>
                  <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 700 }}>
                    {isHi ? kujaReport.finalVerdictHi : kujaReport.finalVerdictEn}
                  </h3>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                <span className="badge" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', fontSize: '12px' }}>
                  {isHi ? `लग्न से: ${kujaReport.marsHouseFromLagna}वां भाव` : `Lagna: H${kujaReport.marsHouseFromLagna}`}
                </span>
                <span className="badge" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', fontSize: '12px' }}>
                  {isHi ? `चंद्र से: ${kujaReport.marsHouseFromMoon}वां भाव` : `Moon: H${kujaReport.marsHouseFromMoon}`}
                </span>
                <span className="badge" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', fontSize: '12px' }}>
                  {isHi ? `शुक्र से: ${kujaReport.marsHouseFromVenus}वां भाव` : `Venus: H${kujaReport.marsHouseFromVenus}`}
                </span>
              </div>
            </div>

            {/* If Cancelled, show active cancellation rules */}
            {kujaReport.isCancelled && (
              <div style={{ marginTop: '16px' }}>
                <h4 style={{ margin: '0 0 8px', fontSize: '13.5px', color: '#10b981', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckCircle2 size={16} />
                  {isHi ? `लागू शास्त्रीय परिहार नियम (${kujaReport.cancellationRuleCount} नियम सक्रिय):` : `Active Classical Cancellation Rules (${kujaReport.cancellationRuleCount} Applied):`}
                </h4>
                <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '13px', lineHeight: 1.6 }}>
                  {(isHi ? kujaReport.cancellationReasonsHi : kujaReport.cancellationReasonsEn).map((reason, idx) => (
                    <li key={idx} style={{ marginBottom: '4px' }}>
                      {reason}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Remedial Guidance */}
          <div className="card" style={{ padding: '16px' }}>
            <h4 style={{ margin: '0 0 10px', fontSize: '14px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Flame size={16} style={{ color: '#d97706' }} />
              {isHi ? 'शास्त्रीय वैदिक शांति एवं वैवाहिक सुरक्षा उपाय' : 'Classical Vedic Shanti & Marital Harmony Pariharas'}
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '10px' }}>
              {(isHi ? kujaReport.remediesHi : kujaReport.remediesEn).map((rem, idx) => (
                <div key={idx} style={{ padding: '12px', borderRadius: '6px', background: 'var(--bg-subtle)', border: '1px solid var(--border)', fontSize: '12.5px', lineHeight: 1.5 }}>
                  <strong>#{idx + 1}. </strong>
                  <span>{rem}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
