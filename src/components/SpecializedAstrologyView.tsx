import React, { useEffect, useMemo, useState } from 'react';
import {
  Activity,
  Baby,
  Briefcase,
  Compass,
  Flame,
  GraduationCap,
  Heart,
  IndianRupee,
  Sparkles,
  Users,
} from 'lucide-react';
import { computeFamilyAndChildhood } from '../astro/predictions/familyDoshas';
import { evaluateParamayusStatus } from '../astro/predictions/paramayus';
import { formatDateDmy } from '../astro/time';
import {
  buildSpecializedAstrologySuite,
  type DashaWindow,
} from '../astro/predictions/specialized';
import type { ChartData, ChartStyle, DivisionalChartId } from '../astro/types';
import {
  localizeFamilyHi,
  localizeSpecializedSuiteHi,
  trBadge,
} from '../i18n/hindiPredictions';
import { useLanguage } from '../i18n/LanguageContext';
import { trPlanetShort, trVarga } from '../i18n/translations';
import { ParamayusLockBanner } from './ParamayusLockBanner';
import { VedicChartSvg } from './VedicChartSvg';

interface SpecializedAstrologyViewProps {
  chart: ChartData;
  chartStyle: ChartStyle;
  requestedBranch?: { id?: string; nonce: number };
}

type BranchId =
  | 'financial'
  | 'education'
  | 'career'
  | 'marriage'
  | 'intimacy'
  | 'child'
  | 'family'
  | 'life'
  | 'medical'
  | 'other';

const BRANCH_VARGA_MAP: Partial<Record<BranchId, DivisionalChartId>> = {
  financial: 'D2',
  education: 'D24',
  career: 'D10',
  marriage: 'D9',
  intimacy: 'D9',
  child: 'D7',
  family: 'D12',
  life: 'D20',
  medical: 'D6',
};

