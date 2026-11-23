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

  return (
    <div className="view-stack">
      <section className="card" style={{ borderLeft: '4px solid var(--accent)' }}>
        <h2 style={{ margin: 0, fontSize: '20px' }}>{isHi ? report.titleHi : report.titleEn}</h2>
        <p className="muted" style={{ margin: '8px 0 0', lineHeight: 1.6, fontSize: '13px' }}>
          {isHi ? report.summaryHi : report.summaryEn}
        </p>
      </section>

      <div className="view-stack">
        {report.domains.map((domain, index) => (
          <article className="card" key={domain.id} style={{ padding: '16px' }}>
            <div className="muted" style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.04em' }}>
              {isHi ? `जीवन का क्षेत्र ${index + 1} / ${report.domains.length}` : `LIFE STORY ${index + 1} / ${report.domains.length}`}
            </div>
            <h3 style={{ margin: '5px 0 0', fontSize: '18px' }}>
              {isHi ? domain.titleHi : domain.titleEn}
            </h3>
            <p style={{ margin: '12px 0 0', fontSize: '14px', lineHeight: 1.85, whiteSpace: 'pre-line' }}>
              {isHi ? domain.predictionHi : domain.predictionEn}
            </p>

            <details style={{ marginTop: '16px', borderTop: '1px solid var(--border-subtle, rgba(128,128,128,.25))', paddingTop: '12px' }}>
              <summary style={{ cursor: 'pointer', fontWeight: 650, fontSize: '13px' }}>
                {isHi ? 'इस फलादेश का शास्त्रीय और तकनीकी आधार' : 'Classical and technical reasoning behind this reading'}
              </summary>
              <div style={{ display: 'grid', gap: '10px', marginTop: '12px' }}>
                <div>
                  <strong style={{ fontSize: '12px' }}>{isHi ? 'व्याख्या का आधार' : 'Interpretation framework'}</strong>
                  <p className="muted" style={{ margin: '4px 0 0', fontSize: '12px', lineHeight: 1.65 }}>
                    {isHi ? domain.interpretationBasisHi : domain.interpretationBasisEn}
                  </p>
                </div>
                <div>
                  <strong style={{ fontSize: '12px' }}>{isHi ? 'मुख्य ग्रह-स्थिति' : 'Primary chart factor'}</strong>
                  <p className="muted" style={{ margin: '4px 0 0', fontSize: '12px', lineHeight: 1.65 }}>
                    {isHi ? domain.primaryAnchorHi : domain.primaryAnchorEn}
                  </p>
                </div>
                <div>
                  <strong style={{ fontSize: '12px' }}>{isHi ? 'सहायक समन्वय' : 'Combined interpretation'}</strong>
                  <p className="muted" style={{ margin: '4px 0 0', fontSize: '12px', lineHeight: 1.65 }}>
                    {isHi ? domain.synthesisHi : domain.synthesisEn}
                  </p>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {domain.karakas.map((karaka) => (
                    <span className="tag tag-varg" key={karaka}>{karaka}</span>
                  ))}
                  <span className="badge badge-subtle">
                    {domain.dataCompleteness === 'complete'
                      ? (isHi ? 'मूल डेटा उपलब्ध' : 'Core data available')
                      : domain.dataCompleteness === 'partial'
                        ? (isHi ? 'आंशिक डेटा' : 'Partial data')
                        : (isHi ? 'सीमित डेटा' : 'Limited data')}
                  </span>
                  <span className="tag tag-varg">{domain.houses.join(', ')}</span>
                  <span className="tag tag-varg">{domain.varga}</span>
                </div>
                <details>
                  <summary style={{ cursor: 'pointer', fontWeight: 650, fontSize: '12px' }}>
                    {isHi ? `विस्तृत कुंडली-प्रमाण देखें (${domain.evidence.length})` : `Inspect chart evidence (${domain.evidence.length})`}
                  </summary>
                  <ul style={{ margin: '10px 0 0', paddingLeft: '18px', display: 'grid', gap: '9px' }}>
                    {domain.evidence.map((item, evidenceIndex) => (
                      <li key={`${item.source}-${evidenceIndex}`} style={{ fontSize: '12px', lineHeight: 1.6 }}>
                        <strong>{item.source}</strong>
                        <div>{isHi ? item.detailHi : item.detailEn}</div>
                      </li>
                    ))}
                  </ul>
                </details>
              </div>
            </details>
          </article>
        ))}
      </div>

      <section className="card" style={{ padding: '14px' }}>
        <strong style={{ fontSize: '13px' }}>{isHi ? 'ग्रंथ-आधार और अध्ययन की सीमा' : 'Classical sources and research limits'}</strong>
        <p className="muted" style={{ margin: '7px 0 0', fontSize: '12px', lineHeight: 1.7 }}>
          {isHi
            ? 'फलादेश की परंपरा में बृहत्पाराशर होराशास्त्र के भाव-विचार एवं भावेश-फल, फलदीपिका, सारावली और बृहत्जातक जैसे ग्रंथों का तुलनात्मक अध्ययन आवश्यक है। अलग-अलग संस्करणों में अध्याय और श्लोक-संख्या बदल सकती है। किसी नियम को तभी प्रमाणित बताया जाएगा जब उसका विशिष्ट ग्रंथ-संदर्भ और लागू होने की शर्त जाँची गई हो।'
            : 'The reading tradition should be studied comparatively through Brihat Parashara Hora Shastra (house meanings and house-lord results), Phaladeepika, Saravali and Brihat Jataka. Chapter and verse numbering can differ between editions. A rule will be described as verified only when its specific textual reference and operating conditions have been checked.'}
        </p>
        <p className="muted" style={{ margin: '7px 0 0', fontSize: '11px', lineHeight: 1.6 }}>
          {isHi
            ? 'यह पारंपरिक ज्योतिषीय व्याख्या है, वैज्ञानिक रूप से प्रमाणित भविष्यवाणी नहीं। दशा और गोचर से समय-निर्धारण अलग से होगा। स्वास्थ्य संबंधी भाग चिकित्सकीय सलाह नहीं है।'
            : 'This is a traditional astrological interpretation, not a scientifically validated forecast. Dasha and transit timing are separate. The health section is not medical advice.'}
        </p>
        <ul style={{ margin: '10px 0 0', paddingLeft: '18px', display: 'grid', gap: '6px', fontSize: '12px' }}>
          <li><a href="https://vedicpupil.in/library/books/brihat-parashara-hora-shastra/chapter-24" target="_blank" rel="noreferrer">Brihat Parashara Hora Shastra — Chapter 24: House Lord Results</a></li>
          <li><a href="https://www.wisdomlib.org/hinduism/book/phaladeepika-by-mantreswara-text-and-translation" target="_blank" rel="noreferrer">Phaladeepika — Mantreswara (text and translation)</a></li>
          <li><a href="https://astravya.co.in/library/text/saravali" target="_blank" rel="noreferrer">Saravali — Kalyana Varma (text overview and chapter map)</a></li>
        </ul>
      </section>
    </div>
  );
};
