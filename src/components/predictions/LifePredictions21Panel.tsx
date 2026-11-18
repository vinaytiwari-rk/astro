import React, { useMemo, useState } from 'react';
import type { LifeDimensionReading } from '../../astro/predictions/sambhavitFalkathan';
import type { SambhavitFalkathanReport } from '../../astro/predictions/sambhavitFalkathan';

interface LifePredictions21PanelProps {
  report: SambhavitFalkathanReport;
  isHi: boolean;
}

const CATEGORY_LABELS: Record<string, { hi: string; en: string }> = {
  identity: { hi: 'व्यक्तित्व', en: 'Identity' },
  family: { hi: 'परिवार', en: 'Family' },
  marriage: { hi: 'विवाह', en: 'Marriage' },
  progeny: { hi: 'संतान', en: 'Children' },
  education: { hi: 'शिक्षा', en: 'Education' },
  career: { hi: 'करियर', en: 'Career' },
  longevity_health: { hi: 'स्वास्थ्य व आयु', en: 'Health & longevity' },
  shadow_challenges: { hi: 'चुनौतियां', en: 'Challenges' },
  spirituality: { hi: 'आध्यात्मिकता', en: 'Spirituality' },
  wealth_fortune: { hi: 'धन व भाग्य', en: 'Wealth & fortune' },
};

const LEVEL_LABELS: Record<string, { hi: string; en: string }> = {
  highly_favorable: { hi: 'अधिक अनुकूल संकेत', en: 'More supportive signs' },
  favorable: { hi: 'अनुकूल संकेत', en: 'Supportive signs' },
  mixed_moderate: { hi: 'मिले-जुले संकेत', en: 'Mixed indications' },
  challenging_caution: { hi: 'सावधानी व अतिरिक्त प्रयास', en: 'Caution and extra effort' },
};

const LEVEL_EXPLANATIONS: Record<string, { hi: string; en: string }> = {
  highly_favorable: { hi: 'इस विषय में कुंडली के संकेत अपेक्षाकृत सहयोगी हैं। अवसरों का लाभ लेने के लिए सही योजना और प्रयास जरूरी हैं।', en: 'The chart shows relatively supportive indications in this area. Good planning and effort are still required.' },
  favorable: { hi: 'इस विषय में अनुकूल संकेत हैं, लेकिन परिणाम आपके प्रयासों और परिस्थितियों पर भी निर्भर करेंगे।', en: 'There are supportive indications, but outcomes also depend on effort and circumstances.' },
  mixed_moderate: { hi: 'इस विषय में सकारात्मक और चुनौतीपूर्ण दोनों संकेत हैं। जल्दबाजी से बचें और संतुलित निर्णय लें।', en: 'Both supportive and challenging indications appear. Avoid haste and make balanced decisions.' },
  challenging_caution: { hi: 'इस विषय में अधिक धैर्य, तैयारी और सावधानी की जरूरत हो सकती है। इसे निश्चित असफलता न समझें।', en: 'This area may need extra patience, preparation and care. It does not mean certain failure.' },
};

const CATEGORY_ORDER = Object.keys(CATEGORY_LABELS);

