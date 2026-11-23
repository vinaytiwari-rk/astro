import React, { useState, useMemo } from 'react';
import { computeMedicalAstrology } from '../../astro/medicalAstrology';
import { computeLalKitabFull } from '../../astro/lalKitabFull';
import { computeComprehensiveChikitsaReport } from '../../astro/predictions/medicalAstrologyEngine';
import type { ChartData } from '../../astro/types';
import { useLanguage } from '../../i18n/LanguageContext';
import { trPlanet, trSign } from '../../i18n/translations';

interface MedicalAstrologyViewProps {
  chart: ChartData;
}

type MedicalTab = 'tridosha' | 'systems' | 'classicalDiseases' | 'progeny' | 'critical' | 'lalkitab';

export const MedicalAstrologyView: React.FC<MedicalAstrologyViewProps> = ({ chart }) => {
  const { lang } = useLanguage();
  const isHi = lang === 'hi';

  const [activeTab, setActiveTab] = useState<MedicalTab>('tridosha');

  const medReport = useMemo(() => computeMedicalAstrology(chart), [chart]);
  const lkReport = useMemo(() => computeLalKitabFull(chart), [chart]);
  const chikitsa = useMemo(() => computeComprehensiveChikitsaReport(chart), [chart]);

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '22px', fontWeight: 700, color: 'var(--text)' }}>
            {isHi ? 'चिकित्सा ज्योतिष (रोग निर्णय) एवं लाल किताब उपाय' : 'Medical Astrology (Roga Nirnaya) & Lal Kitab Upaya'}
          </h2>
          <p style={{ margin: '4px 0 0', fontSize: '13px', color: 'var(--text-muted)' }}>
            {isHi
              ? 'आयुर्वेदिक त्रिदोष प्रकृति, 12 कालपुरुष अंग संस्थान, 22वां द्रेष्काण, 64वां नवांश एवं लाल किताब सोए हुए ग्रह'
              : 'Ayurvedic Tridosha Constitution, 12 Kalapurusha Body Systems, 22nd Drekkana, 64th Navamsha & Lal Kitab Sleeping Planets'}
          </p>
        </div>

        {/* Tab Pills */}
        <div className="oj-tab-pills-row">
          <button
            type="button"
            onClick={() => setActiveTab('tridosha')}
            className={`oj-tab-pill ${activeTab === 'tridosha' ? 'is-active' : ''}`}
          >
            {isHi ? 'त्रिदोष संतुलन' : 'Tridosha Balance'}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('systems')}
            className={`oj-tab-pill ${activeTab === 'systems' ? 'is-active' : ''}`}
          >
            {isHi ? 'अंग संस्थान (12 भाव)' : 'Body Systems (12 Bhavas)'}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('classicalDiseases')}
            className={`oj-tab-pill ${activeTab === 'classicalDiseases' ? 'is-active' : ''}`}
          >
            {isHi ? 'शास्त्रीय रोग निर्णय (6 व्याधियां)' : 'Disease Diagnosis (6 Profiles)'}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('progeny')}
            className={`oj-tab-pill ${activeTab === 'progeny' ? 'is-active' : ''}`}
          >
            {isHi ? 'संतान बाधा व कुल वृद्धि' : 'Progeny & Lineage'}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('critical')}
            className={`oj-tab-pill ${activeTab === 'critical' ? 'is-active' : ''}`}
          >
            {isHi ? '22वां द्रेष्काण व 64वां नवांश' : '22nd Drekkana & 64th Navamsha'}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('lalkitab')}
            className={`oj-tab-pill ${activeTab === 'lalkitab' ? 'is-active' : ''}`}
          >
            {isHi ? 'लाल किताब फरमान व तेवा' : 'Lal Kitab Farman & Teva'}
          </button>
        </div>
      </div>

      {/* Tab 1: Tridosha Balance */}
      {activeTab === 'tridosha' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ background: 'var(--bg-elevated)', borderRadius: '10px', border: '1px solid var(--border)', padding: '24px' }}>
            <h3 style={{ margin: '0 0 16px', fontSize: '18px', color: 'var(--text)' }}>
              {isHi
                ? `प्रकृति मूल्यांकन: प्रधान दोष — ${medReport.tridosha.dominantDosha}`
                : `Prakriti Assessment: Dominant Dosha — ${medReport.tridosha.dominantDosha}`}
            </h3>

            {/* Dosha Progress Bars */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
                  <span>{isHi ? 'वात (वायु व आकाश): तंत्रिका तंत्र, श्वास, गतिशीलता' : 'Vata (Air & Space): Nervous system, breath, mobility'}</span>
                  <span style={{ color: '#2563eb' }}>{medReport.tridosha.vataPercent}%</span>
                </div>
                <div style={{ width: '100%', height: '10px', background: 'var(--bg-subtle)', borderRadius: '5px', overflow: 'hidden' }}>
                  <div style={{ width: `${medReport.tridosha.vataPercent}%`, height: '100%', background: '#2563eb' }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
                  <span>{isHi ? 'पित्त (अग्नि व जल): पाचन, चयापचय, शारीरिक ताप' : 'Pitta (Fire & Water): Digestion, metabolism, body heat'}</span>
                  <span style={{ color: '#dc2626' }}>{medReport.tridosha.pittaPercent}%</span>
                </div>
                <div style={{ width: '100%', height: '10px', background: 'var(--bg-subtle)', borderRadius: '5px', overflow: 'hidden' }}>
                  <div style={{ width: `${medReport.tridosha.pittaPercent}%`, height: '100%', background: '#dc2626' }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
                  <span>{isHi ? 'कफ (पृथ्वी व जल): शारीरिक संरचना, रोग प्रतिरोधकता' : 'Kapha (Earth & Water): Structure, immunity, stability'}</span>
                  <span style={{ color: '#059669' }}>{medReport.tridosha.kaphaPercent}%</span>
                </div>
                <div style={{ width: '100%', height: '10px', background: 'var(--bg-subtle)', borderRadius: '5px', overflow: 'hidden' }}>
                  <div style={{ width: `${medReport.tridosha.kaphaPercent}%`, height: '100%', background: '#059669' }} />
                </div>
              </div>
            </div>

            {/* Overall Summary Card */}
            <div style={{ padding: '16px', borderRadius: '8px', background: 'rgba(180, 83, 9, 0.08)', border: '1px solid rgba(180, 83, 9, 0.25)', marginBottom: '16px' }}>
              <div style={{ fontSize: '13.5px', lineHeight: 1.6, color: 'var(--text)' }}>
                {isHi ? medReport.overallSummaryHi : medReport.overallSummaryEn}
              </div>
            </div>

            {/* Recommendations */}
            <h4 style={{ margin: '16px 0 10px', fontSize: '14px', color: 'var(--text)' }}>
              {isHi ? 'आयुर्वेदिक दिनचर्या एवं आहार दिशानिर्देश:' : 'Ayurvedic Lifestyle & Dietary Guidelines:'}
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {medReport.tridosha.recommendations.map((rec, idx) => (
                <div key={idx} style={{ fontSize: '13px', color: 'var(--text)', display: 'flex', gap: '8px' }}>
                  <span style={{ color: 'var(--accent)' }}>•</span>
                  <span>{rec}</span>
                </div>
              ))}
            </div>

            {/* Charaka & Sushruta Lifestyle Synthesis */}
            <div style={{ marginTop: '16px', padding: '14px', borderRadius: '8px', background: 'var(--bg-subtle)', border: '1px solid var(--border)' }}>
              <div style={{ fontWeight: 700, fontSize: '13px', color: 'var(--accent)', marginBottom: '4px' }}>
                {isHi ? 'चरक व सुश्रुत संहिता सम्मत जीवनशैली निर्देश:' : 'Charaka & Sushruta Lifestyle Counsel:'}
              </div>
              <div style={{ fontSize: '12.5px', lineHeight: 1.55, color: 'var(--text)' }}>
                {isHi ? chikitsa.constitutionalAdviceHi : chikitsa.constitutionalAdviceEn}
              </div>
            </div>

            {/* Critical Health Phases */}
            <div style={{ marginTop: '12px', padding: '14px', borderRadius: '8px', background: 'rgba(217, 119, 6, 0.08)', borderLeft: '4px solid #d97706' }}>
              <div style={{ fontWeight: 700, fontSize: '13px', color: '#b45309', marginBottom: '6px' }}>
                {isHi ? 'दशा व गोचर में स्वास्थ्य संवेदनशीलता चरण:' : 'Critical Health Dasha & Transit Phases:'}
              </div>
              <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '12.5px', lineHeight: 1.5, color: 'var(--text)' }}>
                {(isHi ? chikitsa.criticalHealthPhasesHi : chikitsa.criticalHealthPhasesEn).map((phase, pIdx) => (
                  <li key={pIdx} style={{ marginBottom: '4px' }}>{phase}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: 12 Body Systems */}
      {activeTab === 'systems' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
          {medReport.bodySystems.map((sys) => {
            const levelLabel =
              sys.afflictionLevel === 'Healthy'
                ? isHi ? 'स्वस्थ' : 'Healthy'
                : sys.afflictionLevel === 'Mild'
                  ? isHi ? 'हल्का' : 'Mild'
                  : sys.afflictionLevel === 'Moderate'
                    ? isHi ? 'मध्यम' : 'Moderate'
                    : isHi ? 'गंभीर' : 'Critical';

            return (
              <div
                key={sys.houseNumber}
                style={{
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text)' }}>
                    {isHi ? `${sys.houseNumber}वां भाव (${trSign(sys.signIndex, lang)})` : `House ${sys.houseNumber} (${sys.signName})`}
                  </span>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: '4px',
                      background:
                        sys.afflictionLevel === 'Healthy'
                          ? 'rgba(5, 150, 105, 0.12)'
                          : sys.afflictionLevel === 'Mild'
                            ? 'rgba(37, 99, 235, 0.12)'
                            : sys.afflictionLevel === 'Moderate'
                              ? 'rgba(217, 119, 6, 0.12)'
                              : 'rgba(220, 38, 38, 0.12)',
                      color:
                        sys.afflictionLevel === 'Healthy'
                          ? '#059669'
                          : sys.afflictionLevel === 'Mild'
                            ? '#2563eb'
                            : sys.afflictionLevel === 'Moderate'
                              ? '#d97706'
                              : '#dc2626',
                    }}
                  >
                    {levelLabel} ({sys.afflictionScore}/100)
                  </span>
                </div>
                <div style={{ fontSize: '12.5px', color: 'var(--accent)', fontWeight: 600 }}>
                  {isHi ? sys.bodyPartsHindi.join(', ') : sys.bodyParts.join(', ')}
                </div>
                <div style={{ borderTop: '1px dashed var(--border)', paddingTop: '6px', fontSize: '12px', color: 'var(--text-muted)' }}>
                  {isHi ? 'स्थित ग्रह:' : 'Occupants:'}{' '}
                  <strong>
                    {sys.planetsInHouse.length > 0
                      ? sys.planetsInHouse.map((p) => trPlanet(p, lang)).join(', ')
                      : (isHi ? 'रिक्त भाव' : 'None (Empty House)')}
                  </strong>
                </div>
                {sys.afflictionNotes.length > 0 && (
                  <div style={{ fontSize: '11.5px', color: 'var(--text)', background: 'var(--bg-subtle)', padding: '6px 8px', borderRadius: '4px' }}>
                    {sys.afflictionNotes.join(' · ')}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Tab: Classical Diseases Diagnosis (6 Profiles) */}
      {activeTab === 'classicalDiseases' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ padding: '16px', borderRadius: '8px', background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
            <h3 style={{ margin: '0 0 6px', fontSize: '17px', color: 'var(--text)' }}>
              {isHi
                ? 'शास्त्रीय रोग निर्णय एवं पैथोलॉजिकल संवेदनशीलता (चरक, सुश्रुत, यवनजातक)'
                : 'Classical Disease Diagnosis & Pathological Vulnerability Profiles'}
            </h3>
            <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              {isHi
                ? '६ठे, ८वें व १२वें भाव, कालपुरुष अंग संस्थान, सूर्य/चंद्र/शनि/मंगल की स्थिति एवं त्रिदोष विकृति पर आधारित रोग मूल्यांकन।'
                : 'Diagnostic assessment of 6, 8, 12 bhavas, Kalapurusha body chakras, and planetary afflictions from ancient treatises.'}
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '16px' }}>
            {chikitsa.diseaseAlerts.map((disease) => {
              const borderCol =
                disease.severity === 'Alert'
                  ? '#dc2626'
                  : disease.severity === 'Moderate'
                    ? '#d97706'
                    : disease.severity === 'Mild'
                      ? '#2563eb'
                      : '#16a34a';

              return (
                <div
                  key={disease.category}
                  style={{
                    background: 'var(--bg-elevated)',
                    borderRadius: '10px',
                    border: '1px solid var(--border)',
                    borderLeft: `4px solid ${borderCol}`,
                    padding: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '6px' }}>
                    <div style={{ fontWeight: 700, fontSize: '14.5px', color: 'var(--text)' }}>
                      {isHi ? disease.diseaseNameHi : disease.diseaseNameEn}
                    </div>
                    <span
                      className={`tag ${
                        disease.severity === 'Alert'
                          ? 'tag-retro'
                          : disease.severity === 'Moderate'
                            ? 'tag-special'
                            : disease.severity === 'Mild'
                              ? 'tag-accent'
                              : 'tag-varg'
                      }`}
                      style={{ fontSize: '11px', fontWeight: 700 }}
                    >
                      {disease.severity === 'Alert'
                        ? (isHi ? 'सतर्कता अपेक्षित (Alert)' : 'High Vigilance')
                        : disease.severity === 'Moderate'
                          ? (isHi ? 'मध्यम संवेदनशीलता' : 'Moderate Care')
                          : disease.severity === 'Mild'
                            ? (isHi ? 'हल्की संवेदनशीलता' : 'Mild Sensitivity')
                            : (isHi ? 'सुरक्षित (Safe)' : 'Safe Profile')}
                    </span>
                  </div>

                  <div>
                    <div style={{ fontSize: '11.5px', fontWeight: 650, color: 'var(--text-muted)', marginBottom: '4px' }}>
                      {isHi ? 'ज्योतिषीय कारक व भाव योग:' : 'Astrological Combinations & Planetary Causes:'}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text)', background: 'var(--bg-subtle)', padding: '8px', borderRadius: '6px' }}>
                      {(isHi ? disease.planetaryCausesHi : disease.planetaryCausesEn).join(' · ')}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '11.5px', fontWeight: 650, color: 'var(--text-muted)', marginBottom: '4px' }}>
                      {isHi ? 'बचाव व नैदानिक दिशानिर्देश:' : 'Preventive Clinical Guidelines:'}
                    </div>
                    <div style={{ fontSize: '12.5px', lineHeight: 1.45, color: 'var(--text)' }}>
                      {isHi ? disease.preventiveGuidelinesHi : disease.preventiveGuidelinesEn}
                    </div>
                  </div>

                  <div style={{ borderTop: '1px solid var(--border)', paddingTop: '8px' }}>
                    <div style={{ fontSize: '11.5px', fontWeight: 650, color: '#059669', marginBottom: '2px' }}>
                      {isHi ? 'आयुर्वेदिक एवं वैदिक निवारण उपाय:' : 'Ayurvedic & Vedic Remedies:'}
                    </div>
                    <div style={{ fontSize: '12px', color: '#059669', fontWeight: 500 }}>
                      {isHi ? disease.ayurvedicUpayaHi : disease.ayurvedicUpayaEn}
                    </div>
                  </div>

                  <div style={{ fontSize: '10.5px', color: 'var(--text-muted)', fontStyle: 'italic', textAlign: 'right' }}>
                    {disease.classicalSource}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Holistic Chikitsa Upayas */}
          <div style={{ background: 'var(--bg-elevated)', borderRadius: '10px', border: '1px solid var(--border)', padding: '20px' }}>
            <h4 style={{ margin: '0 0 12px', fontSize: '15px', color: 'var(--accent)' }}>
              {isHi ? 'समग्र आयुर्वेदिक व वैदिक स्वास्थ्य रक्षा उपाय (चरक सूत्र):' : 'Holistic Ayurvedic & Vedic Wellness Upayas:'}
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '10px' }}>
              {(isHi ? chikitsa.holisticChikitsaUpayaHi : chikitsa.holisticChikitsaUpayaEn).map((upaya, uIdx) => (
                <div key={uIdx} style={{ padding: '10px 12px', borderRadius: '6px', background: 'var(--bg-subtle)', border: '1px solid var(--border)', fontSize: '12px', lineHeight: 1.45 }}>
                  <span style={{ color: 'var(--accent)', fontWeight: 700, marginRight: '6px' }}>{uIdx + 1}.</span>
                  <span>{upaya}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab: Progeny & Lineage Diagnostics */}
      {activeTab === 'progeny' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ padding: '16px', borderRadius: '8px', background: 'var(--bg-elevated)', border: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                {isHi ? 'शास्त्रीय संतान सुख व कुल वृद्धि निर्णय' : 'Classical Progeny Promise & Lineage Diagnostics'}
              </div>
              <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--accent)', marginTop: '2px' }}>
                {isHi ? chikitsa.progenyDiagnostic.overallPromiseHi : chikitsa.progenyDiagnostic.overallPromise}
              </div>
            </div>
            <span
              className={`tag ${
                chikitsa.progenyDiagnostic.overallPromise.includes('Auspicious')
                  ? 'tag-varg'
                  : 'tag-retro'
              }`}
              style={{ fontSize: '12px', fontWeight: 700, padding: '4px 12px' }}
            >
              {isHi ? 'बृहत पराशर होरा शास्त्र' : 'BPHS Santan Adhyaya'}
            </span>
          </div>

          {/* Planetary Diagnostics Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
            <div style={{ padding: '16px', borderRadius: '8px', background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                {isHi ? 'पंचम भाव स्वामी (पंचमेश)' : '5th House Lord (Panchamesha)'}
              </div>
              <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text)', margin: '4px 0' }}>
                {chikitsa.progenyDiagnostic.fifthHouseLord}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                {isHi ? `भाव ${chikitsa.progenyDiagnostic.fifthHousePlaced} में स्थित` : `Placed in House ${chikitsa.progenyDiagnostic.fifthHousePlaced}`} · {chikitsa.progenyDiagnostic.fifthLordDignity}
              </div>
            </div>

            <div style={{ padding: '16px', borderRadius: '8px', background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                {isHi ? 'पुत्रकारक नैसर्गिक गुरु' : 'Natural Putrakaraka Jupiter'}
              </div>
              <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text)', margin: '4px 0' }}>
                Jupiter (बृहस्पति)
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                {isHi ? 'गरिमा स्थिति:' : 'Dignity:'} {chikitsa.progenyDiagnostic.putrakarakaJupiterDignity}
              </div>
            </div>

            <div style={{ padding: '16px', borderRadius: '8px', background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                {isHi ? 'सर्प/नाग दोष परीक्षण' : 'Naga / Sarpa Dosha Audit'}
              </div>
              <div style={{ fontSize: '16px', fontWeight: 700, color: chikitsa.progenyDiagnostic.hasNagaSarpaDosha ? '#dc2626' : '#16a34a', margin: '4px 0' }}>
                {chikitsa.progenyDiagnostic.hasNagaSarpaDosha ? (isHi ? 'नाग दोष उपस्थित' : 'Naga Dosha Present') : (isHi ? 'दोष मुक्त' : 'Clean Axis')}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                {isHi ? 'राहु/केतु अक्ष परीक्षण' : 'Nodal 5th house evaluation'}
              </div>
            </div>

            <div style={{ padding: '16px', borderRadius: '8px', background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                {isHi ? 'पितृ ऋण / वंश बाधा' : 'Pitru Rin / Ancestral Lineage'}
              </div>
              <div style={{ fontSize: '16px', fontWeight: 700, color: chikitsa.progenyDiagnostic.hasPitruDoshaInProgeny ? '#d97706' : '#16a34a', margin: '4px 0' }}>
                {chikitsa.progenyDiagnostic.hasPitruDoshaInProgeny ? (isHi ? 'पितृ दोष प्रभाव' : 'Pitru Dosha Influence') : (isHi ? 'पितृ कृपा' : 'Ancestral Grace')}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                {isHi ? 'सूर्य व नवमेश परीक्षण' : 'Solar & 9th lord evaluation'}
              </div>
            </div>
          </div>

          {/* Dosha Detailed Notifications if present */}
          {(chikitsa.progenyDiagnostic.hasNagaSarpaDosha || chikitsa.progenyDiagnostic.hasPitruDoshaInProgeny) && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {chikitsa.progenyDiagnostic.hasNagaSarpaDosha && (
                <div style={{ padding: '14px', borderRadius: '8px', background: 'rgba(220, 38, 38, 0.08)', borderLeft: '4px solid #dc2626' }}>
                  <div style={{ fontWeight: 700, fontSize: '13.5px', color: '#dc2626', marginBottom: '4px' }}>
                    {isHi ? 'पंचम भाव नाग दोष निदान:' : 'Naga Dosha Diagnostic Detail:'}
                  </div>
                  <div style={{ fontSize: '12.5px', lineHeight: 1.5, color: 'var(--text)' }}>
                    {isHi ? chikitsa.progenyDiagnostic.nagaDoshaDetailsHi : chikitsa.progenyDiagnostic.nagaDoshaDetailsEn}
                  </div>
                </div>
              )}
              {chikitsa.progenyDiagnostic.hasPitruDoshaInProgeny && (
                <div style={{ padding: '14px', borderRadius: '8px', background: 'rgba(217, 119, 6, 0.08)', borderLeft: '4px solid #d97706' }}>
                  <div style={{ fontWeight: 700, fontSize: '13.5px', color: '#b45309', marginBottom: '4px' }}>
                    {isHi ? 'पितृ ऋण व वंश शांति निर्देश:' : 'Pitru Rin & Lineage Guidance:'}
                  </div>
                  <div style={{ fontSize: '12.5px', lineHeight: 1.5, color: 'var(--text)' }}>
                    {isHi ? chikitsa.progenyDiagnostic.pitruDoshaDetailsHi : chikitsa.progenyDiagnostic.pitruDoshaDetailsEn}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Timing Prediction */}
          <div style={{ padding: '16px', borderRadius: '8px', background: 'rgba(37, 99, 235, 0.08)', borderLeft: '4px solid #2563eb' }}>
            <div style={{ fontWeight: 700, fontSize: '13.5px', color: '#2563eb', marginBottom: '6px' }}>
              {isHi ? 'संतान प्राप्ति का शास्त्रीय समय-सीमा निर्धारण (Timing of Progeny):' : 'Classical Progeny Timing Window:'}
            </div>
            <p style={{ margin: 0, fontSize: '13px', lineHeight: 1.6, color: 'var(--text)' }}>
              {isHi ? chikitsa.progenyDiagnostic.timingPredictionHi : chikitsa.progenyDiagnostic.timingPredictionEn}
            </p>
          </div>

          {/* Authentic Santana Gopala & Vedic Upayas */}
          <div style={{ background: 'var(--bg-elevated)', borderRadius: '10px', border: '1px solid var(--border)', padding: '20px' }}>
            <h4 style={{ margin: '0 0 12px', fontSize: '15px', color: 'var(--text)' }}>
              {isHi ? 'शास्त्रीय संतान गोपाल स्तोत्र एवं अचूक वैदिक उपाय:' : 'Authentic Santana Gopala & Vedic Remedies:'}
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {(isHi ? chikitsa.progenyDiagnostic.vedicRemediesHi : chikitsa.progenyDiagnostic.vedicRemediesEn).map((rem, rIdx) => (
                <div key={rIdx} style={{ display: 'flex', gap: '8px', fontSize: '12.5px', lineHeight: 1.5, color: 'var(--text)' }}>
                  <span style={{ color: '#059669', fontWeight: 700 }}>•</span>
                  <span>{rem}</span>
                </div>
              ))}
            </div>
            <div style={{ marginTop: '12px', fontSize: '11px', color: 'var(--text-muted)', fontStyle: 'italic', textAlign: 'right' }}>
              {isHi ? 'शास्त्रीय स्रोत: ' : 'Classical Source: '}
              {chikitsa.progenyDiagnostic.classicalSource}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Critical Points */}
      {activeTab === 'critical' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            <div style={{ padding: '20px', borderRadius: '10px', background: 'var(--bg-elevated)', border: '1.5px solid var(--accent)' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                {isHi ? '22वां द्रेष्काण स्वामी (खरेश)' : '22nd Drekkana Lord (Kharesh)'}
              </div>
              <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text)', margin: '6px 0' }}>
                {trPlanet(medReport.criticalPoints.drekkana22Lord, lang)}
              </div>
              <div style={{ fontSize: '12.5px', color: 'var(--accent)' }}>
                {isHi ? 'राशि:' : 'Sign:'} {medReport.criticalPoints.drekkana22SignName}
              </div>
            </div>

            <div style={{ padding: '20px', borderRadius: '10px', background: 'var(--bg-elevated)', border: '1.5px solid var(--accent)' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                {isHi ? '64वां नवांश स्वामी (छंद)' : '64th Navamsha Lord (Chhanda)'}
              </div>
              <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text)', margin: '6px 0' }}>
                {trPlanet(medReport.criticalPoints.navamsha64Lord, lang)}
              </div>
              <div style={{ fontSize: '12.5px', color: 'var(--accent)' }}>
                {isHi ? 'राशि:' : 'Sign:'} {medReport.criticalPoints.navamsha64SignName}
              </div>
            </div>
          </div>

          <div style={{ background: 'var(--bg-elevated)', borderRadius: '10px', border: '1px solid var(--border)', padding: '20px' }}>
            <h4 style={{ margin: '0 0 10px', fontSize: '15px', color: '#dc2626' }}>
              {isHi ? 'शास्त्रीय स्वास्थ्य संवेदनशीलता काल (BPHS निर्देश)' : 'Classical Health Vulnerability Periods (BPHS Guidelines)'}
            </h4>
            <p style={{ margin: 0, fontSize: '13px', lineHeight: 1.6, color: 'var(--text)' }}>
              {isHi ? medReport.criticalPoints.warningHi : medReport.criticalPoints.warningEn}
            </p>
          </div>
        </div>
      )}

      {/* Tab 4: Lal Kitab Farman */}
      {activeTab === 'lalkitab' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ padding: '16px', borderRadius: '8px', background: 'var(--bg-elevated)', border: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                {isHi ? 'लाल किताब कुण्डली वर्गीकरण' : 'Lal Kitab Horoscope Classification'}
              </div>
              <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--accent)', marginTop: '2px' }}>
                {isHi ? lkReport.tevaTypeHi : lkReport.tevaType}
              </div>
            </div>
          </div>

          {/* Sleeping Planets */}
          {lkReport.sleepingPlanets.length > 0 && (
            <div style={{ background: 'var(--bg-elevated)', borderRadius: '10px', border: '1px solid var(--border)', padding: '20px' }}>
              <h4 style={{ margin: '0 0 12px', fontSize: '15px', color: 'var(--text)' }}>
                {isHi ? 'सोए हुए ग्रह (सोया हुआ भाव व जगाने के उपाय)' : 'Sleeping Planets & Activation Catalysts'}
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {lkReport.sleepingPlanets.map((sp, idx) => (
                  <div key={idx} style={{ padding: '12px', borderRadius: '6px', background: 'var(--bg-subtle)', border: '1px solid var(--border)' }}>
                    <div style={{ fontWeight: 700, fontSize: '13px', color: 'var(--accent)' }}>
                      {trPlanet(sp.planet, lang)} {isHi ? `भाव ${sp.house} में` : `in House ${sp.house}`} · {isHi ? 'जगाने वाला ग्रह:' : 'Catalyst to Awaken:'} {trPlanet(sp.catalystPlanet, lang)}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text)', marginTop: '4px' }}>
                      {sp.reasonEn}
                    </div>
                    <div style={{ fontSize: '11.5px', color: '#059669', marginTop: '4px', fontWeight: 600 }}>
                      {isHi ? sp.remedyHi : sp.remedyEn}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Blind Planets */}
          {lkReport.blindPlanets.length > 0 && (
            <div style={{ background: 'var(--bg-elevated)', borderRadius: '10px', border: '1px solid var(--border)', padding: '20px' }}>
              <h4 style={{ margin: '0 0 12px', fontSize: '15px', color: '#dc2626' }}>
                {isHi ? 'अंधे ग्रह (परस्पर टकराव व दोष)' : 'Blind Planet Conjunctions (Mutual Conflict)'}
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {lkReport.blindPlanets.map((bp, idx) => (
                  <div key={idx} style={{ padding: '12px', borderRadius: '6px', background: 'rgba(220, 38, 38, 0.05)', border: '1px solid rgba(220, 38, 38, 0.2)' }}>
                    <div style={{ fontWeight: 700, fontSize: '13px', color: '#dc2626' }}>
                      {bp.planets.map((p) => trPlanet(p, lang)).join(' + ')} {isHi ? `भाव ${bp.house} में` : `in House ${bp.house}`}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text)', marginTop: '4px' }}>{bp.impactEn}</div>
                    <div style={{ fontSize: '12px', color: 'var(--accent)', marginTop: '4px', fontWeight: 600 }}>
                      {isHi ? `उपाय: ${bp.farmanRemedyEn}` : `Remedy: ${bp.farmanRemedyEn}`}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Core Farmans */}
          <div style={{ background: 'var(--bg-elevated)', borderRadius: '10px', border: '1px solid var(--border)', padding: '20px' }}>
            <h4 style={{ margin: '0 0 14px', fontSize: '15px', color: 'var(--text)' }}>
              {isHi ? 'अनिवार्य लाल किताब सुरक्षात्मक उपाय (Farman)' : 'Universal Lal Kitab Protective Remedies'}
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {lkReport.coreRemediesEn.map((r, idx) => (
                <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '2px', padding: '10px', borderRadius: '6px', background: 'var(--bg-subtle)' }}>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)' }}>
                    • {isHi ? (lkReport.coreRemediesHi[idx] || r) : r}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicalAstrologyView;
