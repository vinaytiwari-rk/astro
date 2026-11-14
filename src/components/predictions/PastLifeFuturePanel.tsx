import React from 'react';
import { Compass, Flame, History, Orbit, Sparkles } from 'lucide-react';
import type { PastFutureLifeReport } from '../../astro/predictions/pastFutureLife';
import { useLanguage } from '../../i18n/LanguageContext';

export const PastLifeFuturePanel: React.FC<{ report: PastFutureLifeReport }> = ({ report }) => {
  const { lang } = useLanguage();
  const isHi = lang === 'hi';
  const { pastLife, futureBecoming } = report;

  return (
    <div className="view-stack">
      {/* 1. PAST LIFE READING (PURVA JANMA VIA D60, D12, D20, D9, KETU, H5/H9/H12) */}
      <section className="panel">
        <div className="panel-header">
          <h3>
            <History size={15} />{' '}
            {isHi
              ? 'पूर्व जन्म विश्लेषण — संबंधित वर्ग कुंडलियों (D60 षष्ट्यंश, D12, D20, केतु व पंचम-नवम-द्वादश) पर आधारित'
              : 'Detailed Past Life (Purva Janma) Reading — D60 Shashtiamsa, D12, D20, D9 & D1 Ketu/H5/H9/H12'}
          </h3>
          <span
            className={`tag ${
              pastLife.shashtiamsaNature === 'Benefic' ? 'tag-varg' : 'tag-karaka'
            }`}
          >
            {isHi ? pastLife.shashtiamsaDeityHi : pastLife.shashtiamsaDeityEn}
          </span>
        </div>

        <div className="pred-card-body">
          <div className="gochar-banner is-info">
            <strong>{isHi ? pastLife.headlineHi : pastLife.headlineEn}</strong>
          </div>

          {/* Core Classical Past Life Identity Dossier (8 Concrete Attributes) */}
          <div
            style={{
              marginTop: 12,
              marginBottom: 16,
              background: 'var(--bg-subtle)',
              border: '1px solid var(--border)',
              borderRadius: 8,
              padding: 14,
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                marginBottom: 10,
                borderBottom: '1px solid var(--border)',
                paddingBottom: 6,
              }}
            >
              <History size={16} style={{ color: 'var(--accent)' }} />
              <strong style={{ fontSize: '14px' }}>
                {isHi
                  ? 'शास्त्रीय पूर्व जन्म परिचय (लिंग, योनि, जन्म स्थान, व्यवसाय, चरित्र, दांपत्य, संतान व निर्वाण)'
                  : 'Classical Past Life Identity Dossier (Gender, Life Type, Birthplace, Profession, Character, Marriage, Children & Passing)'}
              </strong>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: 12,
              }}
            >
              {/* 1. Gender */}
              <div
                style={{
                  background: 'var(--bg-card)',
                  padding: 10,
                  borderRadius: 6,
                  border: '1px solid var(--border)',
                }}
              >
                <div className="muted small-text" style={{ fontWeight: 600 }}>
                  👤 {isHi ? 'पूर्व जन्म लिंग (Gender)' : 'Past Life Gender'}
                </div>
                <div style={{ marginTop: 4, fontWeight: 700, fontSize: '13.5px', color: 'var(--accent)' }}>
                  {isHi ? pastLife.genderHi : pastLife.genderEn}
                </div>
              </div>

              {/* 2. Life Type */}
              <div
                style={{
                  background: 'var(--bg-card)',
                  padding: 10,
                  borderRadius: 6,
                  border: '1px solid var(--border)',
                }}
              >
                <div className="muted small-text" style={{ fontWeight: 600 }}>
                  🧬 {isHi ? 'योनि / जीवन प्रकार (Life Type)' : 'Life Type (Yoni)'}
                </div>
                <div style={{ marginTop: 4, fontWeight: 700, fontSize: '13.5px', color: 'var(--accent)' }}>
                  {isHi ? pastLife.lifeTypeHi : pastLife.lifeTypeEn}
                </div>
              </div>

              {/* 3. Birth Region / Country */}
              <div
                style={{
                  background: 'var(--bg-card)',
                  padding: 10,
                  borderRadius: 6,
                  border: '1px solid var(--border)',
                  gridColumn: '1 / -1',
                }}
              >
                <div className="muted small-text" style={{ fontWeight: 600 }}>
                  🌍 {isHi ? 'जन्म स्थान / देश व सभ्यता (Birthplace / Civilization)' : 'Birthplace / Country & Historical Region'}
                </div>
                <div style={{ marginTop: 4, fontWeight: 600, fontSize: '13px', lineHeight: 1.4 }}>
                  {isHi ? pastLife.birthPlaceOrCountryHi : pastLife.birthPlaceOrCountryEn}
                </div>
              </div>

              {/* 4. Profession */}
              <div
                style={{
                  background: 'var(--bg-card)',
                  padding: 10,
                  borderRadius: 6,
                  border: '1px solid var(--border)',
                  gridColumn: '1 / -1',
                }}
              >
                <div className="muted small-text" style={{ fontWeight: 600 }}>
                  ⚒️ {isHi ? 'पूर्व जन्म कार्य व व्यवसाय (Profession / Vocation)' : 'Past Life Profession / Craft'}
                </div>
                <div style={{ marginTop: 4, fontWeight: 600, fontSize: '13px', lineHeight: 1.4 }}>
                  {isHi ? pastLife.professionHi : pastLife.professionEn}
                </div>
              </div>

              {/* 5. Character & Temperament */}
              <div
                style={{
                  background: 'var(--bg-card)',
                  padding: 10,
                  borderRadius: 6,
                  border: '1px solid var(--border)',
                  gridColumn: '1 / -1',
                }}
              >
                <div className="muted small-text" style={{ fontWeight: 600 }}>
                  ⚖️ {isHi ? 'चरित्र व मूल स्वभाव (Character & Temperament)' : 'Character & Temperament'}
                </div>
                <div style={{ marginTop: 4, fontSize: '13px', lineHeight: 1.4 }}>
                  {isHi ? pastLife.characterHi : pastLife.characterEn}
                </div>
              </div>

              {/* 6. Marital Status */}
              <div
                style={{
                  background: 'var(--bg-card)',
                  padding: 10,
                  borderRadius: 6,
                  border: '1px solid var(--border)',
                }}
              >
                <div className="muted small-text" style={{ fontWeight: 600 }}>
                  💍 {isHi ? 'विवाह व दांपत्य स्थिति (Marital Status)' : 'Marital Status'}
                </div>
                <div style={{ marginTop: 4, fontSize: '13px', lineHeight: 1.4 }}>
                  {isHi ? pastLife.maritalStatusHi : pastLife.maritalStatusEn}
                </div>
              </div>

              {/* 7. Children */}
              <div
                style={{
                  background: 'var(--bg-card)',
                  padding: 10,
                  borderRadius: 6,
                  border: '1px solid var(--border)',
                }}
              >
                <div className="muted small-text" style={{ fontWeight: 600 }}>
                  👶 {isHi ? 'संतान सुख (Children)' : 'Children & Progeny'}
                </div>
                <div style={{ marginTop: 4, fontSize: '13px', lineHeight: 1.4 }}>
                  {isHi ? pastLife.childrenHi : pastLife.childrenEn}
                </div>
              </div>

              {/* 8. How Died */}
              <div
                style={{
                  background: 'var(--bg-card)',
                  padding: 10,
                  borderRadius: 6,
                  border: '1px solid var(--border)',
                  gridColumn: '1 / -1',
                }}
              >
                <div className="muted small-text" style={{ fontWeight: 600 }}>
                  🕊️ {isHi ? 'मृत्यु की स्थिति व अंतिम निर्वाण (How Died / Manner of Exit)' : 'Manner of Exit / Passing'}
                </div>
                <div style={{ marginTop: 4, fontSize: '13px', lineHeight: 1.4 }}>
                  {isHi ? pastLife.howDiedHi : pastLife.howDiedEn}
                </div>
              </div>
            </div>
          </div>

          <div className="domains-grid">
            <article className="domain-card">
              <div className="domain-top">
                <h4>
                  <Compass size={14} style={{ marginRight: 5, verticalAlign: 'middle' }} />
                  {isHi
                    ? '1. पूर्व जन्म भूमिका, कार्य व सामाजिक स्थिति'
                    : '1. Past-Life Role, Vocation & Station'}
                </h4>
                <span className="tag">Ketu + D60 Lagna</span>
              </div>
              <p className="domain-summary">
                {isHi ? pastLife.previousRoleAndStationHi : pastLife.previousRoleAndStationEn}
              </p>
            </article>

            <article className="domain-card">
              <div className="domain-top">
                <h4>
                  <Sparkles size={14} style={{ marginRight: 5, verticalAlign: 'middle' }} />
                  {isHi
                    ? '2. पूर्व पुण्य, संचित ज्ञान व स्वाभाविक गुण'
                    : '2. Purva Punya (Past Merit, Gifts & Wisdom)'}
                </h4>
                <span className="tag tag-varg">H5 · H9 · D20</span>
              </div>
              <p className="domain-summary">
                {isHi ? pastLife.purvaPunyaCarriedHi : pastLife.purvaPunyaCarriedEn}
              </p>
            </article>

            <article className="domain-card">
              <div className="domain-top">
                <h4>
                  <Flame size={14} style={{ marginRight: 5, verticalAlign: 'middle' }} />
                  {isHi
                    ? '3. अधूरे पूर्व संकल्प, वक्री ग्रह व कर्म-ऋण'
                    : '3. Unfinished Karma, Retrograde Vows & Debts'}
                </h4>
                <span className="tag tag-karaka">D60 · Retrogrades · Rahu</span>
              </div>
              <p className="domain-summary">
                {isHi ? pastLife.unfinishedKarmaAndDebtsHi : pastLife.unfinishedKarmaAndDebtsEn}
              </p>
            </article>

            <article className="domain-card">
              <div className="domain-top">
                <h4>
                  <History size={14} style={{ marginRight: 5, verticalAlign: 'middle' }} />
                  {isHi
                    ? '4. D12 वंश संबंध व पिछले जीवन का समापन (द्वादश भाव)'
                    : '4. D12 Ancestral Root & Past-Life Closing (H12)'}
                </h4>
                <span className="tag">D12 + H12</span>
              </div>
              <p className="domain-summary">
                {isHi ? pastLife.ancestralD12ConnectionHi : pastLife.ancestralD12ConnectionEn}
              </p>
              <div className="gochar-banner is-info small-text" style={{ marginTop: 8 }}>
                {isHi ? pastLife.pastLifeExitAndMemoryHi : pastLife.pastLifeExitAndMemoryEn}
              </div>
            </article>
          </div>
        </div>

        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th>{isHi ? 'कुंडली' : 'Chart'}</th>
                <th>{isHi ? 'ज्योतिषीय कारक' : 'Karmic Indicator'}</th>
                <th>{isHi ? 'स्थिति व अंश' : 'Placement'}</th>
                <th>{isHi ? 'पूर्व जन्म अर्थ' : 'Past-Life Interpretation'}</th>
              </tr>
            </thead>
            <tbody>
              {pastLife.chartFactors.map((row, idx) => (
                <tr key={`${row.chartCode}-${idx}`}>
                  <td>
                    <span className="tag tag-varg mono">{row.chartCode}</span>
                  </td>
                  <td>
                    <strong>{isHi ? row.factorHi : row.factorEn}</strong>
                  </td>
                  <td className="small-cell">{isHi ? row.placementHi : row.placementEn}</td>
                  <td className="wrap-cell small-cell">{isHi ? row.insightHi : row.insightEn}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 2. FUTURE BECOMING & NEXT INCARNATION / GATI (RAHU, D9 KARAKAMSA 12TH, D10, D20, D1 H12) */}
      <section className="panel">
        <div className="panel-header">
          <h3>
            <Orbit size={15} />{' '}
            {isHi
              ? 'भविष्य रूपांतरण — इस जीवन में आप क्या बनेंगे तथा आगामी जीवन/गति (पुनर्जन्म व मोक्ष दिशा)'
              : 'Future Becoming Reading — Who You Evolve Into in This Life & Next-Life Trajectory (Punarjanma / Gati)'}
          </h3>
          <span className="tag tag-varg">{futureBecoming.nextBirthGatiTier}</span>
        </div>

        <div className="pred-card-body">
          <div className="gochar-banner is-clear">
            <div>
              <strong>{isHi ? futureBecoming.headlineHi : futureBecoming.headlineEn}</strong>
              <div style={{ marginTop: 4 }}>
                {isHi
                  ? `भविष्य जीवन-लक्ष्य रूप: ${futureBecoming.archetypeHi}`
                  : `Future Life Archetype: ${futureBecoming.archetypeEn}`}
              </div>
            </div>
          </div>

          {/* Future Incarnation Metrics Bar */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: 12,
              marginTop: 12,
              marginBottom: 16,
            }}
          >
            <div
              style={{
                background: 'var(--bg-subtle)',
                padding: '10px 14px',
                borderRadius: 8,
                border: '1px solid var(--border)',
              }}
            >
              <div className="muted small-text" style={{ fontWeight: 600 }}>
                🌌 {isHi ? 'आगामी गति व लोक (Future Destination)' : 'Next Realm / Gati'}
              </div>
              <div style={{ marginTop: 4, fontWeight: 700, fontSize: '13.5px', color: 'var(--accent)' }}>
                {isHi ? futureBecoming.futureGatiHi : futureBecoming.futureGatiEn}
              </div>
            </div>

            <div
              style={{
                background: 'var(--bg-subtle)',
                padding: '10px 14px',
                borderRadius: 8,
                border: '1px solid var(--border)',
              }}
            >
              <div className="muted small-text" style={{ fontWeight: 600 }}>
                ☸️ {isHi ? 'मोक्ष / मुक्ति संभावना (Moksha Likelihood)' : 'Moksha / Liberation Likelihood'}
              </div>
              <div style={{ marginTop: 4, fontWeight: 700, fontSize: '13.5px', color: '#10b981' }}>
                {isHi ? futureBecoming.mokshaLikelihoodHi : futureBecoming.mokshaLikelihoodEn}
              </div>
            </div>

            <div
              style={{
                background: 'var(--bg-subtle)',
                padding: '10px 14px',
                borderRadius: 8,
                border: '1px solid var(--border)',
              }}
            >
              <div className="muted small-text" style={{ fontWeight: 600 }}>
                📊 {isHi ? 'आत्मिक विकास सूचकांक (Spiritual Evolution Index)' : 'Spiritual Evolution Index'}
              </div>
              <div style={{ marginTop: 4, display: 'flex', alignItems: 'center', gap: 10 }}>
                <strong style={{ fontSize: '15px', color: 'var(--accent)' }}>
                  {futureBecoming.spiritualEvolutionIndex}%
                </strong>
                <div
                  style={{
                    flex: 1,
                    height: 8,
                    background: 'var(--border)',
                    borderRadius: 4,
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      width: `${futureBecoming.spiritualEvolutionIndex}%`,
                      height: '100%',
                      background: 'var(--accent)',
                      borderRadius: 4,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="domains-grid">
            <article className="domain-card">
              <div className="domain-top">
                <h4>
                  {isHi
                    ? 'A. इस जीवन का परिपक्व रूपांतरण (आप भविष्य में क्या बनेंगे)'
                    : 'A. What You Become in This Life (Mature Evolution)'}
                </h4>
                <span className="tag tag-varg">Rahu · AK · D9</span>
              </div>
              <p className="domain-summary">
                {isHi ? futureBecoming.thisLifeMaturityHi : futureBecoming.thisLifeMaturityEn}
              </p>
              <div className="gochar-banner is-info small-text" style={{ marginTop: 8 }}>
                {isHi ? futureBecoming.careerAndLegacyApexHi : futureBecoming.careerAndLegacyApexEn}
              </div>
            </article>

            <article className="domain-card">
              <div className="domain-top">
                <h4>
                  {isHi
                    ? 'B. आगामी जन्म व आत्मा की उच्चतर गति (पुनर्जन्म / परलोक / मोक्ष)'
                    : 'B. Next Incarnation & Soul Destination (Gati / Punarjanma)'}
                </h4>
                <span className="tag tag-karaka">12th from AK (D9) · H12</span>
              </div>
              <div className="gochar-banner is-clear small-text">
                <strong>{isHi ? 'प्रमुख गति:' : 'Classical Gati:'}</strong>{' '}
                {isHi ? futureBecoming.nextBirthLokaHi : futureBecoming.nextBirthLokaEn}
              </div>
              <p className="domain-summary" style={{ marginTop: 8 }}>
                {isHi
                  ? futureBecoming.futureIncarnationProfileHi
                  : futureBecoming.futureIncarnationProfileEn}
              </p>
              <div className="gochar-banner is-info small-text" style={{ marginTop: 8 }}>
                <strong>{isHi ? 'भविष्य उन्नयन साधना:' : 'Sadhana to Elevate Future Gati:'}</strong>{' '}
                {isHi ? futureBecoming.sadhanaToElevateHi : futureBecoming.sadhanaToElevateEn}
              </div>
            </article>
          </div>
        </div>

        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th>{isHi ? 'कुंडली' : 'Chart'}</th>
                <th>{isHi ? 'भविष्य निर्धारक कारक' : 'Future-Shaping Factor'}</th>
                <th>{isHi ? 'स्थिति' : 'Placement'}</th>
                <th>{isHi ? 'क्या बनेंगे / आगामी फल' : 'Evolution & Becoming Impact'}</th>
              </tr>
            </thead>
            <tbody>
              {futureBecoming.chartFactors.map((row, idx) => (
                <tr key={`fut-${row.chartCode}-${idx}`}>
                  <td>
                    <span className="tag tag-karaka mono">{row.chartCode}</span>
                  </td>
                  <td>
                    <strong>{isHi ? row.factorHi : row.factorEn}</strong>
                  </td>
                  <td className="small-cell">{isHi ? row.placementHi : row.placementEn}</td>
                  <td className="wrap-cell small-cell">{isHi ? row.insightHi : row.insightEn}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