export const LifePredictions21Panel: React.FC<LifePredictions21PanelProps> = ({ report, isHi }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const categories = useMemo(
    () => CATEGORY_ORDER.filter((category) => report.dimensions.some((item) => item.category === category)),
    [report.dimensions],
  );
  const visibleDimensions = useMemo(
    () => selectedCategory === 'all'
      ? report.dimensions
      : report.dimensions.filter((item) => item.category === selectedCategory),
    [report.dimensions, selectedCategory],
  );

  const getText = (item: LifeDimensionReading, hi: string, en: string) => isHi ? item[hi as keyof LifeDimensionReading] : item[en as keyof LifeDimensionReading];

  return (
    <div className="view-stack">
      <section className="card" style={{ padding: '16px 20px', borderLeft: '4px solid var(--accent)' }}>
        <h2 style={{ margin: 0, fontSize: '18px' }}>
          {isHi ? '21 प्रमुख जीवन फलादेश' : '21 Key Life Predictions'}
        </h2>
        <p className="muted" style={{ margin: '6px 0 0', fontSize: '13px', lineHeight: 1.55 }}>
          {isHi
            ? 'जन्म कुंडली और उपलब्ध वर्ग कुंडलियों से चुने गए 21 विषय। हर निष्कर्ष को सरल भाषा में पढ़ें; तकनीकी आधार और शास्त्रीय संदर्भ अलग से खोलें।'
            : 'Twenty-one selected topics from the natal and available divisional charts. Read the plain-language takeaway first; open the technical basis and classical references separately.'}
        </p>
        <p style={{ margin: '10px 0 0', padding: '9px 11px', borderRadius: '7px', background: 'var(--bg-subtle)', fontSize: '12px', lineHeight: 1.5 }}>
          {isHi
            ? 'महत्वपूर्ण: शुभता का स्तर गणितीय संभावना या घटना की गारंटी नहीं है। विवाह, संतान, स्वास्थ्य, आयु, मुकदमे या धन के बारे में कोई निष्कर्ष निश्चित तथ्य नहीं माना जाना चाहिए। चिकित्सा, कानूनी और वित्तीय निर्णय विशेषज्ञ की सलाह से लें।'
            : 'Important: the indication level is not a mathematical probability or event guarantee. Statements about marriage, children, health, longevity, litigation or wealth should not be treated as established facts. Use qualified medical, legal and financial advice for decisions.'}
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '7px', marginTop: '12px' }}>
          <span className="tag tag-accent">{report.dimensions.length} {isHi ? 'फलादेश' : 'readings'}</span>
          <span className="tag tag-subtle">{isHi ? 'स्कोर नहीं, अर्थ पर ध्यान' : 'Meaning, not scores'}</span>
        </div>
      </section>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '7px' }}>
        <button type="button" className={`btn btn-sm ${selectedCategory === 'all' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setSelectedCategory('all')}>
          {isHi ? 'सभी 21' : 'All 21'}
        </button>
        {categories.map((category) => (
          <button key={category} type="button" className={`btn btn-sm ${selectedCategory === category ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setSelectedCategory(category)}>
            {isHi ? CATEGORY_LABELS[category].hi : CATEGORY_LABELS[category].en}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: '12px' }}>
        {visibleDimensions.map((item, index) => {
          const level = LEVEL_LABELS[item.auspiciousness] || LEVEL_LABELS.mixed_moderate;
          const explanation = LEVEL_EXPLANATIONS[item.auspiciousness] || LEVEL_EXPLANATIONS.mixed_moderate;
          const title = isHi ? item.titleHi : item.titleEn;
          const verdict = isHi ? item.verdictHi : item.verdictEn;
          const analysis = isHi ? item.detailedAnalysisHi : item.detailedAnalysisEn;
          const basis = isHi ? item.astroBasisHi : item.astroBasisEn;
          const remedy = isHi ? item.remedyHi : item.remedyEn;
          const categoryLabel = CATEGORY_LABELS[item.category] || { hi: item.categoryTitleHi, en: item.categoryTitleEn };
          return (
            <article key={item.id} className="card" style={{ padding: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', marginBottom: '9px' }}>
                <div>
                  <span className="muted" style={{ fontSize: '11px' }}>{isHi ? categoryLabel.hi : categoryLabel.en} · {isHi ? 'फलादेश' : 'Reading'} {item.id}</span>
                  <h3 style={{ margin: '4px 0 0', fontSize: '15px', lineHeight: 1.4 }}>{title}</h3>
                </div>
                <span className="tag tag-subtle" style={{ flexShrink: 0 }}>{isHi ? level.hi : level.en}</span>
              </div>
              <p style={{ margin: '0 0 8px', fontSize: '13px', lineHeight: 1.55 }}>
                <strong>{isHi ? 'इसका सरल अर्थ: ' : 'In plain language: '}</strong>{isHi ? explanation.hi : explanation.en}
              </p>
              <p style={{ margin: 0, fontSize: '13px', lineHeight: 1.6 }}>{verdict}</p>
              <details style={{ marginTop: '10px', borderTop: '1px solid var(--border-subtle)', paddingTop: '8px' }}>
                <summary style={{ cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}>
                  {isHi ? 'विस्तृत विश्लेषण व ज्योतिषीय आधार' : 'Detailed analysis and astrological basis'}
                </summary>
                <p style={{ fontSize: '12.5px', lineHeight: 1.55 }}>{analysis}</p>
                <p style={{ fontSize: '12px', lineHeight: 1.5 }}><strong>{isHi ? 'गणना का आधार: ' : 'Astrological basis: '}</strong>{basis}</p>
                {(item.classicalRef || item.divisionalRef) && (
                  <p className="muted" style={{ fontSize: '11px' }}>
                    {item.classicalRef ? `${isHi ? 'शास्त्रीय संदर्भ' : 'Classical reference'}: ${item.classicalRef}` : ''}
                    {item.classicalRef && item.divisionalRef ? ' · ' : ''}
                    {item.divisionalRef ? `${isHi ? 'वर्ग कुंडली' : 'Divisional chart'}: ${item.divisionalRef}` : ''}
                  </p>
                )}
                <p style={{ fontSize: '12.5px', lineHeight: 1.55 }}>
                  <strong>{isHi ? 'व्यावहारिक सुझाव: ' : 'Practical guidance: '}</strong>{remedy}
                </p>
              </details>
            </article>
          );
        })}
      </div>
    </div>
  );
};
