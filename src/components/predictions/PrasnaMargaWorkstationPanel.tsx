import React, { useMemo, useState } from 'react';
import {
  Activity,
  AlertTriangle,
  Award,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  Compass,
  Crown,
  Flame,
  Globe,
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
  computeMasterPrasnaMargaReport,
  type MasterPrasnaMargaReport,
} from '../../astro/predictions/prasnaMargaAdvancedEngines';
import type { ChartData } from '../../astro/types';
import { useLanguage } from '../../i18n/LanguageContext';

export interface PrasnaMargaWorkstationPanelProps {
  chart: ChartData;
}

type SubTabKey =
  | 'medical'
  | 'progeny'
  | 'badhaka'
  | 'spouse'
  | 'ashtakavarga'
  | 'chakras'
  | 'mundane';

export const PrasnaMargaWorkstationPanel: React.FC<PrasnaMargaWorkstationPanelProps> = ({ chart }) => {
  const { lang } = useLanguage();
  const isHi = lang === 'hi';

  const [activeTab, setActiveTab] = useState<SubTabKey>('medical');

  const report: MasterPrasnaMargaReport = useMemo(() => computeMasterPrasnaMargaReport(chart), [chart]);

  return (
    <div className="view-stack">
      {/* 1. Master Title Banner */}
      <div
        className="card"
        style={{
          borderLeft: '4px solid #b45309',
          background: 'var(--bg-elevated)',
          padding: '16px 20px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span className="badge" style={{ background: 'rgba(180, 83, 9, 0.15)', color: '#b45309', fontWeight: 700, fontSize: '11px' }}>
                {isHi ? 'प्रश्न मार्ग एवं वेदास्ट्रो शास्त्रीय अनुसंधान' : 'Prasna Marga & VedAstro Classical Suite'}
              </span>
            </div>
            <h2 style={{ margin: 0, fontSize: '19px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={20} style={{ color: '#b45309' }} />
              <span>
                {isHi
                  ? 'प्रश्न मार्ग, चिकित्सा ज्योतिष, बीज-क्षेत्र स्फुट व विशेष चक्र'
                  : 'Prasna Marga, Medical Astrology, Beeja-Kshetra & Special Chakras'}
              </span>
            </h2>
            <p className="muted" style={{ margin: '4px 0 0', fontSize: '13px' }}>
              {isHi
                ? 'रोग परीक्षा (त्रिदोष व ७ धातु), बीज/क्षेत्र स्फुट, बाधक स्थान व रुष्ट देवता, विवाह प्रश्न, शोध्या पिण्ड आयुर्दाय व त्रिपताकी चक्र।'
                : 'Roga Prasna (Tridosha & 7 Dhatus), Beeja/Kshetra Sphutas, Badhakasthana & Deities, Vivaha Prasna, Sodya Pinda Longevity & Tripataki Chakra.'}
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

        {/* Quick KPI Metric Strip */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
            gap: '10px',
            marginTop: '16px',
            paddingTop: '12px',
            borderTop: '1px solid var(--border)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Activity size={16} style={{ color: '#ef4444' }} />
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{isHi ? 'त्रिदोष प्रकृति' : 'Dominant Dosha'}</div>
              <div style={{ fontSize: '12.5px', fontWeight: 700 }}>
                {isHi ? report.medical.dominantDoshaHi : report.medical.dominantDoshaEn}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Heart size={16} style={{ color: '#10b981' }} />
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{isHi ? 'संतान बीज क्षमता' : 'Progeny Score'}</div>
              <div style={{ fontSize: '12.5px', fontWeight: 700 }}>
                {report.progeny.progenyPromiseScore}% {isHi ? 'शुभ' : 'Fecund'}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Crown size={16} style={{ color: '#b45309' }} />
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{isHi ? 'बाधक भाव' : 'Badhaka House'}</div>
              <div style={{ fontSize: '12.5px', fontWeight: 700 }}>
                {report.badhaka.badhakaHouseNumber}th ({report.badhaka.badhakaLordEn})
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Shield size={16} style={{ color: '#3b82f6' }} />
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{isHi ? 'शोध्या पिण्ड आयु' : 'Gross Longevity'}</div>
              <div style={{ fontSize: '12.5px', fontWeight: 700 }}>
                {report.ashtakavarga.grossLongevityYears} {isHi ? 'वर्ष' : 'Yrs'}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Compass size={16} style={{ color: '#8b5cf6' }} />
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{isHi ? 'त्रिपताकी सुरक्षा' : 'Tripataki Safety'}</div>
              <div style={{ fontSize: '12.5px', fontWeight: 700 }}>
                {report.tripataki.overallFlagSafetyScore}%
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
          onClick={() => setActiveTab('medical')}
          className={`btn btn-sm ${activeTab === 'medical' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ fontWeight: activeTab === 'medical' ? 700 : 500, fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <Activity size={14} />
          {isHi ? 'रोग परीक्षा व त्रिदोष' : 'Medical & Tridosha'}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('progeny')}
          className={`btn btn-sm ${activeTab === 'progeny' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ fontWeight: activeTab === 'progeny' ? 700 : 500, fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <Heart size={14} />
          {isHi ? 'बीज व क्षेत्र स्फुट (संतान)' : 'Beeja & Kshetra Sphuta'}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('badhaka')}
          className={`btn btn-sm ${activeTab === 'badhaka' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ fontWeight: activeTab === 'badhaka' ? 700 : 500, fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <Crown size={14} />
          {isHi ? 'बाधक स्थान व रुष्ट देवता' : 'Badhaka & Deities'}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('spouse')}
          className={`btn btn-sm ${activeTab === 'spouse' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ fontWeight: activeTab === 'spouse' ? 700 : 500, fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <Sun size={14} />
          {isHi ? 'विवाह प्रश्न व जीवनसाथी' : 'Spouse & Vivaha'}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('ashtakavarga')}
          className={`btn btn-sm ${activeTab === 'ashtakavarga' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ fontWeight: activeTab === 'ashtakavarga' ? 700 : 500, fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <Layers size={14} />
          {isHi ? 'शोध्या पिण्ड आयु व ३३७ मैप' : 'Longevity & 337 Life Map'}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('chakras')}
          className={`btn btn-sm ${activeTab === 'chakras' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ fontWeight: activeTab === 'chakras' ? 700 : 500, fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <Compass size={14} />
          {isHi ? 'त्रिपताकी चक्र' : 'Tripataki Chakra'}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('mundane')}
          className={`btn btn-sm ${activeTab === 'mundane' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ fontWeight: activeTab === 'mundane' ? 700 : 500, fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <Globe size={14} />
          {isHi ? 'बी.वी. रमन भूकंप सूचकांक' : 'B.V. Raman Mundane Risk'}
        </button>
      </div>

      {/* 3. TAB 1: MEDICAL & TRIDOSHA */}
      {activeTab === 'medical' && (
        <div className="view-stack">
          {/* Etiology Banner */}
          <div className="card" style={{ padding: '16px 20px', borderLeft: '4px solid #ef4444', background: 'var(--bg-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <span className="badge" style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', fontWeight: 700, fontSize: '11px' }}>
                  {isHi ? 'प्रश्न मार्ग अध्याय १२: रोग परीक्षा' : 'Prasna Marga Ch. 12: Roga Prasna'}
                </span>
                <h3 style={{ margin: '4px 0 0', fontSize: '17px', fontWeight: 700 }}>
                  {isHi ? report.medical.etiologyTitleHi : report.medical.etiologyTitleEn}
                </h3>
              </div>
            </div>
            <p style={{ margin: '8px 0 0', fontSize: '13px', lineHeight: 1.5 }}>
              {isHi ? report.medical.etiologyDescriptionHi : report.medical.etiologyDescriptionEn}
            </p>
          </div>

          {/* Tridosha Bar Chart */}
          <div className="card" style={{ padding: '18px 20px' }}>
            <h4 style={{ margin: '0 0 14px', fontSize: '14px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Activity size={16} style={{ color: '#ef4444' }} />
              {isHi ? 'शारीरिक त्रिदोष अनुपात एवं संतुलन निर्देश' : 'Ayurvedic Tridosha Proportions & Regimen'}
            </h4>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '14px' }}>
              <div style={{ padding: '12px', borderRadius: '8px', background: 'var(--bg-subtle)', border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#3b82f6' }}>{isHi ? 'वात (Vata)' : 'Vata (Air/Ether)'}</span>
                  <span style={{ fontSize: '12px', fontWeight: 800 }}>{report.medical.vataPercent}%</span>
                </div>
                <div style={{ height: '8px', background: 'var(--border)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${report.medical.vataPercent}%`, height: '100%', background: '#3b82f6' }} />
                </div>
              </div>

              <div style={{ padding: '12px', borderRadius: '8px', background: 'var(--bg-subtle)', border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#ef4444' }}>{isHi ? 'पित्त (Pitta)' : 'Pitta (Fire/Water)'}</span>
                  <span style={{ fontSize: '12px', fontWeight: 800 }}>{report.medical.pittaPercent}%</span>
                </div>
                <div style={{ height: '8px', background: 'var(--border)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${report.medical.pittaPercent}%`, height: '100%', background: '#ef4444' }} />
                </div>
              </div>

              <div style={{ padding: '12px', borderRadius: '8px', background: 'var(--bg-subtle)', border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#10b981' }}>{isHi ? 'कफ (Kapha)' : 'Kapha (Earth/Water)'}</span>
                  <span style={{ fontSize: '12px', fontWeight: 800 }}>{report.medical.kaphaPercent}%</span>
                </div>
                <div style={{ height: '8px', background: 'var(--border)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${report.medical.kaphaPercent}%`, height: '100%', background: '#10b981' }} />
                </div>
              </div>
            </div>

            <p style={{ margin: 0, fontSize: '12.5px', lineHeight: 1.5, color: 'var(--text)' }}>
              <strong>{isHi ? 'दोष शमन निर्देश: ' : 'Dosha Pacification: '}</strong>
              {isHi ? report.medical.doshaGuidanceHi : report.medical.doshaGuidanceEn}
            </p>
          </div>

          {/* 7 Dhatus Table */}
          <div className="card" style={{ padding: '16px' }}>
            <h4 style={{ margin: '0 0 12px', fontSize: '14px', fontWeight: 700 }}>
              {isHi ? 'सप्त धातु परीक्षा (7 Body Tissues & Astrological Health Analysis)' : 'The Seven Dhatus Examination'}
            </h4>
            <div className="table-scroll">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>{isHi ? 'ग्रह' : 'Planet'}</th>
                    <th>{isHi ? 'धातु' : 'Dhatu'}</th>
                    <th>{isHi ? 'संबंधित अंग' : 'Governed Organs'}</th>
                    <th>{isHi ? 'स्थिति' : 'Status'}</th>
                    <th>{isHi ? 'शास्त्रीय फलादेश' : 'Manifestation'}</th>
                  </tr>
                </thead>
                <tbody>
                  {report.medical.dhatus.map((d, idx) => (
                    <tr
                      key={idx}
                      style={{
                        background:
                          d.severity === 'Severe'
                            ? 'rgba(239, 68, 68, 0.06)'
                            : d.severity === 'Moderate'
                            ? 'rgba(217, 119, 6, 0.05)'
                            : undefined,
                      }}
                    >
                      <td><strong>{isHi ? d.planetNameHi : d.planetNameEn}</strong></td>
                      <td>{isHi ? d.dhatuHi : d.dhatuEn}</td>
                      <td className="muted">{isHi ? d.associatedOrgansHi : d.associatedOrgansEn}</td>
                      <td>
                        <span
                          className="badge"
                          style={{
                            background:
                              d.severity === 'Healthy'
                                ? '#10b981'
                                : d.severity === 'Mild'
                                ? '#3b82f6'
                                : d.severity === 'Moderate'
                                ? '#d97706'
                                : '#ef4444',
                            color: '#fff',
                            fontWeight: 700,
                          }}
                        >
                          {d.severity}
                        </span>
                      </td>
                      <td style={{ fontSize: '12px' }}>{isHi ? d.manifestationHi : d.manifestationEn}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Soola Chakra & Healing Upayas */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
            <div className="card" style={{ padding: '14px 18px' }}>
              <strong style={{ fontSize: '13px', color: '#b45309', display: 'block', marginBottom: '4px' }}>
                {isHi ? 'शूल चक्र एवं रोग मुक्ति कालखंड:' : 'Soola Chakra & Recovery Arc:'}
              </strong>
              <div style={{ fontSize: '12.5px', lineHeight: 1.5 }}>
                <div><strong>{isHi ? 'रोग आरंभ नक्षत्र: ' : 'Onset Nakshatra: '}</strong>{report.medical.soolaChakraOnsetNakshatra}</div>
                <div><strong>{isHi ? 'स्वास्थ्य लाभ नक्षत्र: ' : 'Recovery Nakshatra: '}</strong>{report.medical.soolaChakraRecoveryNakshatra}</div>
                <div style={{ marginTop: '4px', color: 'var(--text-muted)' }}>
                  {isHi ? report.medical.soolaChakraDurationEstimateHi : report.medical.soolaChakraDurationEstimateEn}
                </div>
              </div>
            </div>

            <div className="card" style={{ padding: '14px 18px' }}>
              <strong style={{ fontSize: '13px', color: '#10b981', display: 'block', marginBottom: '4px' }}>
                {isHi ? 'महामृत्युंजय साधना एवं रस चिकित्सा:' : 'Maha Mrityunjaya & Taste Remedies:'}
              </strong>
              <p style={{ margin: '0 0 6px', fontSize: '12.5px', lineHeight: 1.45 }}>
                {isHi ? report.medical.mrityunjayaSadhanaHi : report.medical.mrityunjayaSadhanaEn}
              </p>
              <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '12px', lineHeight: 1.5 }}>
                {(isHi ? report.medical.ayurvedicTasteRemediesHi : report.medical.ayurvedicTasteRemediesEn).map((t, idx) => (
                  <li key={idx}>{t}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* 4. TAB 2: PROGENY & BEEJA/KSHETRA */}
      {activeTab === 'progeny' && (
        <div className="view-stack">
          {/* Fecundity Cards Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
            {/* Male Beeja Sphuta */}
            <div
              className="card"
              style={{
                padding: '18px',
                borderLeft: '4px solid #3b82f6',
                background: 'var(--bg-elevated)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#3b82f6' }}>
                  {isHi ? 'पुरुष बीज स्फुट (Beeja Sphuta)' : 'Male Beeja Sphuta'}
                </h4>
                <span className="badge" style={{ background: '#3b82f6', color: '#fff', fontWeight: 700 }}>
                  {report.progeny.maleBeejaSphuta.fertilityScorePercent}% {isHi ? 'पुष्टि' : 'Score'}
                </span>
              </div>
              <div style={{ fontSize: '12.5px', lineHeight: 1.6, marginBottom: '8px' }}>
                <div><strong>{isHi ? 'स्फुट देशांश: ' : 'Longitude: '}</strong>{report.progeny.maleBeejaSphuta.sphutaLongitude.toFixed(2)}° ({report.progeny.maleBeejaSphuta.degreeInSign.toFixed(2)}° in {isHi ? report.progeny.maleBeejaSphuta.signNameHi : report.progeny.maleBeejaSphuta.signNameEn})</div>
                <div><strong>{isHi ? 'नवांश राशि: ' : 'Navamsha: '}</strong>{isHi ? report.progeny.maleBeejaSphuta.navamshaSignHi : report.progeny.maleBeejaSphuta.navamshaSignEn}</div>
              </div>
              <p style={{ margin: '0 0 8px', fontSize: '12.5px', lineHeight: 1.5 }}>
                {isHi ? report.progeny.maleBeejaSphuta.classicalVerdictHi : report.progeny.maleBeejaSphuta.classicalVerdictEn}
              </p>
              <div style={{ fontSize: '12px', color: '#3b82f6', borderTop: '1px dashed var(--border)', paddingTop: '6px' }}>
                <strong>{isHi ? 'शास्त्रीय उपाय: ' : 'Remedy: '}</strong>
                {isHi ? report.progeny.maleBeejaSphuta.remedyHi : report.progeny.maleBeejaSphuta.remedyEn}
              </div>
            </div>

            {/* Female Kshetra Sphuta */}
            <div
              className="card"
              style={{
                padding: '18px',
                borderLeft: '4px solid #ec4899',
                background: 'var(--bg-elevated)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#ec4899' }}>
                  {isHi ? 'स्त्री क्षेत्र स्फुट (Kshetra Sphuta)' : 'Female Kshetra Sphuta'}
                </h4>
                <span className="badge" style={{ background: '#ec4899', color: '#fff', fontWeight: 700 }}>
                  {report.progeny.femaleKshetraSphuta.fertilityScorePercent}% {isHi ? 'पुष्टि' : 'Score'}
                </span>
              </div>
              <div style={{ fontSize: '12.5px', lineHeight: 1.6, marginBottom: '8px' }}>
                <div><strong>{isHi ? 'स्फुट देशांश: ' : 'Longitude: '}</strong>{report.progeny.femaleKshetraSphuta.sphutaLongitude.toFixed(2)}° ({report.progeny.femaleKshetraSphuta.degreeInSign.toFixed(2)}° in {isHi ? report.progeny.femaleKshetraSphuta.signNameHi : report.progeny.femaleKshetraSphuta.signNameEn})</div>
                <div><strong>{isHi ? 'नवांश राशि: ' : 'Navamsha: '}</strong>{isHi ? report.progeny.femaleKshetraSphuta.navamshaSignHi : report.progeny.femaleKshetraSphuta.navamshaSignEn}</div>
              </div>
              <p style={{ margin: '0 0 8px', fontSize: '12.5px', lineHeight: 1.5 }}>
                {isHi ? report.progeny.femaleKshetraSphuta.classicalVerdictHi : report.progeny.femaleKshetraSphuta.classicalVerdictEn}
              </p>
              <div style={{ fontSize: '12px', color: '#ec4899', borderTop: '1px dashed var(--border)', paddingTop: '6px' }}>
                <strong>{isHi ? 'शास्त्रीय उपाय: ' : 'Remedy: '}</strong>
                {isHi ? report.progeny.femaleKshetraSphuta.remedyHi : report.progeny.femaleKshetraSphuta.remedyEn}
              </div>
            </div>
          </div>

          {/* Santana Sphuta & Datta Sphuta (Adoption) */}
          <div className="card" style={{ padding: '16px 20px', background: 'var(--bg-subtle)' }}>
            <h4 style={{ margin: '0 0 10px', fontSize: '14px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Heart size={16} style={{ color: '#10b981' }} />
              {isHi ? 'संतान स्फुट, दत्तक स्फुट एवं वंश वृद्धि निर्देश' : 'Santana Sphuta, Datta Sphuta & Lineage Timing'}
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px', marginBottom: '12px' }}>
              <div style={{ padding: '10px 12px', borderRadius: '6px', background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
                <span className="muted small-text">{isHi ? 'संतान स्फुट (Santana Sphuta)' : 'Santana Sphuta'}</span>
                <div style={{ fontWeight: 700, fontSize: '14px', marginTop: '2px' }}>
                  {report.progeny.santanaSphutaLongitude.toFixed(2)}° ({isHi ? report.progeny.santanaSphutaSignHi : report.progeny.santanaSphutaSignEn})
                </div>
              </div>

              <div style={{ padding: '10px 12px', borderRadius: '6px', background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
                <span className="muted small-text">{isHi ? 'दत्तक स्फुट (Datta Sphuta)' : 'Datta Sphuta'}</span>
                <div style={{ fontWeight: 700, fontSize: '14px', marginTop: '2px' }}>
                  {report.progeny.dattaSphutaLongitude.toFixed(2)}° ({report.progeny.dattaSphutaSignEn})
                </div>
              </div>
            </div>

            <p style={{ margin: '0 0 10px', fontSize: '13px', lineHeight: 1.5 }}>
              {isHi ? report.progeny.overallProgenySummaryHi : report.progeny.overallProgenySummaryEn}
            </p>

            <div style={{ padding: '12px 14px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
              <strong style={{ fontSize: '13px', color: '#10b981', display: 'block', marginBottom: '4px' }}>
                {isHi ? 'अचूक संतान गोपाल विधान:' : 'Santana Gopala Upayas:'}
              </strong>
              <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '12.5px', lineHeight: 1.5 }}>
                {(isHi ? report.progeny.classicalUpayasHi : report.progeny.classicalUpayasEn).map((u, idx) => (
                  <li key={idx}>{u}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* 5. TAB 3: BADHAKA & DEITIES */}
      {activeTab === 'badhaka' && (
        <div className="view-stack">
          {/* Badhakasthana Overview Banner */}
          <div className="card" style={{ padding: '18px 20px', borderLeft: '4px solid #b45309', background: 'var(--bg-elevated)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <span className="badge" style={{ background: 'rgba(180, 83, 9, 0.15)', color: '#b45309', fontWeight: 700, fontSize: '11px' }}>
                  {isHi ? 'प्रश्न मार्ग अध्याय १५: बाधक स्थान व रुष्ट देवता' : 'Prasna Marga Ch. 15: Causes of Misery'}
                </span>
                <h3 style={{ margin: '4px 0 0', fontSize: '18px', fontWeight: 700 }}>
                  {isHi ? `बाधक भाव: ${report.badhaka.badhakaHouseNumber}वां भाव (${report.badhaka.badhakaSignHi})` : `Badhaka House: House ${report.badhaka.badhakaHouseNumber} (${report.badhaka.badhakaSignEn})`}
                </h3>
              </div>
              <div style={{ display: 'flex', gap: '6px' }}>
                <span className="badge" style={{ background: 'var(--bg-subtle)', border: '1px solid var(--border)' }}>
                  {isHi ? `लग्न: ${report.badhaka.lagnaSignHi} (${report.badhaka.lagnaQuality === 'Movable' ? 'चर' : report.badhaka.lagnaQuality === 'Fixed' ? 'स्थिर' : 'द्विस्वभाव'})` : `${report.badhaka.lagnaSignEn} (${report.badhaka.lagnaQuality})`}
                </span>
                <span className="badge" style={{ background: '#b45309', color: '#fff', fontWeight: 700 }}>
                  {isHi ? `बाधकेश: ${report.badhaka.badhakaLordHi}` : `Badhaka Lord: ${report.badhaka.badhakaLordEn}`}
                </span>
              </div>
            </div>

            <div style={{ marginTop: '12px', fontSize: '13px', lineHeight: 1.5 }}>
              <strong>{isHi ? 'कर्म का स्वरूप (Karma Nature): ' : 'Karma Nature: '}</strong>
              <span>{isHi ? report.badhaka.karmaAnalysisHi : report.badhaka.karmaAnalysisEn}</span>
            </div>
          </div>

          {/* Offended Deity & Remedial Shanti */}
          <div
            className="card"
            style={{
              padding: '18px 20px',
              background: 'linear-gradient(135deg, rgba(180, 83, 9, 0.08) 0%, rgba(217, 119, 6, 0.02) 100%)',
              border: '1.5px solid rgba(180, 83, 9, 0.3)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <Crown size={22} style={{ color: '#b45309' }} />
              <div>
                <span className="small-text muted" style={{ textTransform: 'uppercase', fontWeight: 700 }}>
                  {isHi ? 'रुष्ट देवता एवं कुल संरक्षण' : 'Offended Lineage Deity'}
                </span>
                <h4 style={{ margin: 0, fontSize: '17px', fontWeight: 700 }}>
                  {isHi ? report.badhaka.offendedDeityHi : report.badhaka.offendedDeityEn}
                </h4>
              </div>
            </div>

            <div style={{ padding: '12px 14px', borderRadius: '8px', background: 'var(--bg-elevated)', border: '1px solid var(--border)', margin: '10px 0' }}>
              <strong style={{ fontSize: '13px', color: '#b45309', display: 'block', marginBottom: '4px' }}>
                {isHi ? 'शास्त्रीय प्रायश्चित एवं शांति विधान:' : 'Prescribed Palliatives:'}
              </strong>
              <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '12.5px', lineHeight: 1.5 }}>
                {(isHi ? report.badhaka.prescribedPalliativesHi : report.badhaka.prescribedPalliativesEn).map((p, idx) => (
                  <li key={idx}>{p}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Drishti Badha, Preta Badha & Pitra Curse */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '12px' }}>
            <div className="card" style={{ padding: '14px 16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <strong style={{ fontSize: '13.5px' }}>{isHi ? 'दृष्टि बाधा (Evil Eye / Psychic Affliction)' : 'Drishti Badha'}</strong>
                <span className="badge" style={{ background: report.badhaka.drishtiBadhaSeverity === 'Severe' ? '#ef4444' : '#10b981', color: '#fff' }}>
                  {report.badhaka.drishtiBadhaSeverity}
                </span>
              </div>
              <p style={{ margin: 0, fontSize: '12.5px', lineHeight: 1.5 }}>
                {isHi ? report.badhaka.drishtiBadhaAnalysisHi : report.badhaka.drishtiBadhaAnalysisEn}
              </p>
            </div>

            <div className="card" style={{ padding: '14px 16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <strong style={{ fontSize: '13.5px' }}>{isHi ? 'पितृ ऋण एवं प्रेत बाधा' : 'Pitra & Preta Karma'}</strong>
                <span className="badge" style={{ background: report.badhaka.pretaBadhaPresent || report.badhaka.pitraCursePresent ? '#ef4444' : '#10b981', color: '#fff' }}>
                  {report.badhaka.pretaBadhaPresent || report.badhaka.pitraCursePresent ? 'Active Rina' : 'Clear'}
                </span>
              </div>
              <p style={{ margin: 0, fontSize: '12.5px', lineHeight: 1.5 }}>
                {isHi ? report.badhaka.pitraCurseAnalysisHi : report.badhaka.pitraCurseAnalysisEn}
              </p>
              {report.badhaka.pretaBadhaPresent && (
                <div style={{ marginTop: '6px', fontSize: '12px', color: '#ef4444' }}>
                  {isHi ? report.badhaka.pretaBadhaRemedyHi : report.badhaka.pretaBadhaRemedyEn}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 6. TAB 4: SPOUSE & VIVAHA */}
      {activeTab === 'spouse' && (
        <div className="view-stack">
          {/* Chandrabhilasha Sphuta Banner */}
          <div className="card" style={{ padding: '16px 20px', borderLeft: '4px solid #ec4899', background: 'var(--bg-elevated)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
              <div>
                <span className="badge" style={{ background: 'rgba(236, 72, 153, 0.15)', color: '#ec4899', fontWeight: 700, fontSize: '11px' }}>
                  {isHi ? 'चंद्राभिलाषा स्फुट: विवाह सिद्धि कालखंड' : 'Chandrabhilasha Sphuta: Marriage Timing'}
                </span>
                <h3 style={{ margin: '4px 0 0', fontSize: '17px', fontWeight: 700 }}>
                  {report.spouse.chandrabhilashaSphutaDeg.toFixed(2)}° ({isHi ? report.spouse.chandrabhilashaSignHi : report.spouse.chandrabhilashaSignEn})
                </h3>
              </div>
              <span className="badge" style={{ background: '#ec4899', color: '#fff', fontWeight: 700 }}>
                {isHi ? 'विवाह योग ट्रिगर' : 'Vivaha Trigger'}
              </span>
            </div>
            <p style={{ margin: '8px 0 0', fontSize: '13px', lineHeight: 1.5 }}>
              {isHi ? report.spouse.chandrabhilashaTimingWindowHi : report.spouse.chandrabhilashaTimingWindowEn}
            </p>
          </div>

          {/* Spouse Characteristics based on 7th House */}
          <div className="card" style={{ padding: '18px' }}>
            <h4 style={{ margin: '0 0 12px', fontSize: '14px', fontWeight: 700 }}>
              {isHi ? 'सप्तम भाव के आधार पर जीवनसाथी का स्वरूप एवं स्वभाव' : 'Spouse Temperament & Lineage (7th House Analysis)'}
            </h4>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px', marginBottom: '12px' }}>
              <div style={{ padding: '10px 12px', borderRadius: '6px', background: 'var(--bg-subtle)', border: '1px solid var(--border)' }}>
                <span className="muted small-text">{isHi ? 'वर्ण एवं शारीरिक स्वरूप' : 'Complexion & Appearance'}</span>
                <div style={{ fontWeight: 700, fontSize: '13.5px', marginTop: '2px' }}>
                  {isHi ? report.spouse.spouseComplexionHi : report.spouse.spouseComplexionEn}
                </div>
              </div>

              <div style={{ padding: '10px 12px', borderRadius: '6px', background: 'var(--bg-subtle)', border: '1px solid var(--border)' }}>
                <span className="muted small-text">{isHi ? 'स्वभाव एवं मानसिक प्रकृति' : 'Temperament & Mindset'}</span>
                <div style={{ fontWeight: 700, fontSize: '13.5px', marginTop: '2px' }}>
                  {isHi ? report.spouse.spouseTemperamentHi : report.spouse.spouseTemperamentEn}
                </div>
              </div>

              <div style={{ padding: '10px 12px', borderRadius: '6px', background: 'var(--bg-subtle)', border: '1px solid var(--border)' }}>
                <span className="muted small-text">{isHi ? 'परिवार एवं सामाजिक प्रतिष्ठा' : 'Family Stature & Lineage'}</span>
                <div style={{ fontWeight: 700, fontSize: '13.5px', marginTop: '2px' }}>
                  {isHi ? report.spouse.spouseFamilyStatureHi : report.spouse.spouseFamilyStatureEn}
                </div>
              </div>
            </div>

            <p style={{ margin: 0, fontSize: '12.5px', lineHeight: 1.5, color: 'var(--text)' }}>
              <strong>{isHi ? 'दांपत्य सामंजस्य निर्देश: ' : 'Marital Guidance: '}</strong>
              {isHi ? report.spouse.maritalHarmonyAdviceHi : report.spouse.maritalHarmonyAdviceEn}
            </p>
          </div>

          {/* Remarriage / Multiple Spouse Yogas */}
          <div className="card" style={{ padding: '16px' }}>
            <h4 style={{ margin: '0 0 10px', fontSize: '14px', fontWeight: 700 }}>
              {isHi ? 'शास्त्रीय पुनर्विवाह एवं दांपत्य योग परीक्षण' : 'Classical Multiple Marriage Yogas Assessment'}
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {report.spouse.remarriageYogas.map((y, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '10px 12px',
                    borderRadius: '6px',
                    background: y.isActive ? 'rgba(239, 68, 68, 0.06)' : 'var(--bg-subtle)',
                    border: y.isActive ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid var(--border)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <strong>{isHi ? y.titleHi : y.titleEn}</strong>
                    <span className="badge" style={{ background: y.isActive ? '#ef4444' : '#10b981', color: '#fff', fontSize: '10px' }}>
                      {y.isActive ? (isHi ? 'सक्रिय' : 'Active') : (isHi ? 'निष्क्रिय' : 'Inactive')}
                    </span>
                  </div>
                  <p style={{ margin: '4px 0 0', fontSize: '12px', color: 'var(--text-muted)' }}>
                    {isHi ? y.descriptionHi : y.descriptionEn}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 7. TAB 5: ASHTAKAVARGA LONGEVITY & 337 LIFE MAP */}
      {activeTab === 'ashtakavarga' && (
        <div className="view-stack">
          {/* Longevity Banner */}
          <div className="card" style={{ padding: '18px 20px', borderLeft: '4px solid #3b82f6', background: 'var(--bg-elevated)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <span className="badge" style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6', fontWeight: 700, fontSize: '11px' }}>
                  {isHi ? 'अष्टकवर्ग शोध्या पिण्ड आयुर्दाय (Sodya Pinda Longevity)' : 'Ashtakavarga Sodya Pinda Longevity'}
                </span>
                <h3 style={{ margin: '4px 0 0', fontSize: '20px', fontWeight: 700 }}>
                  {report.ashtakavarga.grossLongevityYears} {isHi ? 'वर्ष स्थूल आयु' : 'Years Gross Lifespan'} ({isHi ? report.ashtakavarga.netLongevityCategoryHi : report.ashtakavarga.netLongevityCategory})
                </h3>
              </div>
              <div style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>
                {isHi ? 'कुल शोध्या पिण्ड योग: ' : 'Total Sodya Pinda: '}
                <strong>{report.ashtakavarga.totalSodyaPinda}</strong>
              </div>
            </div>
          </div>

          {/* 337 Life Map: 4 Purusharthas */}
          <div className="card" style={{ padding: '18px' }}>
            <h4 style={{ margin: '0 0 12px', fontSize: '14px', fontWeight: 700 }}>
              {isHi ? '३३७ बिंदु सर्व अष्टकवर्ग चतुर्विध पुरुषार्थ मानचित्र' : '337-Bindu Four Purusharthas Life Map'}
            </h4>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px', marginBottom: '14px' }}>
              <div style={{ padding: '12px', borderRadius: '6px', background: 'var(--bg-subtle)', border: '1px solid var(--border)' }}>
                <span className="muted small-text">{isHi ? 'धर्म (Dharma - भाव १, ५, ९)' : 'Dharma (Houses 1, 5, 9)'}</span>
                <div style={{ fontSize: '18px', fontWeight: 800, color: '#b45309', marginTop: '2px' }}>
                  {report.ashtakavarga.dharmaBindus} <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>/ 337</span>
                </div>
              </div>

              <div style={{ padding: '12px', borderRadius: '6px', background: 'var(--bg-subtle)', border: '1px solid var(--border)' }}>
                <span className="muted small-text">{isHi ? 'अर्थ (Artha - भाव २, ६, १०)' : 'Artha (Houses 2, 6, 10)'}</span>
                <div style={{ fontSize: '18px', fontWeight: 800, color: '#10b981', marginTop: '2px' }}>
                  {report.ashtakavarga.arthaBindus} <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>/ 337</span>
                </div>
              </div>

              <div style={{ padding: '12px', borderRadius: '6px', background: 'var(--bg-subtle)', border: '1px solid var(--border)' }}>
                <span className="muted small-text">{isHi ? 'काम (Kama - भाव ३, ७, ११)' : 'Kama (Houses 3, 7, 11)'}</span>
                <div style={{ fontSize: '18px', fontWeight: 800, color: '#ec4899', marginTop: '2px' }}>
                  {report.ashtakavarga.kamaBindus} <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>/ 337</span>
                </div>
              </div>

              <div style={{ padding: '12px', borderRadius: '6px', background: 'var(--bg-subtle)', border: '1px solid var(--border)' }}>
                <span className="muted small-text">{isHi ? 'मोक्ष (Moksha - भाव ४, ८, १२)' : 'Moksha (Houses 4, 8, 12)'}</span>
                <div style={{ fontSize: '18px', fontWeight: 800, color: '#8b5cf6', marginTop: '2px' }}>
                  {report.ashtakavarga.mokshaBindus} <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>/ 337</span>
                </div>
              </div>
            </div>

            <p style={{ margin: 0, fontSize: '13px', lineHeight: 1.5 }}>
              {isHi ? report.ashtakavarga.lifeMapSummaryHi : report.ashtakavarga.lifeMapSummaryEn}
            </p>
          </div>
        </div>
      )}

      {/* 8. TAB 6: TRIPATAKI CHAKRA */}
      {activeTab === 'chakras' && (
        <div className="view-stack">
          {/* Tripataki Summary Card */}
          <div className="card" style={{ padding: '18px 20px', borderLeft: '4px solid #8b5cf6', background: 'var(--bg-elevated)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
              <div>
                <span className="badge" style={{ background: 'rgba(139, 92, 246, 0.15)', color: '#8b5cf6', fontWeight: 700, fontSize: '11px' }}>
                  {isHi ? 'त्रिपताकी चक्र: त्रि-ध्वजा गोचर वेध परीक्षा' : 'Tripataki Chakra: 3-Flag Transit Vedha'}
                </span>
                <h3 style={{ margin: '4px 0 0', fontSize: '18px', fontWeight: 700 }}>
                  {isHi ? 'लग्न, चंद्र एवं सूर्य ध्वजा सुरक्षा सूचकांक' : 'Lagna, Chandra & Surya Flags Security Index'}
                </h3>
              </div>
              <span className="badge" style={{ background: '#8b5cf6', color: '#fff', fontWeight: 700 }}>
                {report.tripataki.overallFlagSafetyScore}% {isHi ? 'सुरक्षित' : 'Protected'}
              </span>
            </div>
            <p style={{ margin: '8px 0 0', fontSize: '13px', lineHeight: 1.5 }}>
              {isHi ? report.tripataki.annualForecastHi : report.tripataki.annualForecastEn}
            </p>
          </div>

          {/* 3 Flags Visual Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '12px' }}>
            {/* Lagna Flag */}
            <div className="card" style={{ padding: '16px', borderLeft: `3px solid ${report.tripataki.lagnaFlag.isAfflicted ? '#ef4444' : '#10b981'}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <strong style={{ fontSize: '13.5px' }}>{isHi ? report.tripataki.lagnaFlag.focusNameHi : report.tripataki.lagnaFlag.focusNameEn}</strong>
                <span className="badge" style={{ background: report.tripataki.lagnaFlag.isAfflicted ? '#ef4444' : '#10b981', color: '#fff', fontSize: '10px' }}>
                  {report.tripataki.lagnaFlag.isAfflicted ? 'Afflicted' : 'Safe'}
                </span>
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>
                {isHi ? 'नक्षत्र: ' : 'Nakshatra: '}<strong>{report.tripataki.lagnaFlag.nakshatraName}</strong> | {isHi ? report.tripataki.lagnaFlag.vedhaByPlanetHi : report.tripataki.lagnaFlag.vedhaByPlanetEn}
              </div>
              <p style={{ margin: 0, fontSize: '12px', lineHeight: 1.45 }}>
                {isHi ? report.tripataki.lagnaFlag.impactHi : report.tripataki.lagnaFlag.impactEn}
              </p>
            </div>

            {/* Moon Flag */}
            <div className="card" style={{ padding: '16px', borderLeft: `3px solid ${report.tripataki.moonFlag.isAfflicted ? '#ef4444' : '#10b981'}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <strong style={{ fontSize: '13.5px' }}>{isHi ? report.tripataki.moonFlag.focusNameHi : report.tripataki.moonFlag.focusNameEn}</strong>
                <span className="badge" style={{ background: report.tripataki.moonFlag.isAfflicted ? '#ef4444' : '#10b981', color: '#fff', fontSize: '10px' }}>
                  {report.tripataki.moonFlag.isAfflicted ? 'Afflicted' : 'Safe'}
                </span>
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>
                {isHi ? 'नक्षत्र: ' : 'Nakshatra: '}<strong>{report.tripataki.moonFlag.nakshatraName}</strong> | {isHi ? report.tripataki.moonFlag.vedhaByPlanetHi : report.tripataki.moonFlag.vedhaByPlanetEn}
              </div>
              <p style={{ margin: 0, fontSize: '12px', lineHeight: 1.45 }}>
                {isHi ? report.tripataki.moonFlag.impactHi : report.tripataki.moonFlag.impactEn}
              </p>
            </div>

            {/* Sun Flag */}
            <div className="card" style={{ padding: '16px', borderLeft: `3px solid ${report.tripataki.sunFlag.isAfflicted ? '#ef4444' : '#10b981'}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <strong style={{ fontSize: '13.5px' }}>{isHi ? report.tripataki.sunFlag.focusNameHi : report.tripataki.sunFlag.focusNameEn}</strong>
                <span className="badge" style={{ background: report.tripataki.sunFlag.isAfflicted ? '#ef4444' : '#10b981', color: '#fff', fontSize: '10px' }}>
                  {report.tripataki.sunFlag.isAfflicted ? 'Afflicted' : 'Safe'}
                </span>
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>
                {isHi ? 'नक्षत्र: ' : 'Nakshatra: '}<strong>{report.tripataki.sunFlag.nakshatraName}</strong> | {isHi ? report.tripataki.sunFlag.vedhaByPlanetHi : report.tripataki.sunFlag.vedhaByPlanetEn}
              </div>
              <p style={{ margin: 0, fontSize: '12px', lineHeight: 1.45 }}>
                {isHi ? report.tripataki.sunFlag.impactHi : report.tripataki.sunFlag.impactEn}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 9. TAB 7: B.V. RAMAN MUNDANE RISK */}
      {activeTab === 'mundane' && (
        <div className="view-stack">
          {/* Score Banner */}
          <div className="card" style={{ padding: '18px 20px', borderLeft: '4px solid #d97706', background: 'var(--bg-elevated)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <span className="badge" style={{ background: 'rgba(217, 119, 6, 0.15)', color: '#d97706', fontWeight: 700, fontSize: '11px' }}>
                  {isHi ? 'बी.वी. रमन मेदिनी ज्योतिष शोध मॉडल' : 'B.V. Raman Mundane Research Model'}
                </span>
                <h3 style={{ margin: '4px 0 0', fontSize: '19px', fontWeight: 700 }}>
                  {report.mundane.score} / 35 ({isHi ? report.mundane.riskLevelHi : report.mundane.riskLevel})
                </h3>
              </div>
              <span
                className="badge"
                style={{
                  background: report.mundane.score >= 8 ? '#ef4444' : report.mundane.score >= 4 ? '#d97706' : '#10b981',
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: '12px',
                }}
              >
                {report.mundane.riskLevel}
              </span>
            </div>
            <p style={{ margin: '8px 0 0', fontSize: '13px', lineHeight: 1.5 }}>
              {isHi ? report.mundane.geophysicalSummaryHi : report.mundane.geophysicalSummaryEn}
            </p>
          </div>

          {/* Active Planetary Triggers */}
          <div className="card" style={{ padding: '16px' }}>
            <h4 style={{ margin: '0 0 10px', fontSize: '14px', fontWeight: 700 }}>
              {isHi ? 'सक्रिय मेदिनी संरेखण एवं भू-गर्भीय कारक' : 'Active Mundane Alignment Triggers'}
            </h4>
            <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '13px', lineHeight: 1.6 }}>
              {(isHi ? report.mundane.activeIndicatorsHi : report.mundane.activeIndicatorsEn).map((ind, idx) => (
                <li key={idx} style={{ marginBottom: '4px' }}>{ind}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
