import React, { useMemo } from 'react';
import { computeGeneralPrediction } from '../../astro/predictions/generalPrediction';
import type { ChartData } from '../../astro/types';
import { useLanguage } from '../../i18n/LanguageContext';

interface GeneralPredictionPanelProps {
  chart: ChartData;
}

export const GeneralPredictionPanel: React.FC<GeneralPredictionPanelProps> = ({ chart }) => {
  const { lang } = useLanguage();
  const isHi = lang === 'hi';
  const report = useMemo(() => computeGeneralPrediction(chart), [chart]);

  const label = (kind: 'supportive' | 'caution' | 'context') => {
    if (isHi) {
      return kind === 'supportive' ? 'सहायक संकेत' : kind === 'caution' ? 'सावधानी' : 'संदर्भ';
    }
    return kind === 'supportive' ? 'Supportive indication' : kind === 'caution' ? 'Caution' : 'Context';
  };

  return (
    <div className="view-stack">
      <section className="card" style={{ borderLeft: '4px solid var(--accent)' }}>
        <h2 style={{ margin: 0, fontSize: '18px' }}>{isHi ? report.titleHi : report.titleEn}</h2>
        <p className="muted" style={{ margin: '8px 0 0', lineHeight: 1.6, fontSize: '13px' }}>
          {isHi ? report.methodHi : report.methodEn}
        </p>
        <p style={{ margin: '10px 0 0', lineHeight: 1.65, fontSize: '13px' }}>
          {isHi ? report.summaryHi : report.summaryEn}
        </p>
      </section>

      <section className="card" style={{ padding: '12px 14px' }}>
        <strong style={{ fontSize: '13px' }}>{isHi ? 'फलादेश पढ़ने का तरीका' : 'How to read this analysis'}</strong>
        <p className="muted" style={{ margin: '6px 0 0', fontSize: '12px', lineHeight: 1.6 }}>
          {isHi
            ? 'हर क्षेत्र में पहले कुंडली से प्राप्त तथ्य दिए गए हैं। सहायक और सावधानी वाले संकेत ग्रह की गरिमा या उपलब्ध बल-सूचक हैं, अंतिम शुभ-अशुभ निर्णय नहीं। विरोधी संकेतों को साथ देखकर ही पारंपरिक व्याख्या करें।'
            : 'Each domain starts with observations from the chart. Supportive and caution labels describe dignity or available strength indicators, not a final verdict. Interpret conflicting indications together before drawing a traditional conclusion.'}
        </p>
      </section>

      <div className="view-stack">
        {report.domains.map((domain, index) => (
          <article className="card" key={domain.id} style={{ padding: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
              <div>
                <div className="muted" style={{ fontSize: '11px', fontWeight: 700 }}>
                  {isHi ? `जीवन-क्षेत्र ${index + 1} / 12` : `LIFE DOMAIN ${index + 1} / 12`}
                </div>
                <h3 style={{ margin: '4px 0 0', fontSize: '16px' }}>
                  {isHi ? domain.titleHi : domain.titleEn}
                </h3>
                <div className="muted" style={{ marginTop: '4px', fontSize: '11px' }}>
                  {isHi ? 'संबंधित भाव' : 'Relevant houses'}: {domain.houses.join(', ')} · {domain.varga}
                </div>
              </div>
              <span className="badge badge-subtle">
                {domain.dataCompleteness === 'complete'
                  ? (isHi ? 'डेटा उपलब्ध' : 'Core data available')
                  : domain.dataCompleteness === 'partial'
                    ? (isHi ? 'आंशिक डेटा' : 'Partial data')
                    : (isHi ? 'सीमित डेटा' : 'Limited data')}
              </span>
            </div>

            <p className="muted" style={{ margin: '12px 0 6px', fontSize: '12px', lineHeight: 1.6 }}>
              {isHi ? domain.interpretationBasisHi : domain.interpretationBasisEn}
            </p>
            <p style={{ margin: '6px 0 12px', fontSize: '13px', lineHeight: 1.65 }}>
              <strong>{isHi ? 'कुंडली का मुख्य आधार: ' : 'Primary chart anchor: '}</strong>
              {isHi ? domain.primaryAnchorHi : domain.primaryAnchorEn}
              <br />
              {isHi ? domain.synthesisHi : domain.synthesisEn}
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '10px' }}>
              {domain.karakas.map((karaka) => (
                <span className="tag tag-varg" key={karaka}>{karaka}</span>
              ))}
            </div>

            <details>
              <summary style={{ cursor: 'pointer', fontWeight: 650, fontSize: '13px' }}>
                {isHi ? `कुंडली-प्रमाण देखें (${domain.evidence.length})` : `View chart evidence (${domain.evidence.length})`}
              </summary>
              <ul style={{ margin: '10px 0 0', paddingLeft: '18px', display: 'grid', gap: '9px' }}>
                {domain.evidence.map((item, evidenceIndex) => (
                  <li key={`${item.source}-${evidenceIndex}`} style={{ fontSize: '12px', lineHeight: 1.6 }}>
                    <strong>{label(item.kind)} · {item.source}</strong>
                    <div>{isHi ? item.detailHi : item.detailEn}</div>
                  </li>
                ))}
              </ul>
            </details>
          </article>
        ))}
      </div>

      <p className="muted" style={{ fontSize: '11px', lineHeight: 1.55 }}>
        {isHi
          ? 'यह पारंपरिक ज्योतिषीय व्याख्या के लिए साक्ष्य-संग्रह है, वैज्ञानिक रूप से प्रमाणित भविष्यवाणी नहीं। विवाह, संतान, स्वास्थ्य, धन या करियर के निश्चित परिणाम का दावा नहीं किया जाता।'
          : 'This is an evidence-organized traditional astrology interpretation, not a scientifically validated forecast. It does not claim certain outcomes for marriage, children, health, wealth or career.'}
      </p>
    </div>
  );
};
