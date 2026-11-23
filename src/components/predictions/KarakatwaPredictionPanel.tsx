import React, { useMemo, useState } from 'react';
import { computeKarakatwaPredictions, type KarakatwaDomainId } from '../../astro/predictions/karakatwaPrediction';
import type { ChartData } from '../../astro/types';
import { useLanguage } from '../../i18n/LanguageContext';

interface KarakatwaPredictionPanelProps {
  chart: ChartData;
}

const DOMAINS: Array<{ id: KarakatwaDomainId; en: string; hi: string }> = [
  { id: 'appearance', en: 'Appearance', hi: 'रूप-रंग' },
  { id: 'siblings', en: 'Siblings', hi: 'भाई-बहन' },
  { id: 'personality', en: 'Personality', hi: 'व्यक्तित्व' },
];

export const KarakatwaPredictionPanel: React.FC<KarakatwaPredictionPanelProps> = ({ chart }) => {
  const { lang } = useLanguage();
  const isHi = lang === 'hi';
  const [activeDomain, setActiveDomain] = useState<KarakatwaDomainId>('appearance');
  const report = useMemo(() => computeKarakatwaPredictions(chart), [chart]);
  const selected = report.predictions.find((item) => item.id === activeDomain) ?? report.predictions[0];

  const levelLabel = (level: string) => {
    if (isHi) {
      if (level === 'corroborated') return 'एकाधिक संकेत';
      if (level === 'mixed') return 'मिले-जुले संकेत';
      if (level === 'single-indication') return 'एक संकेत';
      return 'अपर्याप्त संकेत';
    }
    if (level === 'corroborated') return 'Multiple indications';
    if (level === 'mixed') return 'Mixed indications';
    if (level === 'single-indication') return 'Single indication';
    return 'Insufficient evidence';
  };

  return (
    <div className="view-stack">
      <section className="card" style={{ borderLeft: '4px solid var(--accent)' }}>
        <h2 style={{ margin: 0, fontSize: '20px' }}>{isHi ? report.titleHi : report.titleEn}</h2>
        <p className="muted" style={{ margin: '8px 0 0', lineHeight: 1.65, fontSize: '13px' }}>
          {isHi ? report.summaryHi : report.summaryEn}
        </p>
      </section>

      <div className="card" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', padding: '10px' }} role="tablist" aria-label={isHi ? 'कारकत्व फलादेश उप-अनुभाग' : 'Karakatwa prediction subsections'}>
        {DOMAINS.map((domain) => (
          <button
            key={domain.id}
            type="button"
            role="tab"
            aria-selected={activeDomain === domain.id}
            className={activeDomain === domain.id ? 'btn btn-primary btn-sm' : 'btn btn-secondary btn-sm'}
            onClick={() => setActiveDomain(domain.id)}
          >
            {isHi ? domain.hi : domain.en}
          </button>
        ))}
      </div>

      {selected && (
        <article className="card" style={{ padding: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', flexWrap: 'wrap' }}>
            <h3 style={{ margin: 0, fontSize: '18px' }}>{isHi ? selected.titleHi : selected.titleEn}</h3>
            <span className="badge badge-subtle">{levelLabel(selected.evidenceLevel)}</span>
          </div>
          <p style={{ margin: '14px 0 0', fontSize: '14px', lineHeight: 1.9 }}>
            {isHi ? selected.predictionHi : selected.predictionEn}
          </p>
          <p className="muted" style={{ margin: '12px 0 0', fontSize: '12px', lineHeight: 1.7 }}>
            {isHi ? selected.caveatHi : selected.caveatEn}
          </p>

          <details style={{ marginTop: '16px', borderTop: '1px solid var(--border-subtle, rgba(128,128,128,.25))', paddingTop: '12px' }}>
            <summary style={{ cursor: 'pointer', fontWeight: 650, fontSize: '13px' }}>
              {isHi ? `शास्त्रीय नियम और कुंडली-प्रमाण देखें (${selected.evidence.length})` : `Inspect classical rules and chart evidence (${selected.evidence.length})`}
            </summary>
            {selected.evidence.length ? (
              <ul style={{ margin: '12px 0 0', paddingLeft: '18px', display: 'grid', gap: '12px' }}>
                {selected.evidence.map((item) => (
                  <li key={item.id} style={{ fontSize: '12px', lineHeight: 1.65 }}>
                    <strong>{item.factor}</strong>
                    <div>{isHi ? item.detailHi : item.detailEn}</div>
                    <div className="muted" style={{ marginTop: '4px' }}>
                      {isHi ? 'ग्रंथ-संदर्भ: ' : 'Textual source: '}
                      <a href={item.sourceUrl} target="_blank" rel="noreferrer">{item.source}</a>
                      {' · '}
                      {item.sourceStatus === 'primary-text'
                        ? (isHi ? 'प्राथमिक ग्रंथ' : 'Primary text')
                        : item.sourceStatus === 'translation-check'
                          ? (isHi ? 'अनुवाद का पुनःमिलान आवश्यक' : 'Translation verification required')
                          : (isHi ? 'अनुसंधान-परिकल्पना' : 'Research hypothesis')}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="muted" style={{ fontSize: '12px' }}>
                {isHi ? 'इस अनुभाग के लिए कोई विशिष्ट नियम-मिलान उपलब्ध नहीं है।' : 'No specific rule match is available for this section.'}
              </p>
            )}
          </details>
        </article>
      )}

      <section className="card" style={{ padding: '14px' }}>
        <strong style={{ fontSize: '13px' }}>{isHi ? 'नियमों को पढ़ने की पद्धति' : 'How to read these rules'}</strong>
        <p className="muted" style={{ margin: '7px 0 0', fontSize: '12px', lineHeight: 1.7 }}>
          {isHi
            ? 'प्राथमिक ग्रंथ का नियम, अनुवाद-जाँच और आधुनिक अनुसंधान-परिकल्पना अलग-अलग दिखाई जाती हैं। एक ग्रह या एक दोष से अंतिम निष्कर्ष नहीं निकाला जाता। विशेषकर भाई-बहनों के विषय में संख्या, संबंध और वास्तविक जीवन-परिस्थिति अलग-अलग प्रश्न हैं।'
            : 'Primary-text rules, translation checks and modern research hypotheses are kept distinct. No final conclusion is drawn from one planet or one affliction. In sibling analysis, count, relationship quality and lived circumstances are separate questions.'}
        </p>
      </section>
    </div>
  );
};
