import React, { useState } from 'react';
import {
  Award,
  BookOpen,
  Calendar,
  Compass,
  FileText,
  Flame,
  Heart,
  HelpCircle,
  Layers,
  MapPin,
  Shield,
  ShieldAlert,
  Sparkles,
  Star,
  Sun,
  User,
  Zap,
} from 'lucide-react';
import { SIGNS } from '../../astro/constants';
import {
  ASCENDANT_MASTER_DATA,
  generateAscendantPrediction,
} from '../../astro/predictions/ascendantWise';
import type { ChartData } from '../../astro/types';
import { useLanguage } from '../../i18n/LanguageContext';

interface AscendantWisePanelProps {
  chart: ChartData;
}

export const AscendantWisePanel: React.FC<AscendantWisePanelProps> = ({ chart }) => {
  const { lang } = useLanguage();
  const isHi = lang === 'hi';

  const nativeLagnaIndex = chart.ascendant.signIndex;
  const [selectedLagna, setSelectedLagna] = useState<number>(nativeLagnaIndex);

  const prediction = generateAscendantPrediction(chart, selectedLagna);
  const profile = prediction.profile;
  const isNative = selectedLagna === nativeLagnaIndex;

  return (
    <div className="view-stack" style={{ gap: '18px' }}>
      {/* Lagna Selector Pill Strip (All 12 Ascendants) */}
      <div
        className="card"
        style={{
          padding: '12px 16px',
          background: 'var(--bg-card, #ffffff)',
          border: '1px solid var(--border-color, rgba(0, 0, 0, 0.08))',
          borderRadius: '12px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text)' }}>
              {isHi ? '१२ लग्न विस्तृत शास्त्रीय फलादेश' : '12 Ascendant Classical Predictions'}
            </h3>
            <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              {isHi
                ? `आपकी जन्म कुंडली का उदित लग्न: ${SIGNS[nativeLagnaIndex].name} है। आप किसी भी लग्न का विस्तृत फलादेश देख सकते हैं:`
                : `Your Natal Rising Ascendant is ${SIGNS[nativeLagnaIndex].name}. Select any ascendant to inspect:`}
            </p>
          </div>
          {isNative && (
            <span
              style={{
                padding: '4px 12px',
                borderRadius: '9999px',
                background: '#059669',
                color: '#ffffff',
                fontSize: '0.82rem',
                fontWeight: 700,
              }}
            >
              {isHi ? 'आपका जन्म लग्न' : 'Your Natal Lagna'}
            </span>
          )}
        </div>

        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
          {Array.from({ length: 12 }, (_, i) => {
            const isCurrent = i === selectedLagna;
            const isUserLagna = i === nativeLagnaIndex;
            return (
              <button
                key={i}
                type="button"
                className={`btn btn-sm ${isCurrent ? 'btn-primary' : 'btn-secondary'}`}
                style={{
                  whiteSpace: 'nowrap',
                  fontWeight: isCurrent ? 800 : 600,
                  border: isUserLagna ? '2px solid #b45309' : undefined,
                }}
                onClick={() => setSelectedLagna(i)}
              >
                <span>{isHi ? SIGNS[i].name : SIGNS[i].name}</span>
                {isUserLagna && (
                  <span style={{ marginLeft: '4px', fontSize: '0.75rem', opacity: 0.9 }}>
                    ({isHi ? 'जन्म' : 'Natal'})
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Hero Banner for Selected Ascendant */}
      <div
        className="card"
        style={{
          padding: '22px 24px',
          background: 'linear-gradient(135deg, rgba(217, 119, 6, 0.08) 0%, rgba(180, 83, 9, 0.03) 100%)',
          border: '1px solid rgba(217, 119, 6, 0.28)',
          borderRadius: '14px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '14px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#b45309', textTransform: 'uppercase' }}>
                {isHi ? profile.elementHi : profile.elementEn}
              </span>
              <span style={{ color: 'var(--text-muted)' }}>·</span>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                {isHi ? `स्वामी: ${profile.lordHi}` : `Ruler: ${profile.lordEn}`}
              </span>
              <span style={{ color: 'var(--text-muted)' }}>·</span>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                {isHi ? `प्रतीक: ${profile.symbolHi}` : `Symbol: ${profile.symbolEn}`}
              </span>
            </div>
            <h2 style={{ margin: 0, fontSize: '1.45rem', color: '#b45309' }}>
              {isHi ? profile.nameHi : profile.nameEn}
            </h2>
          </div>

          {isNative && (
            <div style={{ textAlign: 'right', background: 'var(--bg-card, #ffffff)', padding: '10px 16px', borderRadius: '10px', border: '1px solid rgba(0,0,0,0.08)' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {isHi ? 'लग्न स्फुट (Degree):' : 'Lagna Longitude:'}
              </span>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text)' }}>
                {chart.ascendant.dms}
              </div>
            </div>
          )}
        </div>

        {/* Natal Specific Synthesis for Native */}
        {isNative && (
          <div
            style={{
              marginTop: '16px',
              padding: '14px 18px',
              borderRadius: '10px',
              background: 'var(--bg-card, #ffffff)',
              borderLeft: '4px solid #b45309',
            }}
          >
            <h4 style={{ margin: '0 0 6px', color: '#b45309', fontSize: '0.96rem' }}>
              {isHi ? 'आपकी जन्म कुंडली का लग्न व लग्नेश विश्लेषण:' : 'Natal Ascendant & Lord Real Synthesis:'}
            </h4>
            <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: 1.55, color: 'var(--text)' }}>
              {isHi ? prediction.natalSynthesisHi : prediction.natalSynthesisEn}
            </p>
          </div>
        )}
      </div>

      {/* 2-Column Grid of In-Depth Astrological Pillars */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '16px' }}>
        {/* Pillar 1: Temperament & Personality */}
        <div className="card" style={{ padding: '18px', borderRadius: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <User size={18} color="#b45309" />
            <h3 style={{ margin: 0, fontSize: '1.05rem', color: 'var(--text)' }}>
              {isHi ? '१. लग्न स्वरूप एवं मनोवृत्ति' : '1. Stature & Temperament'}
            </h3>
          </div>
          <p style={{ margin: 0, fontSize: '0.88rem', lineHeight: 1.6, color: 'var(--text)' }}>
            {isHi ? profile.personalityHi : profile.personalityEn}
          </p>
        </div>

        {/* Pillar 2: Functional Lordship (Benefics, Marakas, Badhakas) */}
        <div className="card" style={{ padding: '18px', borderRadius: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Shield size={18} color="#059669" />
            <h3 style={{ margin: 0, fontSize: '1.05rem', color: 'var(--text)' }}>
              {isHi ? '२. कारक, मारक एवं बाधक ग्रह' : '2. Functional Lordship & Marakas'}
            </h3>
          </div>
          <div style={{ fontSize: '0.88rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div>
              <strong style={{ color: '#065f46' }}>{isHi ? 'शुभ व योगकारक ग्रह:' : 'Benefics & Yogakarakas:'}</strong>{' '}
              {isHi ? profile.functionalBeneficsHi : profile.functionalBeneficsEn}
            </div>
            <div>
              <strong style={{ color: '#991b1b' }}>{isHi ? 'मारक व प्रतिकूल ग्रह:' : 'Marakas & Malefics:'}</strong>{' '}
              {isHi ? profile.functionalMaleficsHi : profile.functionalMaleficsEn}
            </div>
            <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
              <strong>{isHi ? 'बाधक स्थान निर्णय:' : 'Badhaka Sthana:'}</strong>{' '}
              {isHi ? profile.badhakaInfoHi : profile.badhakaInfoEn}
            </div>
          </div>
        </div>

        {/* Pillar 3: Dhana & Prosperity */}
        <div className="card" style={{ padding: '18px', borderRadius: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Sparkles size={18} color="#d97706" />
            <h3 style={{ margin: 0, fontSize: '1.05rem', color: 'var(--text)' }}>
              {isHi ? '३. धन, कुटुंब एवं आर्थिक उत्कर्ष काल' : '3. Wealth & Financial Peaks'}
            </h3>
          </div>
          <p style={{ margin: 0, fontSize: '0.88rem', lineHeight: 1.6, color: 'var(--text)' }}>
            {isHi ? profile.dhanaAndProsperityHi : profile.dhanaAndProsperityEn}
          </p>
        </div>

        {/* Pillar 4: Marriage & Spouse Nature */}
        <div className="card" style={{ padding: '18px', borderRadius: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Heart size={18} color="#db2777" />
            <h3 style={{ margin: 0, fontSize: '1.05rem', color: 'var(--text)' }}>
              {isHi ? '४. दांपत्य जीवन एवं जीवनसाथी का स्वरूप' : '4. Marriage & Spousal Dynamics'}
            </h3>
          </div>
          <p style={{ margin: 0, fontSize: '0.88rem', lineHeight: 1.6, color: 'var(--text)' }}>
            {isHi ? profile.marriageAndSpouseHi : profile.marriageAndSpouseEn}
          </p>
        </div>

        {/* Pillar 5: Career & Optimal Professions */}
        <div className="card" style={{ padding: '18px', borderRadius: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Award size={18} color="#2563eb" />
            <h3 style={{ margin: 0, fontSize: '1.05rem', color: 'var(--text)' }}>
              {isHi ? '५. करियर एवं सर्वश्रेष्ठ आजीविका क्षेत्र' : '5. Optimal Career Paths'}
            </h3>
          </div>
          <p style={{ margin: 0, fontSize: '0.88rem', lineHeight: 1.6, color: 'var(--text)' }}>
            {isHi ? profile.careerAndProfessionHi : profile.careerAndProfessionEn}
          </p>
        </div>

        {/* Pillar 6: Health & Milestone Ages */}
        <div className="card" style={{ padding: '18px', borderRadius: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Calendar size={18} color="#7c3aed" />
            <h3 style={{ margin: 0, fontSize: '1.05rem', color: 'var(--text)' }}>
              {isHi ? '६. स्वास्थ्य एवं प्रमुख भाग्योदय वर्ष' : '6. Health & Milestone Ages'}
            </h3>
          </div>
          <p style={{ margin: '0 0 10px', fontSize: '0.88rem', lineHeight: 1.6, color: 'var(--text)' }}>
            {isHi ? profile.healthAndMilestonesHi : profile.healthAndMilestonesEn}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)' }}>
              {isHi ? 'स्वर्ण भाग्योदय वर्ष:' : 'Milestone Ages:'}
            </span>
            {profile.milestoneAges.map((age) => (
              <span
                key={age}
                style={{
                  padding: '2px 8px',
                  borderRadius: '6px',
                  background: 'rgba(124, 58, 237, 0.1)',
                  color: '#7c3aed',
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  border: '1px solid rgba(124, 58, 237, 0.25)',
                }}
              >
                {age} {isHi ? 'वर्ष' : 'Yrs'}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Remedies & Deity Banner */}
      <div
        className="card"
        style={{
          padding: '18px 22px',
          borderRadius: '12px',
          background: 'rgba(5, 150, 105, 0.06)',
          borderLeft: '5px solid #059669',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <Sun size={18} color="#059669" />
          <h3 style={{ margin: 0, fontSize: '1.05rem', color: '#065f46' }}>
            {isHi ? '७. इष्टदेव, रत्न एवं वैदिक लग्न शुद्धि उपाय' : '7. Ishta Devata, Gemstones & Remedies'}
          </h3>
        </div>
        <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: 1.55, color: 'var(--text)' }}>
          {isHi ? profile.remediesAndDeityHi : profile.remediesAndDeityEn}
        </p>
      </div>
    </div>
  );
};
