import React, { useState, useMemo } from 'react';
import type { ChartData, CalcSettings } from '../../astro/types';
import {
  computeHolisticRemedies,
  type ProblemFocusArea,
  type LifestyleMode,
} from '../../astro/holisticRemedies';

interface HolisticRemediesViewProps {
  chart: ChartData;
  settings: CalcSettings;
  onNavigate?: (view: string) => void;
  onOpenBooklet?: () => void;
}

export const HolisticRemediesView: React.FC<HolisticRemediesViewProps> = ({
  chart,
  onNavigate,
}) => {
  const [activeTab, setActiveTab] = useState<
    'all' | 'roots' | 'colors' | 'yoga' | 'totke' | 'stotras' | 'ishta' | 'bath' | 'prescription'
  >('all');
  const [problemFilter, setProblemFilter] = useState<ProblemFocusArea>('all');
  const [lifestyleFilter, setLifestyleFilter] = useState<LifestyleMode>('all');

  const report = useMemo(() => {
    return computeHolisticRemedies(chart, problemFilter, lifestyleFilter);
  }, [chart, problemFilter, lifestyleFilter]);

  const filteredTotke = useMemo(() => {
    if (lifestyleFilter === 'all') return report.kitchenTotke;
    if (lifestyleFilter === 'metro_flat') return report.kitchenTotke.filter((t) => t.lifestyleTag === 'metro_friendly');
    if (lifestyleFilter === 'zero_cost') return report.kitchenTotke.filter((t) => t.lifestyleTag === 'zero_cost');
    if (lifestyleFilter === 'quick_5min') return report.kitchenTotke.filter((t) => t.lifestyleTag === 'quick_daily');
    return report.kitchenTotke;
  }, [report.kitchenTotke, lifestyleFilter]);

  const filteredStotras = useMemo(() => {
    if (problemFilter === 'all') return report.classicalStotras;
    return report.classicalStotras.filter((s) => s.problemArea === problemFilter || s.urgencyLevel === 'high');
  }, [report.classicalStotras, problemFilter]);

  const handlePrintSlip = () => {
    window.print();
  };

  return (
    <div className="oj-page-container" style={{ maxWidth: '1100px', margin: '0 auto', padding: '16px' }}>
      {/* Hero Header */}
      <div
        style={{
          background: 'linear-gradient(135deg, #78350f 0%, #451a03 50%, #291205 100%)',
          color: '#ffffff',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
          border: '1px solid rgba(217, 119, 6, 0.3)',
          marginBottom: '20px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
          <div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '4px 10px',
                borderRadius: '9999px',
                background: 'rgba(245, 158, 11, 0.15)',
                color: '#fde68a',
                fontSize: '11px',
                fontWeight: '700',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                marginBottom: '8px',
              }}
            >
              Desh-Kaal-Paristhiti Vedic Healing
            </div>
            <h1 style={{ margin: '0 0 6px', fontSize: '26px', fontFamily: 'Cinzel, Playfair Display, serif', color: '#fef3c7' }}>
              समग्र वैदिक उपचार एवं व्यावहारिक परिहार
            </h1>
            <p style={{ margin: 0, fontSize: '13px', color: 'rgba(254, 243, 199, 0.85)', maxWidth: '680px', lineHeight: '1.5' }}>
              महंगे रत्नों व जटिल अनुष्ठानों के आडंबर से मुक्त — दशा, गोचर व D1-D9 के आधार पर प्राकृतिक जड़ी-बूटी, रंग चिकित्सा, योग-प्राणायाम, रसोई के टोटके, शास्त्रीय स्तोत्र एवं इष्ट देव साधना।
            </p>
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => setActiveTab('prescription')}
              className="oj-action-btn primary"
            >
              उपचार पर्ची देखें (Prescription)
            </button>
            {onNavigate && (
              <button
                type="button"
                onClick={() => onNavigate('kundli')}
                className="oj-action-btn secondary"
              >
                कुंडली चक्र
              </button>
            )}
          </div>
        </div>

        {/* Live Active Context Banner */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '10px',
            marginTop: '20px',
            paddingTop: '16px',
            borderTop: '1px solid rgba(245, 158, 11, 0.2)',
            fontSize: '12.5px',
          }}
        >
          <div style={{ background: 'rgba(0, 0, 0, 0.25)', borderRadius: '10px', padding: '10px 12px', border: '1px solid rgba(245, 158, 11, 0.15)' }}>
            <span style={{ color: '#fde68a', fontWeight: 'bold', display: 'block', fontSize: '11.5px' }}>सक्रिय महादशा / अंतर्दशा:</span>
            <span style={{ color: '#ffffff', fontWeight: '600' }}>
              {report.activeDasha.mahadasha} / {report.activeDasha.antardasha}
            </span>
          </div>
          <div style={{ background: 'rgba(0, 0, 0, 0.25)', borderRadius: '10px', padding: '10px 12px', border: '1px solid rgba(245, 158, 11, 0.15)' }}>
            <span style={{ color: '#fde68a', fontWeight: 'bold', display: 'block', fontSize: '11.5px' }}>शनि गोचर / साढ़े साती स्थिति:</span>
            <span style={{ color: '#ffffff', fontWeight: '600' }}>{report.gocharHighlights.sadeSatiPhaseTextHi}</span>
          </div>
          <div style={{ background: 'rgba(0, 0, 0, 0.25)', borderRadius: '10px', padding: '10px 12px', border: '1px solid rgba(245, 158, 11, 0.15)' }}>
            <span style={{ color: '#fde68a', fontWeight: 'bold', display: 'block', fontSize: '11.5px' }}>इष्ट देव (D9 कारकांश 12वां भाव):</span>
            <span style={{ color: '#ffffff', fontWeight: '600' }}>{report.ishtaDevata.deityNameHi}</span>
          </div>
        </div>
      </div>

      {/* Filter Controls Row */}
      <div
        className="oj-horo-control-strip"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: '20px',
        }}
      >
        {/* Navigation Tabs */}
        <div className="oj-tab-pills-row">
          {[
            { id: 'all', label: 'समस्त समाधान' },
            { id: 'roots', label: 'वृक्षों की जड़ें (Herbal Roots)' },
            { id: 'colors', label: 'रंग चिकित्सा (Colors)' },
            { id: 'yoga', label: 'योग एवं प्राणायाम' },
            { id: 'totke', label: 'रसोई व घरेलू टोटके' },
            { id: 'stotras', label: 'शास्त्रीय स्तोत्र व पाठ' },
            { id: 'ishta', label: 'इष्ट देव साधना' },
            { id: 'bath', label: 'औषधि स्नान' },
            { id: 'prescription', label: 'परामर्श पर्ची' },
          ].map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveTab(t.id as any)}
              className={`oj-tab-pill ${activeTab === t.id ? 'is-active' : ''}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Problem and Lifestyle Filters */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
          <select
            value={problemFilter}
            onChange={(e) => setProblemFilter(e.target.value as ProblemFocusArea)}
            className="oj-select-pill"
          >
            <option value="all">समस्त समस्याएं (All Concerns)</option>
            <option value="finance_wealth">आर्थिक संकट व ऋण (Finance)</option>
            <option value="sade_sati_anxiety">साढ़े साती व तनाव (Sade Sati)</option>
            <option value="career_job">करियर, नौकरी व मान (Career)</option>
            <option value="health_arishta">स्वास्थ्य व अरिष्ट शांति (Health)</option>
            <option value="marriage_relationship">विवाह व दांपत्य (Marriage)</option>
            <option value="progeny_children">संतान बाधा (Progeny)</option>
            <option value="court_enemies">कोर्ट-कचहरी व शत्रु (Litigation)</option>
          </select>

          <select
            value={lifestyleFilter}
            onChange={(e) => setLifestyleFilter(e.target.value as LifestyleMode)}
            className="oj-select-pill"
          >
            <option value="all">सभी जीवनशैलियां (All Lifestyles)</option>
            <option value="metro_flat">शहरी फ्लैट अनुकूल (Zero Smoke / Metro)</option>
            <option value="zero_cost">शून्य खर्च घरेलू (Zero Cost)</option>
            <option value="quick_5min">5 मिनट दैनिक (Quick 5-Min)</option>
          </select>
        </div>
      </div>

      {/* TAB CONTENT SECTIONS */}

      {/* 1. Herbal Roots (जड़ी-बूटी धारण) */}
      {(activeTab === 'all' || activeTab === 'roots') && (
        <section className="oj-card" style={{ marginBottom: '20px', padding: '20px' }}>
          <div style={{ marginBottom: '16px' }}>
            <h2 style={{ margin: '0 0 4px', fontSize: '18px', fontFamily: 'Cinzel, Playfair Display, serif', color: '#b45309' }}>
              ग्रह संबंधित वृक्षों की जड़ें (Planetary Herbal Roots — जड़ी-बूटी धारण)
            </h2>
            <p style={{ margin: 0, fontSize: '12.5px', color: 'var(--text-muted)' }}>
              वैदिक ज्योतिष में रत्नों से भी अधिक सौम्य, निर्दोष एवं अत्यंत किफायती विकल्प। जड़ें पृथ्वी तत्व से जुड़ी होने के कारण बिना किसी आकस्मिक झटके के ग्रहों की रश्मियों को शरीर में अवशोषित करती हैं।
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '14px' }}>
            {report.herbalRoots.map((root) => (
              <div
                key={root.planet}
                style={{
                  borderRadius: '12px',
                  padding: '14px',
                  border: root.isRecommended ? '2px solid #d97706' : '1px solid var(--border)',
                  background: root.isRecommended ? 'rgba(217, 119, 6, 0.06)' : 'var(--bg-elevated)',
                  boxShadow: root.isRecommended ? '0 4px 12px rgba(217, 119, 6, 0.15)' : 'none',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontFamily: 'Cinzel, Playfair Display, serif', fontWeight: 'bold', fontSize: '14px', color: 'var(--text)' }}>
                    {root.planetHi} ({root.planet})
                  </span>
                  {root.isRecommended && (
                    <span style={{ padding: '2px 8px', borderRadius: '9999px', fontSize: '10px', fontWeight: 'bold', background: '#b45309', color: '#ffffff', textTransform: 'uppercase' }}>
                      आपकी दशा/लग्न अनुकूल
                    </span>
                  )}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', fontSize: '12px' }}>
                  <div>
                    <span style={{ fontWeight: 'bold', color: '#b45309' }}>जड़ का नाम: </span>
                    <span style={{ fontWeight: '600' }}>{root.rootNameHi}</span>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>रत्न का विकल्प: </span>
                    <span>{root.gemstoneAlternativeHi}</span>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>धारण विधि: </span>
                    <span>{root.wrappingMethodHi}</span>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>शुभ समय: </span>
                    <span>{root.dayTimeHi}</span>
                  </div>
                  {root.isRecommended && (
                    <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px solid rgba(217, 119, 6, 0.2)', color: '#b45309', fontWeight: '600', fontSize: '11.5px' }}>
                      {root.reasonHi}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 2. Color Therapy (रंग चिकित्सा) */}
      {(activeTab === 'all' || activeTab === 'colors') && (
        <section className="oj-card" style={{ marginBottom: '20px', padding: '20px' }}>
          <div style={{ marginBottom: '16px' }}>
            <h2 style={{ margin: '0 0 4px', fontSize: '18px', fontFamily: 'Cinzel, Playfair Display, serif', color: '#b45309' }}>
              रंग चिकित्सा (Astro-Color Therapy — शुभ व वर्जित रंग)
            </h2>
            <p style={{ margin: 0, fontSize: '12.5px', color: 'var(--text-muted)' }}>
              नेत्रों द्वारा मस्तिष्क को मिलने वाले प्रकाश तरंगों का प्रभाव। शुभ रंगों का उपयोग आत्मविश्वास बढ़ाता है, जबकि वर्जित रंगों से मानसिक तनाव और रुकावटें पैदा होती हैं।
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            <div style={{ background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '14px', padding: '16px' }}>
              <h3 style={{ margin: '0 0 6px', fontWeight: 'bold', color: '#065f46', fontSize: '15px' }}>
                धारणीय व शुभ रंग (Recommended Colors)
              </h3>
              <p style={{ fontSize: '12px', color: '#047857', marginBottom: '10px' }}>
                आपके लग्न के परम कारक ग्रहों के अनुसार इन रंगों के वस्त्र, रुमाल अथवा आंतरिक वस्त्र पहनें:
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '10px' }}>
                {report.colorTherapy.favorableColorsHi.map((c, i) => (
                  <span
                    key={i}
                    style={{ padding: '4px 10px', background: '#ffffff', color: '#065f46', fontWeight: 'bold', fontSize: '11.5px', borderRadius: '9999px', border: '1px solid rgba(16, 185, 129, 0.4)', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)' }}
                  >
                    {c}
                  </span>
                ))}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text)', paddingTop: '8px', borderTop: '1px solid rgba(16, 185, 129, 0.2)' }}>
                <span style={{ fontWeight: 'bold', color: '#065f46' }}>दशा विशेष रंग: </span>
                {report.colorTherapy.dashaColorFocusHi}
              </div>
            </div>

            <div style={{ background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '14px', padding: '16px' }}>
              <h3 style={{ margin: '0 0 6px', fontWeight: 'bold', color: '#991b1b', fontSize: '15px' }}>
                वर्जित व त्याज्य रंग (Strictly Avoid Colors)
              </h3>
              <p style={{ fontSize: '12px', color: '#b91c1c', marginBottom: '10px' }}>
                आपकी कुंडली के मारक व बाधक ग्रहों के रंग; महत्वपूर्ण कार्यों, परीक्षाओं व साक्षात्कारों में इनसे बचें:
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '10px' }}>
                {report.colorTherapy.avoidColorsHi.map((c, i) => (
                  <span
                    key={i}
                    style={{ padding: '4px 10px', background: '#ffffff', color: '#991b1b', fontWeight: 'bold', fontSize: '11.5px', borderRadius: '9999px', border: '1px solid rgba(239, 68, 68, 0.4)', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)' }}
                  >
                    {c}
                  </span>
                ))}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text)', paddingTop: '8px', borderTop: '1px solid rgba(239, 68, 68, 0.2)' }}>
                {report.colorTherapy.practicalApplicationHi}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 3. Astro-Yoga & Pranayama */}
      {(activeTab === 'all' || activeTab === 'yoga') && (
        <section className="oj-card" style={{ marginBottom: '20px', padding: '20px' }}>
          <div style={{ marginBottom: '16px' }}>
            <h2 style={{ margin: '0 0 4px', fontSize: '18px', fontFamily: 'Cinzel, Playfair Display, serif', color: '#b45309' }}>
              योग एवं प्राणायाम परिहार (Astro-Yoga & Pranayama Alignment)
            </h2>
            <p style={{ margin: 0, fontSize: '12.5px', color: 'var(--text-muted)' }}>
              ग्रह केवल आकाश में नहीं, हमारे सूक्ष्म शरीर की 72,000 नाड़ियों और चक्रों में स्पंदित होते हैं। विशिष्ट आसन व प्राणायाम से दशा के नकारात्मक प्रभाव स्वतः विसर्जित हो जाते हैं।
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
            {report.astroYoga.map((yoga, idx) => (
              <div
                key={idx}
                style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: '12px', padding: '16px' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span style={{ fontWeight: 'bold', fontFamily: 'Cinzel, Playfair Display, serif', color: '#b45309', fontSize: '14px' }}>
                    सक्रिय दशा स्वामी ({yoga.planetTargeted}) हेतु यौगिक दिनचर्या
                  </span>
                  <span style={{ fontSize: '11px', background: 'rgba(217, 119, 6, 0.1)', color: '#b45309', padding: '3px 8px', borderRadius: '9999px', fontWeight: 'bold' }}>
                    {yoga.durationMinutes} मिनट नित्य
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px' }}>
                  <div>
                    <span style={{ fontWeight: 'bold', color: 'var(--text)', display: 'block', marginBottom: '2px' }}>सुझाए गए मुख्य आसन:</span>
                    <ul style={{ margin: 0, paddingLeft: '18px', color: 'var(--text-muted)' }}>
                      {yoga.asanasHi.map((a, i) => (
                        <li key={i}>{a}</li>
                      ))}
                    </ul>
                  </div>

                  <div style={{ paddingTop: '6px', borderTop: '1px solid var(--border)' }}>
                    <span style={{ fontWeight: 'bold', color: 'var(--text)', display: 'block', marginBottom: '2px' }}>संस्तुत प्राणायाम:</span>
                    <ul style={{ margin: 0, paddingLeft: '18px', color: 'var(--text-muted)' }}>
                      {yoga.pranayamaHi.map((p, i) => (
                        <li key={i}>{p}</li>
                      ))}
                    </ul>
                  </div>

                  <div style={{ paddingTop: '6px', borderTop: '1px solid var(--border)' }}>
                    <span style={{ fontWeight: 'bold' }}>शुभ समय: </span>
                    <span>{yoga.timingHi}</span>
                  </div>

                  <div style={{ background: 'rgba(217, 119, 6, 0.08)', padding: '8px 10px', borderRadius: '8px', border: '1px solid rgba(217, 119, 6, 0.2)', color: '#92400e', fontWeight: '500', fontSize: '11.5px' }}>
                    {yoga.therapeuticBenefitsHi}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 4. Kitchen & Household Totke */}
      {(activeTab === 'all' || activeTab === 'totke') && (
        <section className="oj-card" style={{ marginBottom: '20px', padding: '20px' }}>
          <div style={{ marginBottom: '16px' }}>
            <h2 style={{ margin: '0 0 4px', fontSize: '18px', fontFamily: 'Cinzel, Playfair Display, serif', color: '#b45309' }}>
              घरेलू व रसोई के सरल टोटके (Zero-Cost Kitchen & Household Upaya)
            </h2>
            <p style={{ margin: 0, fontSize: '12.5px', color: 'var(--text-muted)' }}>
              लाल किताब एवं लोक परंपरा के सिद्ध घरेलू उपाय, जिनमें किसी पुरोहित या धन की आवश्यकता नहीं है। आपकी अपनी रसोई की सामग्री ही औषधि व ग्रह-शांति का कार्य करती है।
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '14px' }}>
            {filteredTotke.map((totka, idx) => (
              <div
                key={idx}
                style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: '12px', padding: '14px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <h3 style={{ margin: 0, fontWeight: 'bold', fontSize: '13.5px', color: 'var(--text)' }}>
                      {totka.titleHi}
                    </h3>
                    <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '9999px', fontWeight: 'bold', background: 'var(--bg-subtle)', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                      {totka.lifestyleTag === 'zero_cost'
                        ? 'शून्य खर्च'
                        : totka.lifestyleTag === 'metro_friendly'
                        ? 'फ्लैट अनुकूल'
                        : 'नित्य 2 मिनट'}
                    </span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>
                    <div>
                      <span style={{ fontWeight: 'bold', color: 'var(--text)' }}>आवश्यक सामग्री: </span>
                      {totka.itemsNeededHi}
                    </div>
                    <div>
                      <span style={{ fontWeight: 'bold', color: 'var(--text)' }}>सरल विधि: </span>
                      {totka.stepByStepHi}
                    </div>
                  </div>
                </div>

                <div style={{ paddingTop: '8px', borderTop: '1px solid var(--border)', fontSize: '11px', color: '#b45309', fontWeight: '600' }}>
                  {totka.logicalAstroBasisHi}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 5. Classical Stotras & Paths */}
      {(activeTab === 'all' || activeTab === 'stotras') && (
        <section className="oj-card" style={{ marginBottom: '20px', padding: '20px' }}>
          <div style={{ marginBottom: '16px' }}>
            <h2 style={{ margin: '0 0 4px', fontSize: '18px', fontFamily: 'Cinzel, Playfair Display, serif', color: '#b45309' }}>
              संकट एवं समस्या अनुसार शास्त्रीय स्तोत्र व पाठ (Problem-Specific Stotras)
            </h2>
            <p style={{ margin: 0, fontSize: '12.5px', color: 'var(--text-muted)' }}>
              ऋषि-प्रणीत सिद्ध स्तोत्र जो व्यक्ति के जीवन के विशिष्ट संकटों (ऋण, साढ़े साती, रोग, संतान, मुकदमा) में ढाल बनकर रक्षा करते हैं।
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '14px' }}>
            {filteredStotras.map((stotra, idx) => (
              <div
                key={idx}
                style={{ background: 'rgba(217, 119, 6, 0.04)', border: '1px solid rgba(217, 119, 6, 0.25)', borderRadius: '12px', padding: '16px' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <h3 style={{ margin: 0, fontWeight: 'bold', fontFamily: 'Cinzel, Playfair Display, serif', fontSize: '15px', color: '#92400e' }}>
                    {stotra.stotraNameHi}
                  </h3>
                  <span
                    style={{
                      fontSize: '10px',
                      padding: '2px 8px',
                      borderRadius: '9999px',
                      fontWeight: 'bold',
                      background: stotra.urgencyLevel === 'high' ? '#dc2626' : '#d97706',
                      color: '#ffffff',
                    }}
                  >
                    {stotra.urgencyLevel === 'high' ? 'अति आवश्यक' : 'नियमित पाठ'}
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12px' }}>
                  <div>
                    <span style={{ fontWeight: 'bold' }}>आराध्य देवता: </span>
                    <span style={{ color: '#b45309', fontWeight: '600' }}>{stotra.keyDeity}</span>
                  </div>
                  <div>
                    <span style={{ fontWeight: 'bold' }}>पाठ समय: </span>
                    <span>{stotra.bestDayTimingHi} ({stotra.recommendedCount})</span>
                  </div>
                  <div style={{ background: 'var(--bg-elevated)', padding: '8px', borderRadius: '8px', border: '1px solid rgba(217, 119, 6, 0.2)', textAlign: 'center', fontFamily: 'Cinzel, serif', fontSize: '12px', color: '#b45309', fontStyle: 'italic' }}>
                    {stotra.sampleSanskritVerse}
                  </div>
                  <div style={{ fontSize: '11.5px', color: 'var(--text)', fontWeight: '500' }}>
                    {stotra.meaningHi}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 6. Ishta Devata Sadhana */}
      {(activeTab === 'all' || activeTab === 'ishta') && (
        <section className="oj-card" style={{ marginBottom: '20px', padding: '20px' }}>
          <div style={{ marginBottom: '16px' }}>
            <h2 style={{ margin: '0 0 4px', fontSize: '18px', fontFamily: 'Cinzel, Playfair Display, serif', color: '#b45309' }}>
              इष्ट देव मोक्ष साधना (D9 कारकांश से 12वें भाव के देवता)
            </h2>
            <p style={{ margin: 0, fontSize: '12.5px', color: 'var(--text-muted)' }}>
              जैमिनी उपदेश सूत्रों के अनुसार आत्मा का सच्चा उद्धार व जन्म-जन्मांतर के प्रारब्ध का मोचन केवल अपने इष्ट देव के मंत्र जप से ही संभव है।
            </p>
          </div>

          <div style={{ background: 'linear-gradient(135deg, rgba(217, 119, 6, 0.08) 0%, rgba(245, 158, 11, 0.04) 100%)', border: '1px solid rgba(217, 119, 6, 0.3)', borderRadius: '14px', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '12px' }}>
              <div>
                <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#b45309', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block' }}>
                  आपके जन्मकालिक इष्ट देव
                </span>
                <h3 style={{ margin: 0, fontSize: '22px', fontFamily: 'Cinzel, Playfair Display, serif', color: 'var(--text)' }}>
                  {report.ishtaDevata.deityNameHi}
                </h3>
              </div>
              <div style={{ background: '#b45309', color: '#ffffff', padding: '5px 12px', borderRadius: '9999px', fontSize: '12px', fontWeight: 'bold' }}>
                नित्य 108 जप अनिवार्य
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12.5px' }}>
              <div style={{ background: 'var(--bg-elevated)', padding: '14px', borderRadius: '10px', border: '1px solid rgba(217, 119, 6, 0.25)', textAlign: 'center' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>सिद्ध मूल मंत्र</span>
                <span style={{ fontSize: '17px', fontFamily: 'Cinzel, serif', fontWeight: 'bold', color: '#b45309' }}>
                  {report.ishtaDevata.moolaMantra}
                </span>
              </div>

              <div>
                <span style={{ fontWeight: 'bold' }}>शास्त्रीय आधार (जैमिनी सिद्धांत): </span>
                <p style={{ margin: '4px 0 0', color: 'var(--text-muted)', fontSize: '12px', lineHeight: '1.5' }}>
                  {report.ishtaDevata.classicalBasisHi}
                </p>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', paddingTop: '8px', borderTop: '1px solid rgba(217, 119, 6, 0.2)', fontSize: '12px' }}>
                <div>
                  <span style={{ fontWeight: 'bold' }}>जप संख्या: </span>
                  <span>{report.ishtaDevata.recitationCount}</span>
                </div>
                <div>
                  <span style={{ fontWeight: 'bold' }}>प्रिय नैवेद्य/भोग: </span>
                  <span>{report.ishtaDevata.offeringHi}</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 7. Herbal Planetary Astro-Baths (स्नान परिहार) */}
      {(activeTab === 'all' || activeTab === 'bath') && (
        <section className="oj-card" style={{ marginBottom: '20px', padding: '20px' }}>
          <div style={{ marginBottom: '16px' }}>
            <h2 style={{ margin: '0 0 4px', fontSize: '18px', fontFamily: 'Cinzel, Playfair Display, serif', color: '#b45309' }}>
              औषधि स्नान परिहार (Herbal Planetary Astro-Baths)
            </h2>
            <p style={{ margin: 0, fontSize: '12.5px', color: 'var(--text-muted)' }}>
              शरीर के बाह्य आभामंडल (Aura) पर जमी हुई नकारात्मक तरंगों को जल एवं प्राकृतिक औषधियों के संयोग से शुद्ध करने का प्राचीन विधान।
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
            {report.herbalBaths.map((bath, idx) => (
              <div
                key={idx}
                style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: '12px', padding: '14px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
              >
                <div>
                  <span style={{ fontFamily: 'Cinzel, Playfair Display, serif', fontWeight: 'bold', color: '#b45309', fontSize: '14px', display: 'block', marginBottom: '8px' }}>
                    {bath.dayOfWeekHi} ({bath.planet})
                  </span>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '12px', color: 'var(--text-muted)' }}>
                    <div>
                      <span style={{ fontWeight: 'bold', color: 'var(--text)' }}>सामग्री: </span>
                      {bath.herbalIngredientsHi.join(', ')}
                    </div>
                    <div>
                      <span style={{ fontWeight: 'bold', color: 'var(--text)' }}>विधि: </span>
                      {bath.methodHi}
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: '10px', paddingTop: '8px', borderTop: '1px solid var(--border)', fontSize: '11px', color: '#065f46', fontWeight: 'bold' }}>
                  {bath.benefitsHi}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 8. Printable Prescription Slip */}
      {(activeTab === 'all' || activeTab === 'prescription') && (
        <section
          className="oj-card printable-prescription"
          style={{
            border: '2px solid #b45309',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 8px 24px rgba(180, 83, 9, 0.12)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '14px', marginBottom: '16px', borderBottom: '1px solid var(--border)', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 'bold', color: '#b45309' }}>
                AV Astro Vibe Holistic Vedic Prescription
              </span>
              <h2 style={{ margin: '2px 0 0', fontSize: '22px', fontFamily: 'Cinzel, Playfair Display, serif', color: 'var(--text)' }}>
                वैदिक उपचार परामर्श पर्ची (Remedy Prescription)
              </h2>
            </div>
            <button
              type="button"
              onClick={handlePrintSlip}
              className="oj-action-btn primary"
            >
              प्रिंट / सुरक्षित करें
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px', marginBottom: '16px' }}>
            <div style={{ background: 'var(--bg-subtle)', padding: '10px 14px', borderRadius: '10px' }}>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block' }}>जातक का नाम:</span>
              <span style={{ fontWeight: 'bold', fontSize: '15px' }}>{report.prescriptionSlip.clientName}</span>
            </div>
            <div style={{ background: 'var(--bg-subtle)', padding: '10px 14px', borderRadius: '10px' }}>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block' }}>सक्रिय दशा व स्थिति:</span>
              <span style={{ fontWeight: 'bold', fontSize: '15px' }}>{report.prescriptionSlip.activeDasha}</span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12.5px' }}>
            <div style={{ padding: '10px 14px', background: 'rgba(217, 119, 6, 0.06)', borderRadius: '10px', border: '1px solid rgba(217, 119, 6, 0.2)' }}>
              <span style={{ fontWeight: 'bold', color: '#b45309', display: 'block', marginBottom: '2px' }}>1. प्रधान जड़ी-बूटी धारण:</span>
              <span>{report.prescriptionSlip.primaryRoot}</span>
            </div>

            <div style={{ padding: '10px 14px', background: 'var(--bg-elevated)', borderRadius: '10px', border: '1px solid var(--border)' }}>
              <span style={{ fontWeight: 'bold', color: 'var(--text)', display: 'block', marginBottom: '2px' }}>2. वर्ण व रंग नियम:</span>
              <span>{report.prescriptionSlip.primaryColorRule}</span>
            </div>

            <div style={{ padding: '10px 14px', background: 'var(--bg-elevated)', borderRadius: '10px', border: '1px solid var(--border)' }}>
              <span style={{ fontWeight: 'bold', color: 'var(--text)', display: 'block', marginBottom: '2px' }}>3. नित्य स्तोत्र एवं मंत्र पाठ:</span>
              <span>{report.prescriptionSlip.coreDailyStotra}</span>
            </div>

            <div style={{ padding: '10px 14px', background: 'var(--bg-elevated)', borderRadius: '10px', border: '1px solid var(--border)' }}>
              <span style={{ fontWeight: 'bold', color: 'var(--text)', display: 'block', marginBottom: '2px' }}>4. घरेलू व जल परिहार:</span>
              <span>{report.prescriptionSlip.kitchenZeroCostHabit}</span>
            </div>

            <div style={{ padding: '10px 14px', background: 'var(--bg-elevated)', borderRadius: '10px', border: '1px solid var(--border)' }}>
              <span style={{ fontWeight: 'bold', color: 'var(--text)', display: 'block', marginBottom: '2px' }}>5. आहार एवं सात्विक नियम:</span>
              <span>{report.prescriptionSlip.dietaryTip}</span>
            </div>
          </div>

          <div style={{ marginTop: '16px', paddingTop: '14px', borderTop: '1px solid var(--border)', fontSize: '12px', fontStyle: 'italic', color: 'var(--text-muted)', background: 'rgba(217, 119, 6, 0.04)', padding: '12px 16px', borderRadius: '10px' }}>
            <span style={{ fontWeight: 'bold', color: '#b45309', fontStyle: 'normal', display: 'block', marginBottom: '3px' }}>ज्योतिषीय परामर्श व मार्गदर्शन:</span>
            {report.prescriptionSlip.astrologerCounselHi}
          </div>
        </section>
      )}
    </div>
  );
};

export default HolisticRemediesView;