const DashaWindowList: React.FC<{ title: string; windows: DashaWindow[] }> = ({
  title,
  windows,
}) => {
  const { lang } = useLanguage();
  return (
  <div className="panel-subblock">
    <h4>{title}</h4>
    {windows.length === 0 ? (
      <div className="muted small-text">
        {lang === 'hi'
          ? 'इस श्रेणी में कोई प्रमुख महादशा सीधे मेल नहीं खाती; दशा फल टैब में अंतरदशा देखें।'
          : 'No primary Mahadasha match in window; inspect Antardashas in the Dashas tab.'}
      </div>
    ) : (
      <div className="table-scroll">
        <table className="data-table">
          <thead>
            <tr>
              <th>{lang === 'hi' ? 'महादशा' : 'Mahadasha'}</th>
              <th>{lang === 'hi' ? 'अवधि' : 'Period'}</th>
              <th>{lang === 'hi' ? 'ज्योतिषीय आधार' : 'Astrological Basis'}</th>
            </tr>
          </thead>
          <tbody>
            {windows.map((w, i) => (
              <tr key={`${w.lord}-${i}`}>
                <td>
                  <strong>{w.lord}</strong>
                </td>
                <td className="mono">
                  {formatDateDmy(w.startDate)} → {formatDateDmy(w.endDate)}
                </td>
                <td className="wrap-cell">{w.reason}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </div>
  );
};

const ScoreBadge: React.FC<{ score: number }> = ({ score }) => {
  const tone = score >= 75 ? 'high' : score >= 58 ? 'mid' : 'low';
  return (
    <div className="domain-score-badge">
      <strong className={`mono tone-text-${tone}`}>{score}</strong>
      <span>/100</span>
    </div>
  );
};

export const SpecializedAstrologyView: React.FC<SpecializedAstrologyViewProps> = ({
  chart,
  chartStyle,
  requestedBranch,
}) => {
  const { lang, t } = useLanguage();
  const [branch, setBranch] = useState<BranchId>('financial');

  useEffect(() => {
    const id = requestedBranch?.id as BranchId | undefined;
    if (
      id &&
      (id === 'financial' ||
        id === 'education' ||
        id === 'career' ||
        id === 'marriage' ||
        id === 'intimacy' ||
        id === 'child' ||
        id === 'family' ||
        id === 'life' ||
        id === 'medical' ||
        id === 'other')
    ) {
      setBranch(id);
    }
  }, [requestedBranch?.nonce, requestedBranch?.id]);
  const paramayus = useMemo(() => evaluateParamayusStatus(chart), [chart]);
  const rawSuite = useMemo(
    () => (paramayus.exceeded ? null : buildSpecializedAstrologySuite(chart)),
    [chart, paramayus.exceeded]
  );
  const rawFamily = useMemo(
    () => (paramayus.exceeded ? null : computeFamilyAndChildhood(chart)),
    [chart, paramayus.exceeded]
  );
  const suite = useMemo(
    () => (rawSuite ? (lang === 'hi' ? localizeSpecializedSuiteHi(rawSuite, chart) : rawSuite) : null),
    [rawSuite, lang, chart]
  );
  const family = useMemo(
    () => (rawFamily ? (lang === 'hi' ? localizeFamilyHi(rawFamily, chart) : rawFamily) : null),
    [rawFamily, lang, chart]
  );

  if (paramayus.exceeded || !suite || !family) {
    return (
      <div className="view-stack">
        <ParamayusLockBanner status={paramayus} />
      </div>
    );
  }

  const branches: Array<{ id: BranchId; label: string; icon: React.ReactNode }> = [
    { id: 'financial', label: t.branchesTabs.financial, icon: <IndianRupee size={14} /> },
    { id: 'education', label: t.branchesTabs.education, icon: <GraduationCap size={14} /> },
    { id: 'career', label: t.branchesTabs.career, icon: <Briefcase size={14} /> },
    { id: 'marriage', label: t.branchesTabs.marriage, icon: <Heart size={14} /> },
    { id: 'intimacy', label: t.branchesTabs.intimacy, icon: <Flame size={14} /> },
    { id: 'child', label: t.branchesTabs.child, icon: <Baby size={14} /> },
    { id: 'family', label: t.branchesTabs.family, icon: <Users size={14} /> },
    { id: 'life', label: t.branchesTabs.life, icon: <Sparkles size={14} /> },
    { id: 'medical', label: t.branchesTabs.medical, icon: <Activity size={14} /> },
    { id: 'other', label: t.branchesTabs.other, icon: <Compass size={14} /> },
  ];

  const vargaId = BRANCH_VARGA_MAP[branch];
  const vargaChart = vargaId ? chart.divisionalCharts[vargaId] : null;
  const vargaMeta = vargaChart ? trVarga(vargaChart.id, vargaChart.name, vargaChart.signification, lang) : null;

  const renderVargaSidebar = () =>
    vargaChart && vargaMeta ? (
      <VedicChartSvg
        title={`${vargaMeta.name} (${vargaChart.id})`}
        subtitle={vargaMeta.sig}
        style={chartStyle}
        lagnaSignIndex={vargaChart.lagnaSignIndex}
        centerLabel={vargaChart.id}
        items={vargaChart.placements.map((p) => ({
          id: p.id,
          label: trPlanetShort(p.id, lang),
          signIndex: p.signIndex,
          isLagna: p.id === 'Asc',
          isRetrograde: p.isRetrograde,
          isCombust: p.isCombust,
          dignity: p.dignity,
        }))}
      />
    ) : null;

  return (
    <div className="view-stack">
      <div className="charts-toolbar">
        <div className="subtab-bar">
          {branches.map((b) => (
            <button
              key={b.id}
              type="button"
              className={`subtab-btn branch-btn ${branch === b.id ? 'is-active' : ''}`}
              onClick={() => setBranch(b.id)}
            >
              {b.icon}
              <span>{b.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 1. Financial Astrology */}
      {branch === 'financial' && (
        <div className="varga-focus-grid">
          {renderVargaSidebar()}
          <section className="panel">
            <div className="panel-header">
              <h3>{lang === 'hi' ? 'धन, संपत्ति एवं वित्त ज्योतिष (अर्थ · D2 होरा व D4)' : 'Financial & Wealth Astrology (Artha · D2 Hora & D4)'}</h3>
              <ScoreBadge score={suite.financial.score} />
            </div>
            <div className="pred-card-body">
              <div className="branch-highlights">
                <div className="highlight-box">
                  <span className="muted small-text">{lang === 'hi' ? 'इंदु लग्न (धन केंद्र)' : 'Indu Lagna (Wealth Anchor)'}</span>
                  <strong>
                    {suite.financial.induLagnaSign} ({lang === 'hi' ? `भाव ${suite.financial.induLagnaHouse}` : `House ${suite.financial.induLagnaHouse}`})
                  </strong>
                </div>
                <div className="highlight-box">
                  <span className="muted small-text">{lang === 'hi' ? 'प्रमुख धन निर्माण शैली' : 'Dominant Accumulation Style'}</span>
                  <strong>{suite.financial.wealthStyle}</strong>
                </div>
              </div>

              <div className="pred-bullets">
                <div>
                  <strong>{lang === 'hi' ? 'इंदु लग्न विश्लेषण:' : 'Indu Lagna Analysis:'}</strong> {suite.financial.induLagnaNote}
                </div>
                <div>
                  <strong>{lang === 'hi' ? 'D2 होरा धन प्रवाह:' : 'D2 Hora Wealth Channel:'}</strong> {suite.financial.d2WealthChannel}
                </div>
                <div>
                  <strong>{lang === 'hi' ? 'भूमि, भवन व अचल संपत्ति (D4):' : 'Real Estate & Fixed Assets (D4):'}</strong> {suite.financial.fixedAssetsNote}
                </div>
                <div>
                  <strong>{lang === 'hi' ? 'निवेश व शेयर जोखिम (पंचम भाव):' : 'Speculation & Investments (H5):'}</strong> {suite.financial.speculationRiskNote}
                </div>
              </div>

              <ul className="domain-details">
                {suite.financial.insights.map((ins, i) => (
                  <li key={i}>{ins}</li>
                ))}
              </ul>
            </div>
            <DashaWindowList
              title={lang === 'hi' ? 'धन वृद्धि व समृद्धि की प्रमुख महादशाएँ' : 'Key Financial & Prosperity Mahadasha Windows'}
              windows={suite.financial.favorableDashas}
            />
          </section>
        </div>
      )}

      {/* 2. Education Astrology */}
      {branch === 'education' && (
        <div className="varga-focus-grid">
          {renderVargaSidebar()}
          <section className="panel">
            <div className="panel-header">
              <h3>{lang === 'hi' ? 'शिक्षा एवं बुद्धि ज्योतिष (विद्या · D24 चतुर्विंशांश)' : 'Education & Intellect Astrology (Vidya · D24 Siddhamsa)'}</h3>
              <ScoreBadge score={suite.education.score} />
            </div>
            <div className="pred-card-body">
              <div>
                <strong>{lang === 'hi' ? 'अनुकूल शैक्षणिक एवं अध्ययन क्षेत्र:' : 'Aligned Academic & Study Streams:'}</strong>
                <div className="pred-tags-row branch-tags-mt">
                  {suite.education.recommendedStreams.map((s, i) => (
                    <span key={i} className="tag tag-karaka">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
              <div className="pred-bullets">
                <div>
                  <strong>{lang === 'hi' ? 'D24 सिद्धांश (उच्च शिक्षा):' : 'D24 Siddhamsa (Higher Learning):'}</strong> {suite.education.d24Note}
                </div>
                <div>
                  <strong>{lang === 'hi' ? 'विश्लेषण शक्ति (बुध):' : 'Analytical Capacity (Mercury):'}</strong> {suite.education.analyticalStrength}
                </div>
                <div>
                  <strong>{lang === 'hi' ? 'उच्च उपाधि व गुरुजन (नवम भाव):' : 'Advanced Degrees & Mentors (H9):'}</strong> {suite.education.higherStudyNote}
                </div>
              </div>
              <ul className="domain-details">
                {suite.education.insights.map((ins, i) => (
                  <li key={i}>{ins}</li>
                ))}
              </ul>
            </div>
            <DashaWindowList
              title={lang === 'hi' ? 'शिक्षा, परीक्षा एवं डिग्री की शुभ दशाएँ' : 'Key Study, Degree & Exam Mahadasha Windows'}
              windows={suite.education.favorableDashas}
            />
          </section>
        </div>
      )}

      {/* 3. Career Astrology */}
      {branch === 'career' && (
        <div className="varga-focus-grid">
          {renderVargaSidebar()}
          <section className="panel">
            <div className="panel-header">
              <h3>{lang === 'hi' ? 'करियर एवं आजीविका ज्योतिष (कर्म · D10 दशमांश)' : 'Career & Profession Astrology (Karma · D10 Dasamsa)'}</h3>
              <ScoreBadge score={suite.career.score} />
            </div>
            <div className="pred-card-body">
              <div className="branch-highlights">
                <div className="highlight-box">
                  <span className="muted small-text">{lang === 'hi' ? 'कार्य शैली' : 'Work Orientation'}</span>
                  <strong>{trBadge(suite.career.workStyle, lang)}</strong>
                </div>
                <div className="highlight-box">
                  <span className="muted small-text">{lang === 'hi' ? 'नौकरी बनाम व्यवसाय सूचकांक' : 'Service vs Enterprise Index'}</span>
                  <strong className="mono">
                    {lang === 'hi'
                      ? `नौकरी ${suite.career.serviceScore} · व्यवसाय ${suite.career.businessScore}`
                      : `Service ${suite.career.serviceScore} · Enterprise ${suite.career.businessScore}`}
                  </strong>
                </div>
              </div>

              <div>
                <strong>{lang === 'hi' ? 'सर्वोत्तम उपयुक्त करियर क्षेत्र:' : 'Top Matching Career Sectors:'}</strong>
                <ul className="domain-details branch-tags-mt">
                  {suite.career.topSectors.map((sec, i) => (
                    <li key={i}>{sec}</li>
                  ))}
                </ul>
              </div>

              <div className="pred-bullets">
                <div>
                  <strong>{lang === 'hi' ? 'D10 दशमांश कुंडली:' : 'D10 Dasamsa Chart:'}</strong> {suite.career.d10Summary}
                </div>
                <div>
                  <strong>{lang === 'hi' ? 'अमात्यकारक (करियर कारक):' : 'Amatyakaraka (Career Significator):'}</strong> {suite.career.amatyakarakaNote}
                </div>
              </div>
              <ul className="domain-details">
                {suite.career.insights.map((ins, i) => (
                  <li key={i}>{ins}</li>
                ))}
              </ul>
            </div>
            <DashaWindowList
              title={lang === 'hi' ? 'करियर उन्नति व पदोन्नति की प्रमुख महादशाएँ' : 'Major Career Ascent Mahadasha Windows'}
              windows={suite.career.favorableDashas}
            />
          </section>
        </div>
      )}

      {/* 4. Marriage Astrology */}
      {branch === 'marriage' && (
        <div className="varga-focus-grid">
          {renderVargaSidebar()}
          <section className="panel">
            <div className="panel-header">
              <h3>{lang === 'hi' ? 'विवाह एवं दांपत्य ज्योतिष (विवाह · D9 नवांश)' : 'Marriage & Relationship Astrology (Vivaha · D9 Navamsa)'}</h3>
              <ScoreBadge score={suite.marriage.score} />
            </div>
            <div className="pred-card-body">
              <div className="pred-bullets">
                <div>
                  <strong>{lang === 'hi' ? 'जीवनसाथी स्वभाव एवं दारकारक:' : 'Partner Profile & Darakaraka:'}</strong> {suite.marriage.spouseProfile}
                </div>
                <div>
                  <strong>{lang === 'hi' ? 'नवांश (D9) विश्लेषण:' : 'Navamsa (D9) Assessment:'}</strong> {suite.marriage.d9Summary}
                </div>
                <div>
                  <strong>{lang === 'hi' ? 'उपपद लग्न (UL):' : 'Upapada Lagna (UL):'}</strong> {suite.marriage.upapadaNote}
                </div>
                <div>
                  <strong>{lang === 'hi' ? 'कुज / मांगलिक जांच:' : 'Kuja / Manglik Check:'}</strong> {suite.marriage.manglikAssessment}
                </div>
              </div>
              <ul className="domain-details">
                {suite.marriage.insights.map((ins, i) => (
                  <li key={i}>{ins}</li>
                ))}
              </ul>
            </div>
            <DashaWindowList
              title={lang === 'hi' ? 'विवाह व साझेदारी की अनुकूल महादशाएँ' : 'Key Relationship & Partnership Mahadasha Windows'}
              windows={suite.marriage.favorableDashas}
            />
          </section>
        </div>
      )}

      {/* 5. Intimacy, Passion & Sexuality Astrology */}
      {branch === 'intimacy' && (
        <div className="varga-focus-grid">
          {renderVargaSidebar()}
          <section className="panel">
            <div className="panel-header">
              <h3>{lang === 'hi' ? 'काम, आकर्षण एवं शयन सुख ज्योतिष (12वां/8वां भाव)' : 'Intimacy, Passion & Sexuality (Kama & Shayana Sukha)'}</h3>
              <span className="tag tag-karaka">{suite.intimacy.eroticArchetype}</span>
            </div>
            <div className="pred-card-body">
              <div className="sav-bars zero-pad">
                <div className="sav-bar-row">
                  <strong>{lang === 'hi' ? 'काम ऊर्जा (Passion)' : 'Passion Drive'}</strong>
                  <div className="bar-track">
                    <div
                      className="bar-fill tone-low"
                      style={{ width: `${suite.intimacy.passionDriveScore}%` }}
                    />
                  </div>
                  <span className="mono sav-num">{suite.intimacy.passionDriveScore}</span>
                </div>
                <div className="sav-bar-row">
                  <strong>{lang === 'hi' ? 'स्पर्श व स्नेह (Sensuality)' : 'Sensual Warmth'}</strong>
                  <div className="bar-track">
                    <div
                      className="bar-fill"
                      style={{ width: `${suite.intimacy.sensualWarmthScore}%` }}
                    />
                  </div>
                  <span className="mono sav-num">{suite.intimacy.sensualWarmthScore}</span>
                </div>
                <div className="sav-bar-row">
                  <strong>{lang === 'hi' ? 'भावनात्मक गहराई' : 'Emotional Depth'}</strong>
                  <div className="bar-track">
                    <div
                      className="bar-fill tone-high"
                      style={{ width: `${suite.intimacy.emotionalIntimacyScore}%` }}
                    />
                  </div>
                  <span className="mono sav-num">{suite.intimacy.emotionalIntimacyScore}</span>
                </div>
              </div>

              <div className="pred-bullets">
                <div>
                  <strong>{lang === 'hi' ? 'शुक्र आकर्षण शैली:' : 'Venusian Sensuality:'}</strong> {suite.intimacy.venusStyle}
                </div>
                <div>
                  <strong>{lang === 'hi' ? 'मंगल ऊर्जा व स्फूर्ति:' : 'Martian Drive & Stamina:'}</strong> {suite.intimacy.marsDriveNote}
                </div>
                <div>
                  <strong>{lang === 'hi' ? '12वां भाव (शयन सुख व बिस्तर आनंद):' : '12th House (Shayana Sukha / Bedroom Fulfillment):'}</strong>{' '}
                  {suite.intimacy.shayanaSukhaNote}
                </div>
                <div>
                  <strong>{lang === 'hi' ? '8वां भाव (गहन शारीरिक जुड़ाव):' : '8th House (Deep Erotic Bonding):'}</strong> {suite.intimacy.eighthHouseDepthNote}
                </div>
                <div>
                  <strong>{lang === 'hi' ? 'D9 नवांश व D30 त्रिंशांश विश्लेषण:' : 'D9 Navamsa & D30 Trimsamsa Insights:'}</strong> {suite.intimacy.d9AndD30Note}
                </div>
              </div>

              <div>
                <strong>{lang === 'hi' ? 'मुख्य अंतरंग आवश्यकताएँ एवं मार्गदर्शन:' : 'Core Intimacy Needs & Guidance:'}</strong>
                <ul className="domain-details branch-tags-mt">
                  {suite.intimacy.relationshipNeeds.map((n, i) => (
                    <li key={i}>{n}</li>
                  ))}
                  {suite.intimacy.guidance.map((g, i) => (
                    <li key={`g-${i}`}>{g}</li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* 6. Child / Progeny Astrology */}
      {branch === 'child' && (
        <div className="varga-focus-grid">
          {renderVargaSidebar()}
          <section className="panel">
            <div className="panel-header">
              <h3>{lang === 'hi' ? 'संतान एवं वंश ज्योतिष (संतान · D7 सप्तांश)' : 'Child & Progeny Astrology (Santana · D7 Saptamsa)'}</h3>
              <ScoreBadge score={suite.child.score} />
            </div>
            <div className="pred-card-body">
              <div className="pred-bullets">
                <div>
                  <strong>{lang === 'hi' ? 'D7 सप्तांश कुंडली:' : 'D7 Saptamsa Chart:'}</strong> {suite.child.d7Summary}
                </div>
                <div>
                  <strong>{lang === 'hi' ? 'पुत्रकारक (PK):' : 'Putrakaraka (PK):'}</strong> {suite.child.putrakarakaNote}
                </div>
                <div>
                  <strong>{lang === 'hi' ? 'संतान कारक बृहस्पति:' : 'Jupiter Progeny Karaka:'}</strong> {suite.child.jupiterProgenyNote}
                </div>
              </div>
              <ul className="domain-details">
                {suite.child.insights.map((ins, i) => (
                  <li key={i}>{ins}</li>
                ))}
              </ul>
            </div>
            <DashaWindowList
              title={lang === 'hi' ? 'संतान सुख व उन्नति की शुभ महादशाएँ' : 'Key Santana / Progeny Mahadasha Windows'}
              windows={suite.child.favorableDashas}
            />
          </section>
        </div>
      )}

      {/* 7. Life Path, Longevity & Spirituality */}
      {branch === 'life' && (
        <div className="varga-focus-grid">
          {renderVargaSidebar()}
          <section className="panel">
            <div className="panel-header">
              <h3>{lang === 'hi' ? 'आयु, जीवन यात्रा एवं आध्यात्म ज्योतिष (D20 विंशांश)' : 'Life Path, Longevity & Spiritual Astrology (D20 Vimsamsa)'}</h3>
            </div>
            <div className="pred-card-body">
              <div className="pred-top-grid">
                <div>
                  <h4>{lang === 'hi' ? 'पंच-महाभूत (तत्व संतुलन)' : 'Pancha-Mahabhuta (Elemental Balance)'}</h4>
                  <div className="sav-bars zero-pad">
                    {(['Fire', 'Earth', 'Air', 'Water'] as const).map((el) => {
                      const elHi = { Fire: 'अग्नि', Earth: 'पृथ्वी', Air: 'वायु', Water: 'जल' }[el];
                      return (
                        <div key={el} className="sav-bar-row">
                          <strong>{lang === 'hi' ? elHi : el}</strong>
                          <div className="bar-track">
                            <div className="bar-fill" style={{ width: `${suite.lifePath.elements[el]}%` }} />
                          </div>
                          <span className="mono sav-num">{suite.lifePath.elements[el]}%</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <h4>{lang === 'hi' ? 'त्रिगुण स्वभाव (सत्व / रजस / तमस)' : 'Triguna Temperament (Sattva / Rajas / Tamas)'}</h4>
                  <div className="sav-bars zero-pad">
                    {(['Sattva', 'Rajas', 'Tamas'] as const).map((g) => {
                      const gHi = { Sattva: 'सत्व', Rajas: 'रजस', Tamas: 'तमस' }[g];
                      return (
                        <div key={g} className="sav-bar-row">
                          <strong>{lang === 'hi' ? gHi : g}</strong>
                          <div className="bar-track">
                            <div className="bar-fill tone-high" style={{ width: `${suite.lifePath.gunas[g]}%` }} />
                          </div>
                          <span className="mono sav-num">{suite.lifePath.gunas[g]}%</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="pred-bullets">
                <div>
                  <strong>{lang === 'hi' ? 'आयु एवं जीवन-शक्ति बल:' : 'Ayur & Longevity Resilience:'}</strong> {suite.lifePath.longevityResilience}
                </div>
                <div>
                  <strong>{lang === 'hi' ? 'D20 आध्यात्मिक पथ:' : 'D20 Spiritual Path:'}</strong> {suite.lifePath.spiritualPathNote}
                </div>
              </div>

              <div className="yoga-grid zero-pad">
                {suite.lifePath.chapters.map((ch) => (
                  <article key={ch.phase} className="yoga-card">
                    <div className="yoga-card-top">
                      <strong>{ch.phase}</strong>
                      <span className="tag tag-karaka">{ch.ageRange}</span>
                    </div>
                    <div className="mono small-text">{lang === 'hi' ? 'दशाएँ:' : 'Dashas:'} {ch.dashas || '—'}</div>
                    <p className="yoga-desc">{ch.focus}</p>
                  </article>
                ))}
              </div>
            </div>
          </section>
        </div>
      )}

      {/* 8. Medical / Disease Astrology */}
      {branch === 'medical' && (
        <div className="varga-focus-grid">
          {renderVargaSidebar()}
          <section className="panel">
            <div className="panel-header">
              <h3>{lang === 'hi' ? 'चिकित्सा एवं आयुर्वेदिक ज्योतिष (रोग · D6 षष्ठांश)' : 'Medical & Ayurvedic Astrology (Roga · D6 Shashthamsa)'}</h3>
              <span className="tag tag-karaka">{suite.medical.dominantPrakriti}</span>
            </div>
            <div className="gochar-highlights">
              <div className="gochar-banner is-alert">
                <strong>{lang === 'hi' ? 'आवश्यक सूचना:' : 'Important Notice:'}</strong> {suite.medical.disclaimer}
              </div>
            </div>

            <div className="pred-card-body">
              <h4>{lang === 'hi' ? 'आयुर्वेदिक त्रिदोष संतुलन (वात · पित्त · कफ)' : 'Ayurvedic Tridosha Balance (Vata · Pitta · Kapha)'}</h4>
              <div className="sav-bars zero-pad">
                <div className="sav-bar-row">
                  <strong>{lang === 'hi' ? 'वात' : 'Vata'}</strong>
                  <div className="bar-track">
                    <div className="bar-fill" style={{ width: `${suite.medical.doshaBalance.vata}%` }} />
                  </div>
                  <span className="mono sav-num">{suite.medical.doshaBalance.vata}%</span>
                </div>
                <div className="sav-bar-row">
                  <strong>{lang === 'hi' ? 'पित्त' : 'Pitta'}</strong>
                  <div className="bar-track">
                    <div className="bar-fill tone-low" style={{ width: `${suite.medical.doshaBalance.pitta}%` }} />
                  </div>
                  <span className="mono sav-num">{suite.medical.doshaBalance.pitta}%</span>
                </div>
                <div className="sav-bar-row">
                  <strong>{lang === 'hi' ? 'कफ' : 'Kapha'}</strong>
                  <div className="bar-track">
                    <div className="bar-fill tone-high" style={{ width: `${suite.medical.doshaBalance.kapha}%` }} />
                  </div>
                  <span className="mono sav-num">{suite.medical.doshaBalance.kapha}%</span>
                </div>
              </div>

              <div className="pred-bullets">
                <div>
                  <strong>{lang === 'hi' ? 'D6 षष्ठांश स्वास्थ्य संकेत:' : 'D6 Shashthamsa Indicator:'}</strong> {suite.medical.d6ShashthamsaNote}
                </div>
                {suite.medical.wellnessGuidance.map((w, i) => (
                  <div key={i}>• {w}</div>
                ))}
              </div>
            </div>

            <div className="panel-subblock">
              <h4>{lang === 'hi' ? 'कालपुरुष अंग-वार संवेदनशील स्वास्थ्य क्षेत्र' : 'Kalapurusha Anatomical Focus Zones'}</h4>
              <div className="table-scroll">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>{lang === 'hi' ? 'भाव / राशि' : 'House / Sign'}</th>
                      <th>{lang === 'hi' ? 'शरीर का अंग' : 'Anatomical Region'}</th>
                      <th>{lang === 'hi' ? 'ज्योतिषीय कारण' : 'Astrological Trigger'}</th>
                      <th>{lang === 'hi' ? 'निवारक स्वास्थ्य देखभाल' : 'Preventive Wellness Care'}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {suite.medical.vulnerableZones.map((z) => (
                      <tr key={z.house}>
                        <td className="mono">
                          <strong>{t.common.house}{z.house}</strong> ({z.signName})
                        </td>
                        <td>{z.anatomicalRegion}</td>
                        <td className="wrap-cell">{z.trigger}</td>
                        <td className="wrap-cell">{z.preventiveCare}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* Family & Childhood */}
      {branch === 'family' && (() => {
        const d3 = chart.divisionalCharts.D3;
        const d3Meta = trVarga('D3', 'Drekkana', d3.signification, lang);
        const members = [
          family.mother,
          family.father,
          family.siblings,
          family.extendedFamily,
          family.inLaws,
        ];
        return (
          <div className="view-stack">
            <div className="dual-chart-grid">
              {renderVargaSidebar()}
              <VedicChartSvg
                title={lang === 'hi' ? `द्रेष्काण (D3) — भाई-बहन व पराक्रम` : 'Drekkana (D3) — Siblings & Courage'}
                subtitle={d3Meta.sig}
                style={chartStyle}
                lagnaSignIndex={d3.lagnaSignIndex}
                centerLabel="D3"
                items={d3.placements.map((p) => ({
                  id: p.id,
                  label: trPlanetShort(p.id, lang),
                  signIndex: p.signIndex,
                  isLagna: p.id === 'Asc',
                  isRetrograde: p.isRetrograde,
                  dignity: p.dignity,
                }))}
              />
            </div>

            <section className="panel">
              <div className="panel-header">
                <h3>{lang === 'hi' ? 'बचपन एवं प्रारंभिक पालन-पोषण (बाल्यावस्था, 0–12 वर्ष)' : 'Childhood & Early Upbringing (Balya Avastha, Ages 0–12)'}</h3>
                <ScoreBadge score={family.childhood.score} />
              </div>
              <div className="pred-card-body">
                <div className="highlight-box">
                  <span className="muted small-text">{lang === 'hi' ? 'बाल्यावस्था की प्रमुख महादशाएँ (0–12 वर्ष)' : 'Early Childhood Mahadashas (Ages 0–12)'}</span>
                  <strong className="mono">{family.childhood.earlyDashas || 'N/A'}</strong>
                </div>
                <div className="pred-bullets">
                  <div>
                    <strong>{lang === 'hi' ? 'बाल्यावस्था सारांश:' : 'Emotional & Balya Summary:'}</strong> {family.childhood.balyaSummary}
                  </div>
                  <div>
                    <strong>{lang === 'hi' ? 'गृह व संस्कार शैली:' : 'Home & Upbringing Style:'}</strong> {family.childhood.upbringingStyle}
                  </div>
                  <div>
                    <strong>{lang === 'hi' ? 'प्रारंभिक परिवेश:' : 'Early Temperament & Environment:'}</strong> {family.childhood.earlyEnvironment}
                  </div>
                </div>
              </div>
            </section>

            <section className="panel">
              <div className="panel-header">
                <h3>{lang === 'hi' ? 'माता-पिता, भाई-बहन, कुटुंब एवं ससुराल पक्ष' : 'Parents, Siblings, Relatives & In-Laws'}</h3>
                <span className="muted">
                  {lang === 'hi'
                    ? 'D1 भाव, D12 द्वादशांश, D3 द्रेष्काण एवं चर कारकों पर आधारित विश्लेषण'
                    : 'Synthesized from D1 houses, D12 Dwadasamsa, D3 Drekkana & Chara Karakas'}
                </span>
              </div>
              <div className="domains-grid">
                {members.map((m) => {
                  const tone = m.score >= 75 ? 'high' : m.score >= 58 ? 'mid' : 'low';
                  return (
                    <article key={m.role} className="domain-card">
                      <div className="domain-top">
                        <div>
                          <h4>{m.role}</h4>
                          <div className="muted small-text">{m.sanskrit}</div>
                        </div>
                        <ScoreBadge score={m.score} />
                      </div>
                      <div className="bar-track">
                        <div className={`bar-fill tone-${tone}`} style={{ width: `${m.score}%` }} />
                      </div>
                      <p className="domain-summary">{m.reading}</p>
                      <div className="muted small-text">{m.vargaNote}</div>
                      <div className="domain-factors">
                        <span className="factor-chip">{m.keyIndicators}</span>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          </div>
        );
      })()}

      {branch === 'other' && (
        <div className="view-stack">
          <section className="panel">
            <div className="panel-header">
              <h3>{lang === 'hi' ? 'वैदिक निरयण बनाम पाश्चात्य सायन राशि तुलना' : 'Western Tropical vs Vedic Sidereal Bridge'}</h3>
            </div>
            <div className="pred-card-body">
              <div className="branch-highlights">
                <div className="highlight-box">
                  <span className="muted small-text">{lang === 'hi' ? 'सूर्य राशि' : 'Sun Sign'}</span>
                  <strong>
                    {lang === 'hi' ? 'वैदिक:' : 'Vedic:'} {suite.other.westernVedicBridge.siderealSun} · {lang === 'hi' ? 'पाश्चात्य:' : 'Western:'}{' '}
                    {suite.other.westernVedicBridge.tropicalSun}
                  </strong>
                </div>
                <div className="highlight-box">
                  <span className="muted small-text">{lang === 'hi' ? 'चंद्र राशि' : 'Moon Sign'}</span>
                  <strong>
                    {lang === 'hi' ? 'वैदिक:' : 'Vedic:'} {suite.other.westernVedicBridge.siderealMoon} · {lang === 'hi' ? 'पाश्चात्य:' : 'Western:'}{' '}
                    {suite.other.westernVedicBridge.tropicalMoon}
                  </strong>
                </div>
                <div className="highlight-box">
                  <span className="muted small-text">{lang === 'hi' ? 'लग्न (Ascendant)' : 'Ascendant (Rising)'}</span>
                  <strong>
                    {lang === 'hi' ? 'वैदिक:' : 'Vedic:'} {suite.other.westernVedicBridge.siderealAsc} · {lang === 'hi' ? 'पाश्चात्य:' : 'Western:'}{' '}
                    {suite.other.westernVedicBridge.tropicalAsc}
                  </strong>
                </div>
              </div>
              <p className="muted small-text">{suite.other.westernVedicBridge.note}</p>
            </div>
          </section>

          <div className="pred-top-grid">
            <section className="panel">
              <div className="panel-header">
                <h3>{lang === 'hi' ? 'एस्ट्रो-वास्तु (दिशा एवं गृह संतुलन)' : 'Astro-Vastu Directional Alignment'}</h3>
              </div>
              <div className="table-scroll">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>{lang === 'hi' ? 'दिशा' : 'Direction'}</th>
                      <th>{lang === 'hi' ? 'ग्रह / भाव' : 'Planet / House'}</th>
                      <th>{t.common.status}</th>
                      <th>{lang === 'hi' ? 'वास्तु सुझाव' : 'Guidance'}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {suite.other.astroVastu.map((v) => (
                      <tr key={v.direction}>
                        <td>
                          <strong>{v.direction}</strong>
                        </td>
                        <td>
                          {v.planet} ({t.common.house}{v.house})
                        </td>
                        <td>
                          <span
                            className={`tag ${
                              v.status === 'Strong'
                                ? 'tag-varg'
                                : v.status === 'Balanced'
                                  ? 'tag-karaka'
                                  : 'tag-retro'
                            }`}
                          >
                            {trBadge(v.status, lang)}
                          </span>
                        </td>
                        <td className="wrap-cell">{v.tip}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="panel">
              <div className="panel-header">
                <h3>{lang === 'hi' ? 'व्यक्तिगत तारा बल (नक्षत्र शुभता)' : 'Personal Tara Bala (Muhurta Nakshatra Guide)'}</h3>
              </div>
              <div className="table-scroll max-h-340">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>{lang === 'hi' ? 'गोचर नक्षत्र' : 'Moon Transit Nakshatra'}</th>
                      <th>{lang === 'hi' ? 'तारा फल' : 'Tara Classification'}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {suite.other.taraBalaSummary.map((tb) => (
                      <tr key={tb.nakshatra}>
                        <td>
                          <strong>{tb.nakshatra}</strong>
                        </td>
                        <td>
                          <span className={`tag ${tb.isAuspicious ? 'tag-varg' : 'tag-combust'}`}>
                            {tb.taraName}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        </div>
      )}
    </div>
  );
};
