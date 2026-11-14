import React, { useMemo, useState } from 'react';
import {
  AlertTriangle,
  Award,
  BookOpen,
  CheckCircle,
  Filter,
  Flame,
  Layers,
  Search,
  Sparkles,
  Zap,
} from 'lucide-react';
import {
  CLASSICAL_YOGAS_KB,
  type ClassicalYogaCategory,
  type ClassicalYogaQuality,
  type DetectedClassicalYoga,
} from '../../astro/predictions/classicalYogasKb';
import { computeDivisionalYogas, type DivisionalYogaItem } from '../../astro/divisionalYogas';
import {
  inspectCustomYuti,
  type ChartYutiGroup,
  type YutiReport,
} from '../../astro/predictions/yutiPredictions';
import { NINE_GRAHAS, SIGNS } from '../../astro/constants';
import type { ChartData, NineGrahaId } from '../../astro/types';
import { useLanguage } from '../../i18n/LanguageContext';
import { trPlanet, trPlanetShort, trSign } from '../../i18n/translations';

interface ActiveYogasAndYutiPanelProps {
  chart: ChartData;
  yutiReport: YutiReport;
  detectedYogas?: DetectedClassicalYoga[];
}

export const ActiveYogasAndYutiPanel: React.FC<ActiveYogasAndYutiPanelProps> = ({
  chart,
  yutiReport,
  detectedYogas = [],
}) => {
  const { lang } = useLanguage();
  const isHi = lang === 'hi';

  const [activeTab, setActiveTab] = useState<'yuti' | 'detected' | 'divisional' | 'all'>('yuti');
  const [selectedVargaForYogas, setSelectedVargaForYogas] = useState<string>('D9');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [qualityFilter, setQualityFilter] = useState<string>('all');

  const divisionalYogas = useMemo(
    () => computeDivisionalYogas(chart, selectedVargaForYogas),
    [chart, selectedVargaForYogas]
  );

  const detectedMap = useMemo(() => {
    const map = new Map<number, DetectedClassicalYoga>();
    for (const y of detectedYogas) map.set(y.id, y);
    return map;
  }, [detectedYogas]);

  // Custom Conjunction Inspector state
  const [selectedPlanets, setSelectedPlanets] = useState<NineGrahaId[]>(['Sun', 'Mercury']);
  const [customSign, setCustomSign] = useState<number>(0);

  const toggleCustomPlanet = (p: NineGrahaId) => {
    setSelectedPlanets((prev) => {
      if (prev.includes(p)) {
        if (prev.length <= 2) return prev;
        return prev.filter((x) => x !== p);
      }
      if (prev.length >= 7) return prev;
      return [...prev, p];
    });
  };

  const customResult = useMemo(() => {
    if (selectedPlanets.length < 2) return null;
    return inspectCustomYuti(selectedPlanets, customSign);
  }, [selectedPlanets, customSign]);

  const categories: Array<{ id: string; labelEn: string; labelHi: string }> = [
    { id: 'all', labelEn: 'All Categories', labelHi: 'सभी श्रेणियां' },
    { id: 'Mahapurusha', labelEn: 'Pancha Mahapurusha', labelHi: 'पंच महापुरुष योग' },
    { id: 'Chandra', labelEn: 'Lunar (Chandra)', labelHi: 'चंद्र योग' },
    { id: 'Surya', labelEn: 'Solar (Surya)', labelHi: 'सूर्य योग' },
    { id: 'Raja', labelEn: 'Raja Yogas', labelHi: 'राज योग' },
    { id: 'Dhana', labelEn: 'Dhana (Wealth)', labelHi: 'धन योग' },
    { id: 'Viparita', labelEn: 'Viparita Raja', labelHi: 'विपरीत राजयोग' },
    { id: 'Arishta', labelEn: 'Arishta / Ashubha', labelHi: 'अरिष्ट / कष्ट योग' },
    { id: 'Special', labelEn: 'Special Classical', labelHi: 'विशिष्ट योग' },
  ];

  const qualities: Array<{ id: string; labelEn: string; labelHi: string }> = [
    { id: 'all', labelEn: 'All Qualities', labelHi: 'सभी फल' },
    { id: 'Positive', labelEn: 'Auspicious (Shubha)', labelHi: 'शुभ फलदायी' },
    { id: 'Negative', labelEn: 'Challenging (Ashubha)', labelHi: 'अशुभ / सावधानी' },
    { id: 'Both', labelEn: 'Mixed / Dynamic', labelHi: 'मिश्रित फल' },
  ];

  const filteredYogas = useMemo(() => {
    const list = activeTab === 'detected' ? detectedYogas : CLASSICAL_YOGAS_KB;
    return list.filter((y) => {
      if (categoryFilter !== 'all' && y.category !== categoryFilter) return false;
      if (qualityFilter !== 'all' && y.quality !== qualityFilter) return false;
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const nEn = y.name.toLowerCase();
        const nHi = (y.nameHi || '').toLowerCase();
        const cond = (y.conditionEn || '').toLowerCase();
        const res = (y.resultEn || '').toLowerCase();
        if (!nEn.includes(q) && !nHi.includes(q) && !cond.includes(q) && !res.includes(q)) {
          return false;
        }
      }
      return true;
    });
  }, [activeTab, detectedYogas, categoryFilter, qualityFilter, searchTerm]);

  return (
    <div className="view-stack">
      {/* Top Banner */}
      <section className="panel" style={{ borderLeft: '4px solid var(--accent)' }}>
        <div className="panel-header">
          <div>
            <h3 style={{ margin: 0, fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={20} style={{ color: 'var(--accent)' }} />
              {isHi
                ? 'सक्रिय राजयोग व ग्रह युति फल (2-7 ग्रह युति, राजयोग, धनयोग व 300+ योग)'
                : 'Active Yogas & Planetary Conjunctions (2-7 Planet Stelliums, Raja, Dhana & 300+ Yogas)'}
            </h3>
            <p className="muted small-text" style={{ marginTop: '4px' }}>
              {isHi
                ? `जन्मकुंडली में ${yutiReport.groups.length} भावों में ग्रह युति तथा ${detectedYogas.length} शास्त्रीय वैदिक योग प्रत्यक्ष रूप से सक्रिय हैं।`
                : `${yutiReport.groups.length} natal house conjunctions and ${detectedYogas.length} classical Vedic yogas active in chart.`}
            </p>
          </div>

          {/* Tab Selector Pills */}
          <div className="toolbar-group">
            <button
              type="button"
              className={`btn btn-sm ${activeTab === 'yuti' ? 'btn-primary' : ''}`}
              onClick={() => setActiveTab('yuti')}
            >
              <Layers size={13} />{' '}
              {isHi ? `सक्रिय ग्रह युति (${yutiReport.groups.length})` : `Active Conjunctions (${yutiReport.groups.length})`}
            </button>
            <button
              type="button"
              className={`btn btn-sm ${activeTab === 'detected' ? 'btn-primary' : ''}`}
              onClick={() => setActiveTab('detected')}
            >
              <CheckCircle size={13} />{' '}
              {isHi ? `सक्रिय राजयोग (${detectedYogas.length})` : `Active Yogas (${detectedYogas.length})`}
            </button>
            <button
              type="button"
              className={`btn btn-sm ${activeTab === 'divisional' ? 'btn-primary' : ''}`}
              onClick={() => setActiveTab('divisional')}
            >
              <Award size={13} />{' '}
              {isHi ? 'वर्ग कुंडली योग (D1–D360)' : 'Divisional Yogas (D1–D360)'}
            </button>
            <button
              type="button"
              className={`btn btn-sm ${activeTab === 'all' ? 'btn-primary' : ''}`}
              onClick={() => setActiveTab('all')}
            >
              <BookOpen size={13} /> {isHi ? '300+ योग पुस्तकालय' : '300+ Corpus'}
            </button>
          </div>
        </div>

        {/* Overview Summary */}
        <div
          style={{
            marginTop: '12px',
            padding: '10px 14px',
            background: 'var(--bg-subtle)',
            borderRadius: '6px',
            fontSize: '13px',
            lineHeight: 1.5,
          }}
        >
          <strong>{isHi ? 'युति व योग स्थिति निष्कर्ष: ' : 'Conjunction & Yoga Synthesis: '}</strong>
          {isHi ? yutiReport.summaryHi : yutiReport.summaryEn}
        </div>
      </section>

      {/* --- TAB 1: ACTIVE PLANETARY CONJUNCTIONS (GRAHA YUTI) --- */}
      {activeTab === 'yuti' && (
        <div className="view-stack" style={{ gap: '16px' }}>
          {yutiReport.groups.length === 0 ? (
            <div className="card" style={{ padding: '24px', textAlign: 'center' }}>
              <Layers size={32} className="muted" style={{ margin: '0 auto 8px' }} />
              <p className="muted" style={{ margin: 0 }}>
                {isHi
                  ? 'कुंडली में किसी भाव में 2 या अधिक ग्रहों की बहु-ग्रह युति नहीं है। सभी ग्रह पृथक भावों में स्थित हैं।'
                  : 'No multi-planet conjunctions (2+ planets in the same house) found in this natal chart. All planets are distributed across separate houses.'}
              </p>
            </div>
          ) : (
            yutiReport.groups.map((group, idx) => (
              <YutiGroupCard key={idx} group={group} isHi={isHi} />
            ))
          )}

          {/* Interactive Custom Conjunction Sandbox */}
          <section className="panel" style={{ marginTop: '10px' }}>
            <div className="panel-header">
              <div>
                <h3>
                  <Zap size={16} />{' '}
                  {isHi
                    ? 'प्रयोगशाला: अपनी इच्छानुसार 2 से 7 ग्रहों की युति जांचें'
                    : 'Sandbox: Inspect Any Custom 2-to-7 Planet Conjunction'}
                </h3>
                <p className="muted small-text">
                  {isHi
                    ? 'नीचे दिए गए ग्रहों व राशि का चयन करके किसी भी संभावित युति के सकारात्मक फल, नकारात्मक प्रभाव व घटनाओं का तुरंत परीक्षण करें।'
                    : 'Select 2 to 7 planets and a sign to simulate positive events, hazards, and triggers for any combination.'}
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {/* Graha Selection Pills */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center' }}>
                <span className="small-text" style={{ fontWeight: 600, marginRight: '6px' }}>
                  {isHi ? 'ग्रह चुनें (2-7):' : 'Pick Planets (2-7):'}
                </span>
                {NINE_GRAHAS.map((p) => {
                  const active = selectedPlanets.includes(p);
                  return (
                    <button
                      key={p}
                      type="button"
                      className={`btn btn-sm ${active ? 'btn-primary' : ''}`}
                      onClick={() => toggleCustomPlanet(p)}
                      style={{ fontSize: '12px', padding: '3px 8px' }}
                    >
                      {active ? '✓ ' : '+ '}
                      {trPlanet(p, isHi ? 'hi' : 'en')}
                    </button>
                  );
                })}
              </div>

              {/* Sign Selector */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span className="small-text" style={{ fontWeight: 600 }}>
                  {isHi ? 'राशि चुनें:' : 'Select Sign:'}
                </span>
                <select
                  aria-label="Select Sign for Custom Yuti"
                  className="select-compact"
                  value={customSign}
                  onChange={(e) => setCustomSign(Number(e.target.value))}
                  style={{ minWidth: '160px' }}
                >
                  {SIGNS.map((s, idx) => (
                    <option key={s.index} value={idx}>
                      {idx + 1}. {trSign(idx, isHi ? 'hi' : 'en')}
                    </option>
                  ))}
                </select>
              </div>

              {/* Custom Result Output Card */}
              {customResult && (
                <div
                  style={{
                    padding: '12px 14px',
                    background: 'var(--bg-subtle)',
                    borderRadius: '8px',
                    border: '1px solid var(--border)',
                  }}
                >
                  <h4 style={{ margin: '0 0 6px', fontSize: '15px' }}>
                    {isHi ? customResult.headlineHi : customResult.headlineEn}
                  </h4>
                  <div className="muted small-text" style={{ marginBottom: '8px' }}>
                    {isHi ? customResult.labelHi : customResult.labelEn}
                  </div>

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                      gap: '10px',
                      marginBottom: '10px',
                    }}
                  >
                    <div
                      style={{
                        padding: '10px 12px',
                        background: 'rgba(34, 197, 94, 0.08)',
                        borderRadius: '6px',
                        fontSize: '13px',
                      }}
                    >
                      <strong style={{ color: '#16a34a' }}>
                        {isHi ? 'सकारात्मक फल: ' : 'Positive Results: '}
                      </strong>
                      {isHi ? customResult.positiveHi : customResult.positiveEn}
                    </div>
                    <div
                      style={{
                        padding: '10px 12px',
                        background: 'rgba(239, 68, 68, 0.08)',
                        borderRadius: '6px',
                        fontSize: '13px',
                      }}
                    >
                      <strong style={{ color: '#dc2626' }}>
                        {isHi ? 'नकारात्मक प्रभाव: ' : 'Negative Effects: '}
                      </strong>
                      {isHi ? customResult.negativeHi : customResult.negativeEn}
                    </div>
                  </div>

                  <div
                    style={{
                      padding: '8px 12px',
                      background: 'rgba(59, 130, 246, 0.08)',
                      borderRadius: '6px',
                      fontSize: '12.5px',
                    }}
                  >
                    <strong>
                      <Flame size={13} style={{ verticalAlign: 'middle' }} />{' '}
                      {isHi ? 'घटना व जोखिम संकेत: ' : 'Event Triggers & Risks: '}
                    </strong>
                    {isHi ? customResult.incidentRiskHi : customResult.incidentRiskEn}
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>
      )}

      {/* --- TAB 2 & 3: DETECTED CLASSICAL YOGAS OR FULL CORPUS --- */}
      {(activeTab === 'detected' || activeTab === 'all') && (
        <div className="view-stack">
          {/* Filter Bar */}
          <div className="card" style={{ padding: '10px 14px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '10px',
              }}
            >
              {/* Search Box */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: '1 1 240px' }}>
                <Search size={15} className="muted" />
                <input
                  type="text"
                  className="input-compact"
                  placeholder={
                    isHi
                      ? 'योग का नाम, नियम या फल खोजें...'
                      : 'Search yoga name, condition or result...'
                  }
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ flex: 1, minHeight: '34px' }}
                />
              </div>

              {/* Category Dropdown */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Filter size={14} className="muted" />
                <select
                  aria-label="Filter by Category"
                  className="select-compact"
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {isHi ? c.labelHi : c.labelEn}
                    </option>
                  ))}
                </select>
              </div>

              {/* Quality Dropdown */}
              <select
                aria-label="Filter by Quality"
                className="select-compact"
                value={qualityFilter}
                onChange={(e) => setQualityFilter(e.target.value)}
              >
                {qualities.map((q) => (
                  <option key={q.id} value={q.id}>
                    {isHi ? q.labelHi : q.labelEn}
                  </option>
                ))}
              </select>

              <div className="muted small-text">
                {isHi
                  ? `परिणाम: ${filteredYogas.length} योग`
                  : `Results: ${filteredYogas.length} yogas`}
              </div>
            </div>
          </div>

          {/* Yoga Cards Grid */}
          <div className="grid-2col" style={{ gap: '12px' }}>
            {filteredYogas.length === 0 ? (
              <div className="card" style={{ gridColumn: '1 / -1', padding: '24px', textAlign: 'center' }}>
                <p className="muted" style={{ margin: 0 }}>
                  {isHi
                    ? 'दिए गए फ़िल्टर के अनुसार कोई शास्त्रीय योग नहीं मिला।'
                    : 'No classical yogas match the active filter criteria.'}
                </p>
              </div>
            ) : (
              filteredYogas.map((y) => {
              const detectedEntry = detectedMap.get(y.id);
              const isFormed = Boolean(detectedEntry) || activeTab === 'detected';
              const condHi = 'conditionHi' in y ? (y as any).conditionHi : undefined;
              const involvedPlanets: string[] = detectedEntry
                ? detectedEntry.planets
                : ('planets' in y ? (y as any).planets : []);

              return (
                <article
                  key={y.id}
                  className="card"
                  style={{
                    borderLeft: isFormed
                      ? '4px solid var(--accent)'
                      : '4px solid var(--border)',
                    padding: '12px 14px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '8px',
                  }}
                >
                  <div>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        justifyContent: 'space-between',
                        gap: '8px',
                        marginBottom: '4px',
                      }}
                    >
                      <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 700 }}>
                        {isHi ? y.nameHi || y.name : y.name}
                      </h4>
                      <div className="toolbar-group">
                        {isFormed && (
                          <span className="tag tag-varg" style={{ fontSize: '11px', fontWeight: 700 }}>
                            {isHi ? '✓ सक्रिय' : '✓ Active'}
                          </span>
                        )}
                        <span
                          className={`tag ${
                            y.quality === 'Positive'
                              ? 'tag-varg'
                              : y.quality === 'Negative'
                                ? 'tag-combust'
                                : 'tag-karaka'
                          }`}
                          style={{ fontSize: '11px' }}
                        >
                          {y.quality === 'Positive'
                            ? isHi
                              ? 'शुभ फल'
                              : 'Auspicious'
                            : y.quality === 'Negative'
                              ? isHi
                                ? 'अशुभ / सावधानी'
                                : 'Challenging'
                              : isHi
                                ? 'मिश्रित फल'
                                : 'Mixed'}
                        </span>
                      </div>
                    </div>

                    {/* Classical Condition */}
                    <p
                      className="small-text"
                      style={{ margin: '0 0 6px', color: 'var(--text-muted)', lineHeight: 1.45 }}
                    >
                      <strong>{isHi ? 'शास्त्रीय नियम: ' : 'Condition: '}</strong>
                      {isHi ? condHi || y.conditionEn : y.conditionEn}
                    </p>

                    {/* Result / Life Events */}
                    <p
                      style={{
                        margin: '0 0 6px',
                        fontSize: '13px',
                        lineHeight: 1.5,
                        background: 'var(--bg-subtle)',
                        padding: '8px 10px',
                        borderRadius: '6px',
                      }}
                    >
                      <strong>{isHi ? 'फलादेश व घटना: ' : 'Phala & Outcome: '}</strong>
                      {isHi ? y.resultHi || y.resultEn : y.resultEn}
                    </p>
                  </div>

                  {/* Metadata Footer */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: '11.5px',
                      borderTop: '1px solid var(--border)',
                      paddingTop: '6px',
                      color: 'var(--text-muted)',
                    }}
                  >
                    <span>
                      {isHi ? 'श्रेणी: ' : 'Category: '}
                      {y.category}
                    </span>
                    {involvedPlanets.length > 0 && (
                      <span>
                        {isHi ? 'संबंधित ग्रह: ' : 'Planets: '}
                        {involvedPlanets.join(', ')}
                      </span>
                    )}
                  </div>
                </article>
              );
            }))}
          </div>
        </div>
      )}

      {/* --- TAB 4: DIVISIONAL YOGAS (D1 TO D360) --- */}
      {activeTab === 'divisional' && (
        <div className="view-stack" style={{ gap: '14px' }}>
          <div
            className="card"
            style={{
              padding: '12px 16px',
              background: 'var(--bg-elevated)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
              flexWrap: 'wrap',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Award size={18} style={{ color: 'var(--accent)' }} />
              <strong>{isHi ? 'वर्ग कुंडली चयन करें (D1 से D360):' : 'Select Divisional Chart (D1 to D360):'}</strong>
            </div>

            <select
              aria-label="Select Divisional Chart"
              className="select-compact"
              value={selectedVargaForYogas}
              onChange={(e) => setSelectedVargaForYogas(e.target.value)}
              style={{ fontWeight: 700, minWidth: '220px', borderColor: 'var(--accent)' }}
            >
              <optgroup label={isHi ? 'मुख्य षोडशवर्ग' : 'Standard Shodashavarga'}>
                <option value="D9">D9 — नवांश (Navamsha)</option>
                <option value="D10">D10 — दशमांश (Dashamsha / Career)</option>
                <option value="D1">D1 — लग्न (Rasi Duplicate)</option>
                <option value="D2">D2 — होरा (Hora / Wealth)</option>
                <option value="D3">D3 — द्रेष्काण (Drekkana / Siblings)</option>
                <option value="D4">D4 — चतुर्थांश (Chaturthamsha / Property)</option>
                <option value="D7">D7 — सप्तांश (Saptamsha / Progeny)</option>
                <option value="D12">D12 — द्वादशांश (Dwadashamsha / Parents)</option>
                <option value="D16">D16 — षोडशांश (Vehicles & Happiness)</option>
                <option value="D20">D20 — विंशांश (Spiritual Practice)</option>
                <option value="D24">D24 — चतुर्विंशांश (Higher Education)</option>
                <option value="D27">D27 — भ Ret (Strengths & Physical Prowess)</option>
                <option value="D30">D30 — त्रिंशांश (Trimshamsha / Misfortunes)</option>
                <option value="D40">D40 — खवेदांश (Khavedamsha / Auspiciousness)</option>
                <option value="D45">D45 — अक्षवेदांश (General Well-being)</option>
                <option value="D60">D60 — षष्ट्यंश (Past Karma Root)</option>
              </optgroup>
              <optgroup label={isHi ? 'उच्च सूक्ष्म व नाड़ी वर्ग' : 'Higher Micro & Nadi Vargas'}>
                <option value="D64">D64 — सूक्ष्म वर्ग (Chara / Sthira Amsa)</option>
                <option value="D72">D72 — अष्टनवांश (Karma Mastery)</option>
                <option value="D81">D81 — नव-नवांश (Pure Astral Soul)</option>
                <option value="D108">D108 — अष्टोत्तर शत (Dharma & Punya)</option>
                <option value="D144">D144 — द्विसप्तति द्वय (Lineage Secrets)</option>
                <option value="D150">D150 — नाड़ीअंश (Chandra Kala Nadiamsa)</option>
                <option value="D300">D300 — त्रिंशच्छत (Micro Destiny)</option>
                <option value="D360">D360 — षष्ट्यधिक शत (Master Micro Amsa)</option>
              </optgroup>
            </select>
          </div>

          {divisionalYogas.length === 0 ? (
            <div className="card" style={{ padding: '24px', textAlign: 'center' }}>
              <div className="muted" style={{ marginBottom: '6px' }}>
                {isHi
                  ? `${selectedVargaForYogas} में कोई विशेष अरिष्ट या दुर्योग सक्रिय नहीं है। सामान्य ग्रहीय बल प्रभावी है।`
                  : `No critical afflictions or special yogas triggered in ${selectedVargaForYogas}. Standard planetary strengths apply.`}
              </div>
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                gap: '12px',
              }}
            >
              {divisionalYogas.map((y) => (
                <article
                  key={y.id}
                  className="card"
                  style={{
                    padding: '14px',
                    borderLeft: `4px solid ${
                      y.nature.includes('Benefic')
                        ? '#16a34a'
                        : y.nature.includes('Malefic')
                          ? '#ef4444'
                          : '#eab308'
                    }`,
                    background: 'var(--bg-card)',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '8px',
                    }}
                  >
                    <strong style={{ fontSize: '15px' }}>{isHi ? y.nameHi : y.nameEn}</strong>
                    <span
                      className={`tag ${
                        y.nature.includes('Benefic')
                          ? 'tag-varg'
                          : y.nature.includes('Malefic')
                            ? 'tag-karaka'
                            : ''
                      }`}
                    >
                      {isHi ? y.natureHi : y.nature}
                    </span>
                  </div>

                  <div className="muted small-text" style={{ marginBottom: '8px' }}>
                    <strong>{isHi ? 'शास्त्रीय सूत्र: ' : 'Classical Rule: '}</strong>
                    {isHi ? y.ruleHi : y.ruleEn}
                  </div>

                  <div style={{ fontSize: '13px', lineHeight: 1.5, marginBottom: '8px' }}>
                    <strong>{isHi ? 'फल प्रभाव: ' : 'Manifestation: '}</strong>
                    {isHi ? y.impactHi : y.impactEn}
                  </div>

                  {y.participatingPlanets.length > 0 && (
                    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                      {y.participatingPlanets.map((p) => (
                        <span key={p} className="tag tag-varg mono small-text">
                          {trPlanet(p, lang)}
                        </span>
                      ))}
                    </div>
                  )}
                </article>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const YutiGroupCard: React.FC<{ group: ChartYutiGroup; isHi: boolean }> = ({ group, isHi }) => {
  return (
    <article className="panel" style={{ borderLeft: '4px solid var(--accent)' }}>
      <div className="panel-header">
        <div>
          <h3 style={{ margin: 0, fontSize: '16px' }}>{isHi ? group.headlineHi : group.headlineEn}</h3>
          <div className="muted small-text" style={{ marginTop: '2px' }}>
            {isHi ? group.labelHi : group.labelEn} ·{' '}
            {group.planets.map((p) => trPlanet(p, isHi ? 'hi' : 'en')).join(' + ')} ·{' '}
            {isHi ? `अंश विस्तार ${group.degreeSpanDeg}°` : `Orb span ${group.degreeSpanDeg}°`}
          </div>
        </div>
        <div className="toolbar-group">
          <span className="tag tag-karaka" style={{ fontWeight: 700 }}>
            {isHi ? `${group.count} ग्रह युति` : `${group.count}-Planet Conjunction`}
          </span>
          {group.warPairs.length > 0 && (
            <span className="tag tag-combust" style={{ fontWeight: 700 }}>
              {isHi ? `ग्रह युद्ध: ${group.warPairs.join(', ')}` : `Graha Yuddha: ${group.warPairs.join(', ')}`}
            </span>
          )}
        </div>
      </div>

      <div className="pred-card-body" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {/* Two-Column Grid: Positive Events vs Negative Events */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '12px',
          }}
        >
          <div
            style={{
              padding: '10px 14px',
              borderRadius: '6px',
              background: 'rgba(34, 197, 94, 0.08)',
              border: '1px solid rgba(34, 197, 94, 0.22)',
              fontSize: '13px',
              lineHeight: 1.5,
            }}
          >
            <strong style={{ color: '#16a34a' }}>
              <CheckCircle size={14} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
              {isHi ? 'सकारात्मक फल व उपलब्धियां:' : 'Positive Fruits & Milestones:'}
            </strong>{' '}
            {isHi ? group.positiveHi : group.positiveEn}
          </div>

          <div
            style={{
              padding: '10px 14px',
              borderRadius: '6px',
              background: 'rgba(239, 68, 68, 0.08)',
              border: '1px solid rgba(239, 68, 68, 0.22)',
              fontSize: '13px',
              lineHeight: 1.5,
            }}
          >
            <strong style={{ color: '#dc2626' }}>
              <AlertTriangle size={14} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
              {isHi ? 'नकारात्मक प्रभाव व सावधानियां:' : 'Negative Effects & Challenges:'}
            </strong>{' '}
            {isHi ? group.negativeHi : group.negativeEn}
          </div>
        </div>

        {/* Incidents & Triggers */}
        <div
          style={{
            padding: '10px 14px',
            borderRadius: '6px',
            background: 'rgba(59, 130, 246, 0.08)',
            border: '1px solid rgba(59, 130, 246, 0.22)',
            fontSize: '13px',
            lineHeight: 1.5,
          }}
        >
          <strong style={{ color: '#2563eb' }}>
            <Flame size={14} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
            {isHi ? 'प्रमुख घटना व दुर्घटना संकेत:' : 'Concrete Event & Incident Triggers:'}
          </strong>{' '}
          {isHi ? group.incidentRiskHi : group.incidentRiskEn}
        </div>

        {/* Remedy */}
        <div
          style={{
            padding: '8px 12px',
            borderRadius: '6px',
            background: 'var(--bg-subtle)',
            fontSize: '12.5px',
            lineHeight: 1.5,
          }}
        >
          <strong style={{ color: 'var(--accent)' }}>{isHi ? 'उपाय (Remedy): ' : 'Remedy: '}</strong>
          {isHi ? group.remedyHi : group.remedyEn}
        </div>

        {/* Component Pairs */}
        {group.pairInsights.length > 0 && group.count > 2 && (
          <div style={{ marginTop: '4px' }}>
            <h4 style={{ margin: '0 0 8px', fontSize: '13.5px' }}>
              {isHi
                ? `इस ${group.count}-ग्रही समूह में निर्मित प्रमुख 2-ग्रहीय युतियां (${group.pairInsights.length} जोड़े):`
                : `Component 2-Planet Pair Yutis in this ${group.count}-Planet Stellium:`}
            </h4>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                gap: '8px',
              }}
            >
              {group.pairInsights.map((pi) => (
                <div
                  key={`${pi.pair[0]}-${pi.pair[1]}`}
                  style={{
                    padding: '8px 10px',
                    borderRadius: '6px',
                    border: '1px solid var(--border)',
                    background: 'var(--bg-card)',
                    fontSize: '12.5px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '4px',
                    }}
                  >
                    <strong>{isHi ? pi.yogaNameHi : pi.yogaNameEn}</strong>
                    <span className="tag tag-karaka" style={{ fontSize: '10px' }}>
                      {trPlanet(pi.pair[0], isHi ? 'hi' : 'en')} + {trPlanet(pi.pair[1], isHi ? 'hi' : 'en')}
                    </span>
                  </div>
                  <div style={{ color: '#16a34a', marginBottom: '2px' }}>
                    <strong>+</strong> {isHi ? pi.positiveHi : pi.positiveEn}
                  </div>
                  <div style={{ color: '#dc2626', marginBottom: '2px' }}>
                    <strong>−</strong> {isHi ? pi.negativeHi : pi.negativeEn}
                  </div>
                  <div className="muted" style={{ fontSize: '11.5px' }}>
                    <strong>{isHi ? 'घटना:' : 'Event:'}</strong> {isHi ? pi.incidentHi : pi.incidentEn}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  );
};
