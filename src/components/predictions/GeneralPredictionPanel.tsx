import React, { useMemo, useState } from 'react';
import {
  Activity,
  Award,
  BookOpen,
  Briefcase,
  Calendar,
  Clock,
  Coins,
  Compass,
  Crown,
  Flame,
  Gem,
  Heart,
  Home,
  Info,
  Layers,
  Search,
  Shield,
  Sparkles,
  User,
  Users,
} from 'lucide-react';
import { computeGeneralPrediction } from '../../astro/predictions/generalPrediction';
import { computeDeepLifePredictions } from '../../astro/predictions/deepLifePredictions';
import {
  computeLifeSnapshotDossierReport,
  SnapshotAttribute,
  SnapshotPillarGroup,
} from '../../astro/predictions/lifeSnapshotDossierEngine';
import type { ChartData } from '../../astro/types';
import { useLanguage } from '../../i18n/LanguageContext';

interface GeneralPredictionPanelProps {
  chart: ChartData;
}

export const GeneralPredictionPanel: React.FC<GeneralPredictionPanelProps> = ({ chart }) => {
  const { lang } = useLanguage();
  const isHi = lang === 'hi';

  const [activeTab, setActiveTab] = useState<'snapshot' | 'chapters'>('snapshot');
  const [selectedPillarId, setSelectedPillarId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedDomainId, setSelectedDomainId] = useState<string>('all');

  // Compute reports
  const snapshotReport = useMemo(() => computeLifeSnapshotDossierReport(chart), [chart]);
  const legacyReport = useMemo(() => computeGeneralPrediction(chart), [chart]);
  const deepReport = useMemo(() => computeDeepLifePredictions(chart), [chart]);

  const { birthSummary, pillars } = snapshotReport;

  // Icons for 14 pillars
  const pillarIcons: Record<string, React.ReactNode> = {
    physical_persona: <User size={18} />,
    parents_ancestry: <Crown size={18} />,
    siblings_bhratri: <Flame size={18} />,
    spouse_marriage: <Heart size={18} />,
    children_progeny: <Users size={18} />,
    education_academics: <BookOpen size={18} />,
    career_wealth: <Briefcase size={18} />,
    health_crises_mysteries: <Activity size={18} />,
    assets_travel_moksha: <Home size={18} />,
    past_life_karma: <Clock size={18} />,
    ishta_devata_mantra: <Sparkles size={18} />,
    vastu_lifestyle: <Compass size={18} />,
    palmistry_gait: <Layers size={18} />,
    lucky_synergy_matrix: <Gem size={18} />,
  };

  const pillarFilterButtons = [
    { id: 'all', titleHi: 'सभी 14 आयाम (All 14)', titleEn: 'All 14 Pillars' },
    { id: 'physical_persona', titleHi: '1. देह लक्षण', titleEn: '1. Physical Persona' },
    { id: 'parents_ancestry', titleHi: '2. माता-पिता', titleEn: '2. Parents' },
    { id: 'siblings_bhratri', titleHi: '3. भाई-बहन', titleEn: '3. Siblings' },
    { id: 'spouse_marriage', titleHi: '4. दांपत्य व विवाह', titleEn: '4. Spouse & Marriage' },
    { id: 'children_progeny', titleHi: '5. संतान व वंश', titleEn: '5. Children' },
    { id: 'education_academics', titleHi: '6. शिक्षा व प्रतियोगिता', titleEn: '6. Education' },
    { id: 'career_wealth', titleHi: '7. करियर व धन', titleEn: '7. Career & Wealth' },
    { id: 'health_crises_mysteries', titleHi: '8. संकट व रहस्य', titleEn: '8. Adversities & Mysteries' },
    { id: 'assets_travel_moksha', titleHi: '9. संपत्ति व मोक्ष', titleEn: '9. Assets & Moksha' },
    { id: 'past_life_karma', titleHi: '10. पूर्वजन्म व ऋण', titleEn: '10. Past Life Karma' },
    { id: 'ishta_devata_mantra', titleHi: '11. इष्ट देव व मंत्र', titleEn: '11. Ishta Devata' },
    { id: 'vastu_lifestyle', titleHi: '12. गृह वास्तु व जीवनशैली', titleEn: '12. Vastu & Lifestyle' },
    { id: 'palmistry_gait', titleHi: '13. सामुद्रिक लक्षण', titleEn: '13. Palmistry & Gait' },
    { id: 'lucky_synergy_matrix', titleHi: '14. भाग्यशाली मैट्रिक्स', titleEn: '14. Lucky Synergy' },
  ];

  // Filtered pillars based on pill and search query
  const filteredPillars = useMemo(() => {
    let list = selectedPillarId === 'all'
      ? pillars
      : pillars.filter((p) => p.id === selectedPillarId);

    const q = searchQuery.trim().toLowerCase();
    if (!q) return list;

    return list
      .map((pillar) => {
        const matchingAttrs = pillar.attributes.filter(
          (a) =>
            a.titleEn.toLowerCase().includes(q) ||
            a.titleHi.toLowerCase().includes(q) ||
            a.valueEn.toLowerCase().includes(q) ||
            a.valueHi.toLowerCase().includes(q) ||
            a.explanationEn.toLowerCase().includes(q) ||
            a.explanationHi.toLowerCase().includes(q)
        );
        return {
          ...pillar,
          attributes: matchingAttrs,
        };
      })
      .filter((p) => p.attributes.length > 0);
  }, [pillars, selectedPillarId, searchQuery]);

  // Legacy Domain icons
  const domainIcons: Record<string, React.ReactNode> = {
    personality: <User size={16} />,
    education: <BookOpen size={16} />,
    career: <Briefcase size={16} />,
    wealth: <Coins size={16} />,
    marriage: <Heart size={16} />,
    children: <Users size={16} />,
    property: <Home size={16} />,
    health: <Shield size={16} />,
    travels: <Compass size={16} />,
    spirituality: <Sparkles size={16} />,
    milestones: <Award size={16} />,
    remedies: <Gem size={16} />,
    family: <Users size={16} />,
    parents: <Crown size={16} />,
    siblings: <Flame size={16} />,
    romance: <Heart size={16} />,
    business: <Briefcase size={16} />,
    debt_disputes: <Activity size={16} />,
    income_networks: <Coins size={16} />,
    foreign_residence: <Compass size={16} />,
  };

  const filteredDomains =
    selectedDomainId === 'all'
      ? legacyReport.domains
      : legacyReport.domains.filter((d) => d.id === selectedDomainId);

  const seasonal = deepReport.birthProfile.seasonalDetails;
  const tithiInfo = deepReport.birthProfile.tithiDetails;
  const navLagna = deepReport.birthProfile.navamshaLagna;

  const getDomainShortTitle = (d: { titleEn: string; titleHi: string }) => {
    if (isHi) {
      return d.titleHi.split(',')[0].split(' एवं ')[0].split(' व ')[0].trim();
    }
    return d.titleEn.split(',')[0].split(' & ')[0].trim();
  };

  return (
    <div className="view-stack" style={{ gap: '16px' }}>
      {/* Top Main Dossier Header Banner */}
      <section className="card" style={{ borderLeft: '4px solid var(--accent)', padding: '18px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Sparkles size={24} style={{ color: 'var(--accent)' }} />
              <span>
                {isHi
                  ? '360° संपूर्ण जीवन मैट्रिक्स स्नैपशॉट डॉसियर (360° Comprehensive Life Matrix)'
                  : '360° Comprehensive Life Matrix Snapshot Dossier'}
              </span>
            </h2>
            <p className="muted" style={{ margin: '8px 0 0', lineHeight: 1.6, fontSize: '13px', maxWidth: '880px' }}>
              {isHi
                ? 'महर्षि पाराशर, कल्याण वर्मा, वराहमिहिर एवं जैमिनी के शास्त्रीय सूत्रों पर आधारित १४ मौलिक जीवन-स्तंभ, ७०+ सूक्ष्म लक्षण, ग्रह स्थिति-दृष्टि-युति (PAC) विश्लेषण एवं वर्ग कुंडलियों (D1 से D60) द्वारा प्रमाणित सूक्ष्म फलित।'
                : 'Authoritative life prophecy encompassing 14 foundational pillars and 70+ micro-attributes synthesized under classical Rishi traditions (Parashara, Saravali, Brihat Jataka, Jaimini), certified via rigorous PAC geometry and divisional charts (D1 through D60).'}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <span className="badge badge-accent mono" style={{ fontSize: '12px', padding: '6px 12px', fontWeight: 700 }}>
              {isHi ? '14 जीवन आयाम सक्रिय' : '14 Life Pillars Active'}
            </span>
            <span className="badge badge-neutral mono" style={{ fontSize: '12px', padding: '6px 12px', fontWeight: 700 }}>
              {isHi ? '70+ सूक्ष्म लक्षण' : '70+ Micro Attributes'}
            </span>
          </div>
        </div>

        {/* Natal Horoscopic Anchor Summary Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: '10px',
            marginTop: '16px',
            padding: '12px',
            background: 'var(--bg-subtle)',
            borderRadius: '8px',
            border: '1px solid var(--border)',
            fontSize: '12px',
          }}
        >
          <div>
            <div className="muted" style={{ fontSize: '11px', textTransform: 'uppercase', fontWeight: 600 }}>
              {isHi ? 'लग्न राशि' : 'Ascendant'}
            </div>
            <strong style={{ fontSize: '13px', color: 'var(--text)' }}>
              {isHi ? birthSummary.lagnaSignHi : birthSummary.lagnaSignEn}
            </strong>{' '}
            <span className="muted" style={{ fontSize: '11px' }}>({birthSummary.lagnaDegStr})</span>
          </div>

          <div>
            <div className="muted" style={{ fontSize: '11px', textTransform: 'uppercase', fontWeight: 600 }}>
              {isHi ? 'चंद्र राशि' : 'Moon Sign'}
            </div>
            <strong style={{ fontSize: '13px', color: 'var(--text)' }}>
              {isHi ? birthSummary.moonSignHi : birthSummary.moonSignEn}
            </strong>
          </div>

          <div>
            <div className="muted" style={{ fontSize: '11px', textTransform: 'uppercase', fontWeight: 600 }}>
              {isHi ? 'जन्म नक्षत्र' : 'Nakshatra'}
            </div>
            <strong style={{ fontSize: '13px', color: 'var(--text)' }}>
              {isHi ? birthSummary.nakshatraHi : birthSummary.nakshatraEn}
            </strong>{' '}
            <span className="muted" style={{ fontSize: '11px' }}>({isHi ? `पाद ${birthSummary.pada}` : `Pada ${birthSummary.pada}`})</span>
          </div>

          <div>
            <div className="muted" style={{ fontSize: '11px', textTransform: 'uppercase', fontWeight: 600 }}>
              {isHi ? 'आत्मकारक (AK)' : 'Atmakaraka (AK)'}
            </div>
            <strong style={{ fontSize: '13px', color: '#b45309' }}>
              {isHi ? birthSummary.atmakarakaHi : birthSummary.atmakarakaEn}
            </strong>
          </div>

          <div>
            <div className="muted" style={{ fontSize: '11px', textTransform: 'uppercase', fontWeight: 600 }}>
              {isHi ? 'नवांश लग्न (D9)' : 'Navamsha (D9)'}
            </div>
            <strong style={{ fontSize: '13px', color: 'var(--text)' }}>
              {isHi ? birthSummary.d9LagnaHi : birthSummary.d9LagnaEn}
            </strong>
          </div>

          <div>
            <div className="muted" style={{ fontSize: '11px', textTransform: 'uppercase', fontWeight: 600 }}>
              {isHi ? 'षष्ट्यंश देव (D60)' : 'D60 Deity'}
            </div>
            <strong style={{ fontSize: '12.5px', color: '#15803d' }}>
              {isHi ? birthSummary.d60DevataHi : birthSummary.d60DevataEn}
            </strong>
          </div>

          <div>
            <div className="muted" style={{ fontSize: '11px', textTransform: 'uppercase', fontWeight: 600 }}>
              {isHi ? 'केपी उप-स्वामी' : 'KP Sub-Lord'}
            </div>
            <strong style={{ fontSize: '13px', color: '#6d28d9' }}>
              {birthSummary.kpLagnaSubLord}
            </strong>
          </div>
        </div>
      </section>

      {/* Main View Mode Selector Tabs */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '2px solid var(--border)', paddingBottom: '4px' }}>
        <button
          type="button"
          className={`btn ${activeTab === 'snapshot' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('snapshot')}
          style={{ fontSize: '13.5px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <Sparkles size={16} />
          <span>{isHi ? '360° जीवन स्नैपशॉट डॉसियर (14 Pillars)' : '360° Life Matrix Snapshot Dossier'}</span>
        </button>

        <button
          type="button"
          className={`btn ${activeTab === 'chapters' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('chapters')}
          style={{ fontSize: '13.5px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <BookOpen size={16} />
          <span>{isHi ? 'विस्तृत जीवन अध्याय व पंचांग (Detailed Narrative Chapters)' : 'Detailed Narrative Chapters & Panchanga'}</span>
        </button>
      </div>

      {/* ==================================================================== */}
      {/* TAB 1: 360° LIFE MATRIX SNAPSHOT DOSSIER                             */}
      {/* ==================================================================== */}
      {activeTab === 'snapshot' && (
        <div className="view-stack" style={{ gap: '16px' }}>
          {/* Quick Pillar Filter Pills & Search */}
          <div
            className="card"
            style={{
              padding: '12px 16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              background: 'var(--bg-elevated)',
            }}
          >
            {/* Search Input */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={
                    isHi
                      ? 'किसी भी लक्षण या विषय को खोजें (उदा. चेहरा, विवाह, संतान, करियर, गुप्त धन, शिक्षा, तिल, रोग)...'
                      : 'Search any life attribute (e.g. face shape, spouse, career, children, mole, ivf, accident, wealth)...'
                  }
                  style={{
                    width: '100%',
                    padding: '8px 12px 8px 36px',
                    borderRadius: '6px',
                    border: '1px solid var(--border)',
                    background: 'var(--bg-subtle)',
                    color: 'var(--text)',
                    fontSize: '13px',
                  }}
                />
              </div>
              {searchQuery && (
                <button
                  type="button"
                  className="btn btn-sm btn-secondary"
                  onClick={() => setSearchQuery('')}
                  style={{ fontSize: '12px' }}
                >
                  {isHi ? 'हटाएं' : 'Clear'}
                </button>
              )}
            </div>

            {/* Pillar Filter Pills */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                flexWrap: 'wrap',
              }}
              role="tablist"
              aria-label={isHi ? '14 जीवन स्तंभ चयन' : '14 Pillar Filter'}
            >
              {pillarFilterButtons.map((btn) => {
                const isActive = selectedPillarId === btn.id;
                return (
                  <button
                    key={btn.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    className={`btn btn-sm ${isActive ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => setSelectedPillarId(btn.id)}
                    style={{
                      fontSize: '12px',
                      padding: '4px 10px',
                      fontWeight: isActive ? 700 : 500,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                    }}
                  >
                    {btn.id !== 'all' && pillarIcons[btn.id]}
                    <span>{isHi ? btn.titleHi : btn.titleEn}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Pillars List */}
          {filteredPillars.length === 0 ? (
            <div className="card" style={{ padding: '30px', textAlign: 'center' }}>
              <Info size={28} style={{ color: 'var(--text-muted)', margin: '0 auto 10px' }} />
              <p className="muted" style={{ margin: 0, fontSize: '14px' }}>
                {isHi
                  ? 'आपकी खोज के अनुसार कोई लक्षण नहीं मिला। कृपया अन्य शब्द का प्रयास करें।'
                  : 'No life attributes matched your search query. Try another keyword.'}
              </p>
            </div>
          ) : (
            filteredPillars.map((pillar) => {
              const icon = pillarIcons[pillar.id] || <Sparkles size={18} />;

              return (
                <article
                  key={pillar.id}
                  className="card"
                  style={{
                    padding: '20px',
                    borderLeft: '4px solid var(--accent)',
                    background: 'var(--bg-elevated)',
                  }}
                >
                  {/* Pillar Card Header */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '10px',
                      marginBottom: '12px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '32px',
                          height: '32px',
                          borderRadius: '8px',
                          background: 'rgba(217, 119, 6, 0.12)',
                          color: 'var(--accent)',
                        }}
                      >
                        {icon}
                      </span>
                      <div>
                        <div
                          className="muted"
                          style={{
                            fontSize: '11px',
                            fontWeight: 700,
                            letterSpacing: '0.04em',
                            textTransform: 'uppercase',
                          }}
                        >
                          {isHi
                            ? `स्तंभ ${pillar.pillarNumber} / 14`
                            : `PILLAR ${pillar.pillarNumber} OF 14`}
                        </div>
                        <h3 style={{ margin: '2px 0 0', fontSize: '18px', fontWeight: 800 }}>
                          {isHi ? pillar.titleHi : pillar.titleEn}
                        </h3>
                      </div>
                    </div>

                    <span className="badge badge-accent mono" style={{ fontSize: '11px', padding: '4px 10px' }}>
                      {pillar.attributes.length} {isHi ? 'सूक्ष्म लक्षण' : 'Attributes'}
                    </span>
                  </div>

                  {/* Shastric Pillar Foundation Summary */}
                  <div
                    style={{
                      fontSize: '13px',
                      lineHeight: 1.6,
                      color: 'var(--text-muted)',
                      marginBottom: '16px',
                      padding: '8px 12px',
                      background: 'var(--bg-subtle)',
                      borderRadius: '6px',
                      borderLeft: '3px solid var(--accent)',
                    }}
                  >
                    <strong style={{ color: 'var(--text)' }}>
                      {isHi ? 'शास्त्रीय विमर्श:' : 'Astrological Premise:'}
                    </strong>{' '}
                    {isHi ? pillar.summaryHi : pillar.summaryEn}
                  </div>

                  {/* Responsive Attributes Grid */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                      gap: '14px',
                    }}
                  >
                    {pillar.attributes.map((attr) => (
                      <div
                        key={attr.id}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          background: 'var(--bg-subtle)',
                          borderRadius: '8px',
                          border: '1px solid var(--border)',
                          padding: '14px',
                          gap: '10px',
                        }}
                      >
                        {/* Attribute Header */}
                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
                          <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: 'var(--text)' }}>
                            {isHi ? attr.titleHi : attr.titleEn}
                          </h4>
                          <span
                            className="tag tag-varg"
                            style={{
                              fontSize: '10.5px',
                              whiteSpace: 'nowrap',
                              padding: '2px 6px',
                            }}
                          >
                            {attr.vargaRef}
                          </span>
                        </div>

                        {/* Bold Direct Prophetic Verdict */}
                        <div
                          style={{
                            padding: '8px 12px',
                            background: 'rgba(217, 119, 6, 0.08)',
                            borderLeft: '3px solid var(--accent)',
                            borderRadius: '4px',
                            fontWeight: 700,
                            fontSize: '13.5px',
                            lineHeight: 1.45,
                            color: 'var(--text)',
                          }}
                        >
                          {isHi ? attr.valueHi : attr.valueEn}
                        </div>

                        {/* Deep Prophetic Explanation Narrative */}
                        <div
                          style={{
                            fontSize: '12.5px',
                            lineHeight: 1.6,
                            color: 'var(--text)',
                          }}
                        >
                          {isHi ? attr.explanationHi : attr.explanationEn}
                        </div>

                        {/* Collapsible Shastric PAC Proof */}
                        <details
                          style={{
                            marginTop: 'auto',
                            paddingTop: '8px',
                            borderTop: '1px dashed var(--border)',
                          }}
                        >
                          <summary
                            style={{
                              cursor: 'pointer',
                              fontSize: '11.5px',
                              fontWeight: 650,
                              color: 'var(--accent)',
                              userSelect: 'none',
                            }}
                          >
                            {isHi
                              ? 'शास्त्रीय PAC प्रमाण व ज्योतिषीय आधार देखें'
                              : 'Inspect Classical PAC & Astrological Cause'}
                          </summary>
                          <div
                            style={{
                              marginTop: '8px',
                              padding: '8px 10px',
                              background: 'var(--bg-elevated)',
                              borderRadius: '6px',
                              fontSize: '11px',
                              lineHeight: 1.5,
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '4px',
                            }}
                          >
                            <div>
                              <strong>{isHi ? 'ग्रह स्थिति व दृष्टि (PAC):' : 'Planetary PAC Cause:'}</strong>{' '}
                              <span className="muted">{isHi ? attr.pacBasisHi : attr.pacBasisEn}</span>
                            </div>
                            <div>
                              <strong>{isHi ? 'शास्त्रीय ग्रंथ प्रमाण:' : 'Shastric Treatise Ref:'}</strong>{' '}
                              <span className="mono" style={{ color: '#b45309' }}>{attr.shastricRef}</span>
                            </div>
                            <div>
                              <strong>{isHi ? 'वर्ग कुंडली प्रमाण:' : 'Varga Confirmation:'}</strong>{' '}
                              <span className="mono" style={{ color: '#15803d' }}>{attr.vargaRef}</span>
                            </div>
                          </div>
                        </details>
                      </div>
                    ))}
                  </div>
                </article>
              );
            })
          )}
        </div>
      )}

      {/* ==================================================================== */}
      {/* TAB 2: DETAILED NARRATIVE CHAPTERS & PANCHANGA                       */}
      {/* ==================================================================== */}
      {activeTab === 'chapters' && (
        <div className="view-stack" style={{ gap: '16px' }}>
          {/* 4 Master Prediction Pillars */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '12px' }}>
            {/* Pillar 1: Life Stature */}
            <div className="card" style={{ padding: '14px', borderTop: '3px solid #d97706', background: 'var(--bg-elevated)' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                {isHi ? 'जीवन प्रतिष्ठा व सामाजिक वर्ग' : 'Life Stature & Social Class'}
              </div>
              <div style={{ fontSize: '15px', fontWeight: 700, margin: '4px 0 6px', color: '#b45309' }}>
                {isHi ? (deepReport.lifeStatureClassHi || 'समृद्ध व कुलीन वर्ग') : (deepReport.lifeStatureClassEn || 'Affluent & Dignified Class')}
              </div>
              <div style={{ fontSize: '12.5px', lineHeight: 1.5, color: 'var(--text)' }}>
                {isHi ? deepReport.lifeStatureMeaningHi : deepReport.lifeStatureMeaningEn}
              </div>
            </div>

            {/* Pillar 2: Prime Golden Rise Era */}
            <div className="card" style={{ padding: '14px', borderTop: '3px solid #16a34a', background: 'var(--bg-elevated)' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                {isHi ? 'स्वर्णकाल व मुख्य भाग्योदय दशक' : 'Prime Golden Rise Era'}
              </div>
              <div style={{ fontSize: '15px', fontWeight: 700, margin: '4px 0 6px', color: '#15803d' }}>
                {isHi ? deepReport.peakRiseAgeWindowHi : deepReport.peakRiseAgeWindowEn}
              </div>
              <div style={{ fontSize: '12.5px', lineHeight: 1.5, color: 'var(--text)' }}>
                {isHi
                  ? 'इस कालखंड में करियर, संपत्ति व सामाजिक प्रतिष्ठा का सर्वोच्च उत्कर्ष होगा।'
                  : 'Maximum accumulation of wealth, professional elevation and authority manifests here.'}
              </div>
            </div>

            {/* Pillar 3: Testing Periods & Hardships */}
            <div className="card" style={{ padding: '14px', borderTop: '3px solid #dc2626', background: 'var(--bg-elevated)' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                {isHi ? 'कठिन परीक्षा काल व संभलने का समय' : 'Testing Periods & Hardships'}
              </div>
              <ul style={{ margin: '6px 0 0', paddingLeft: '16px', fontSize: '12px', lineHeight: 1.45, color: 'var(--text)' }}>
                {(isHi ? (deepReport.crisisErasHi || []) : (deepReport.crisisErasEn || [])).slice(0, 2).map((era, eIdx) => (
                  <li key={eIdx} style={{ marginBottom: '3px' }}>{era}</li>
                ))}
              </ul>
            </div>

            {/* Pillar 4: Karmic Mission & Purpose */}
            <div className="card" style={{ padding: '14px', borderTop: '3px solid #7c3aed', background: 'var(--bg-elevated)' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                {isHi ? 'आत्मा का ध्येय व प्रारब्ध' : 'Karmic Mission & Soul Purpose'}
              </div>
              <div style={{ fontSize: '14px', fontWeight: 700, margin: '4px 0 6px', color: '#6d28d9' }}>
                {isHi ? deepReport.karmicMissionHi : deepReport.karmicMissionEn}
              </div>
              <div style={{ fontSize: '12.5px', lineHeight: 1.5, color: 'var(--text)' }}>
                {isHi
                  ? 'सांसारिक उपलब्धियों के साथ-साथ संस्थागत न्याय व धर्म का निर्वहन जीवन का सर्वोच्च उद्देश्य है।'
                  : 'Balancing executive success with institutional righteousness defines the ultimate destiny.'}
              </div>
            </div>
          </div>

          {/* Authentic Panchanga & Astrological Birth Profile */}
          <section className="card" style={{ padding: '14px', background: 'var(--bg-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <Calendar size={15} style={{ color: 'var(--accent)' }} />
              <strong style={{ fontSize: '13px' }}>
                {isHi ? 'जन्म पंचांग एवं देव-संरक्षक रूपरेखा:' : 'Birth Panchanga & Guardian Devata Profile:'}
              </strong>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px', fontSize: '12.5px' }}>
              <div>
                <span className="muted">{isHi ? 'तिथि व योग:' : 'Tithi:'}</span>{' '}
                <strong>{tithiInfo ? (isHi ? tithiInfo.tithiNameHi : tithiInfo.tithiNameEn) : '-'}</strong>
              </div>
              <div>
                <span className="muted">{isHi ? 'ऋतु प्रभाव:' : 'Seasonal Cycle:'}</span>{' '}
                <strong>{seasonal ? (isHi ? seasonal.rituHi : seasonal.rituEn) : '-'}</strong> ({seasonal ? (isHi ? seasonal.ayanaHi : seasonal.ayanaEn) : '-'})
              </div>
              <div>
                <span className="muted">{isHi ? 'नित्या देवी:' : 'Nitya Devi:'}</span>{' '}
                <strong>{tithiInfo ? (isHi ? tithiInfo.governingNityaDeviHi : tithiInfo.governingNityaDeviEn) : '-'}</strong>
              </div>
              <div>
                <span className="muted">{isHi ? 'नवांश लग्न:' : 'Navamsha Lagna:'}</span>{' '}
                <strong>{navLagna ? (isHi ? navLagna.signNameHi : navLagna.signNameEn) : '-'}</strong>
              </div>
            </div>
          </section>

          {/* Domain Navigation Filter Pills */}
          <div
            className="card"
            style={{
              padding: '10px 14px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              flexWrap: 'wrap',
              background: 'var(--bg-elevated)',
            }}
            role="tablist"
            aria-label={isHi ? 'जीवन क्षेत्र चयन' : 'Life Domain Filter'}
          >
            <button
              type="button"
              role="tab"
              aria-selected={selectedDomainId === 'all'}
              className={`btn btn-sm ${selectedDomainId === 'all' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setSelectedDomainId('all')}
              style={{ fontSize: '12px', padding: '4px 10px', fontWeight: selectedDomainId === 'all' ? 700 : 500 }}
            >
              {isHi ? 'सभी क्षेत्र (All)' : 'All Dimensions'}
            </button>
            {legacyReport.domains.map((d) => {
              const isActive = selectedDomainId === d.id;
              return (
                <button
                  key={d.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  className={`btn btn-sm ${isActive ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setSelectedDomainId(d.id)}
                  style={{
                    fontSize: '12px',
                    padding: '4px 10px',
                    fontWeight: isActive ? 700 : 500,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                  }}
                >
                  {domainIcons[d.id]}
                  <span>{getDomainShortTitle(d)}</span>
                </button>
              );
            })}
          </div>

          {/* Deep Life Prophecy Chapters */}
          <div className="view-stack" style={{ gap: '14px' }}>
            {filteredDomains.map((domain, index) => {
              const matchingDeep = deepReport.domains.find((d) => d.id === domain.id);
              const icon = domainIcons[domain.id] || <Sparkles size={16} />;

              return (
                <article className="card" key={domain.id} style={{ padding: '18px', borderLeft: '4px solid var(--accent)' }}>
                  {/* Card Header */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ color: 'var(--accent)' }}>{icon}</span>
                      <div className="muted" style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                        {isHi ? `जीवन अध्याय ${index + 1} / ${legacyReport.domains.length}` : `LIFE CHAPTER ${index + 1} / ${legacyReport.domains.length}`}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      {matchingDeep?.timingWindowEn && (
                        <span className="badge badge-accent mono" style={{ fontSize: '11px', padding: '3px 8px' }}>
                          {isHi ? matchingDeep.timingWindowHi : matchingDeep.timingWindowEn}
                        </span>
                      )}
                      <span className="tag tag-varg" style={{ fontSize: '11px' }}>
                        {isHi ? `${domain.varga} वर्ग पुष्टिकरण` : `${domain.varga} Cross-Check`}
                      </span>
                    </div>
                  </div>

                  {/* Title & Summary */}
                  <h3 style={{ margin: '0 0 6px', fontSize: '18px', fontWeight: 700 }}>
                    {isHi ? domain.titleHi : domain.titleEn}
                  </h3>
                  {matchingDeep?.summaryEn && (
                    <div style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--accent)', marginBottom: '10px' }}>
                      {isHi ? matchingDeep.summaryHi : matchingDeep.summaryEn}
                    </div>
                  )}

                  {/* Core Prophetic Narrative */}
                  <div style={{ fontSize: '14px', lineHeight: 1.8, color: 'var(--text)', whiteSpace: 'pre-line' }}>
                    {isHi ? domain.predictionHi : domain.predictionEn}
                  </div>

                  {/* Strengths & Cautions Dual Grid */}
                  {matchingDeep && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '10px', marginTop: '14px' }}>
                      <div style={{ padding: '10px 12px', background: 'rgba(22, 163, 74, 0.07)', borderRadius: '8px', borderLeft: '3px solid #16a34a' }}>
                        <strong style={{ fontSize: '12.5px', color: '#15803d', display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <Award size={14} />
                          {isHi ? 'मुख्य नैसर्गिक सामर्थ्य व लाभ:' : 'Key Natural Strengths:'}
                        </strong>
                        <p style={{ margin: '4px 0 0', fontSize: '12.5px', lineHeight: 1.5, color: 'var(--text)' }}>
                          {isHi ? matchingDeep.keyStrengthsHi.join(' · ') : matchingDeep.keyStrengthsEn.join(' · ')}
                        </p>
                      </div>

                      <div style={{ padding: '10px 12px', background: 'rgba(220, 38, 38, 0.07)', borderRadius: '8px', borderLeft: '3px solid #dc2626' }}>
                        <strong style={{ fontSize: '12.5px', color: '#b91c1c', display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <Shield size={14} />
                          {isHi ? 'संभावित बाधाएं व सावधानियां:' : 'Cautions & Pitfalls to Avoid:'}
                        </strong>
                        <p style={{ margin: '4px 0 0', fontSize: '12.5px', lineHeight: 1.5, color: 'var(--text)' }}>
                          {isHi ? matchingDeep.watchoutsHi.join(' · ') : matchingDeep.watchoutsEn.join(' · ')}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Collapsible Shastric Worksheet for Astrologers */}
                  <details style={{ marginTop: '14px', borderTop: '1px solid var(--border)', paddingTop: '10px' }}>
                    <summary style={{ cursor: 'pointer', fontWeight: 650, fontSize: '12.5px', color: 'var(--text-muted)' }}>
                      {isHi ? 'ज्योतिषीय व तकनीकी प्रमाण देखें (Shastric Evidence & Factors)' : 'Inspect Classical Reasoning & Technical Chart Factors'}
                    </summary>
                    <div style={{ display: 'grid', gap: '8px', marginTop: '10px', fontSize: '12px' }}>
                      <div>
                        <strong>{isHi ? 'व्याख्या का आधार:' : 'Interpretation Framework:'}</strong>{' '}
                        <span className="muted">{isHi ? domain.interpretationBasisHi : domain.interpretationBasisEn}</span>
                      </div>
                      <div>
                        <strong>{isHi ? 'मुख्य ग्रह-स्थिति:' : 'Primary Chart Factor:'}</strong>{' '}
                        <span className="muted">{isHi ? domain.primaryAnchorHi : domain.primaryAnchorEn}</span>
                      </div>
                      <div>
                        <strong>{isHi ? 'समग्र समन्वय:' : 'Combined Synthesis:'}</strong>{' '}
                        <span className="muted">{isHi ? domain.synthesisHi : domain.synthesisEn}</span>
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '4px' }}>
                        {domain.karakas.map((karaka) => (
                          <span className="tag tag-varg" key={karaka}>{karaka}</span>
                        ))}
                        <span className="tag tag-varg">Houses: {domain.houses.join(', ')}</span>
                        <span className="tag tag-varg">{domain.varga}</span>
                      </div>
                      <ul style={{ margin: '6px 0 0', paddingLeft: '18px', display: 'grid', gap: '6px' }}>
                        {domain.evidence.map((item, evidenceIndex) => (
                          <li key={`${item.source}-${evidenceIndex}`} style={{ lineHeight: 1.5 }}>
                            <strong>{item.source}</strong>: {isHi ? item.detailHi : item.detailEn}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </details>
                </article>
              );
            })}
          </div>
        </div>
      )}

      {/* Classical Attribution Footer */}
      <section className="card" style={{ padding: '16px', background: 'var(--bg-elevated)', borderLeft: '4px solid var(--accent)' }}>
        <strong style={{ fontSize: '13px', color: 'var(--text)' }}>
          {isHi ? 'शास्त्रीय ऋषि परंपरा व प्रामाणिक स्रोत (Classical Rishi Foundations)' : 'Classical Rishi Foundations & Authoritative Shastras'}
        </strong>
        <p className="muted" style={{ margin: '6px 0 0', fontSize: '12px', lineHeight: 1.65 }}>
          {isHi
            ? 'यह संपूर्ण जीवन फलादेश महर्षि पाराशर कृत बृहत्पाराशर होराशास्त्र, कल्याण वर्मा कृत सारावली, वराहमिहिर कृत बृहज्जातक, महर्षि जैमिनी कृत उपदेश सूत्र एवं मंत्रेश्वर कृत फलदीपिका के शाश्वत सूत्रों पर आधारित है। सभी गणनाएँ 100% स्थानीय वैदिक गणित व ग्रह स्थिति (PAC) द्वारा परिकलित हैं।'
            : 'This comprehensive life dossier is synthesized under the classical authority of Maharishi Parashara (Brihat Parashara Hora Shastra), Kalyana Varma (Saravali), Varahamihira (Brihat Jataka), Maharishi Jaimini (Upadesha Sutras), and Mantreswara (Phaladeepika). 100% computed via authentic local astronomical mathematics and PAC causality.'}
        </p>
      </section>
    </div>
  );
};
