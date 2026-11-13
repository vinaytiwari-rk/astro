import React, { useMemo, useState } from 'react';
import { Award, BookOpen, CheckCircle, Filter, Search, Sparkles } from 'lucide-react';
import {
  CLASSICAL_YOGAS_KB,
  type ClassicalYogaCategory,
  type ClassicalYogaQuality,
  type DetectedClassicalYoga,
} from '../../astro/predictions/classicalYogasKb';
import type { ChartData } from '../../astro/types';
import { useLanguage } from '../../i18n/LanguageContext';
import { trPlanetShort } from '../../i18n/translations';

interface ClassicalYogasPanelProps {
  chart: ChartData;
  detectedYogas?: DetectedClassicalYoga[];
}

export const ClassicalYogasPanel: React.FC<ClassicalYogasPanelProps> = ({
  chart,
  detectedYogas = [],
}) => {
  const { lang, t } = useLanguage();
  const isHi = lang === 'hi';

  const [activeTab, setActiveTab] = useState<'detected' | 'all'>('detected');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [qualityFilter, setQualityFilter] = useState<string>('all');

  const detectedMap = useMemo(() => {
    const map = new Map<number, DetectedClassicalYoga>();
    for (const y of detectedYogas) map.set(y.id, y);
    return map;
  }, [detectedYogas]);

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
      // Category filter
      if (categoryFilter !== 'all' && y.category !== categoryFilter) return false;
      // Quality filter
      if (qualityFilter !== 'all' && y.quality !== qualityFilter) return false;
      // Search term
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
      <section className="panel">
        <div className="panel-header">
          <div>
            <h3>
              <Sparkles size={16} />{' '}
              {isHi
                ? `300+ शास्त्रीय वैदिक योग पुस्तकालय`
                : `300+ Classical Vedic Yogas Corpus`}
            </h3>
            <p className="muted small-text">
              {isHi
                ? `आपकी जन्मकुंडली में ${detectedYogas.length} शास्त्रीय योग प्रत्यक्ष रूप से सक्रिय पाए गए हैं।`
                : `Comprehensive canonical database of 300 classical Vedic yogas with ${detectedYogas.length} actively formed in native's chart.`}
            </p>
          </div>
          <div className="toolbar-group">
            <button
              type="button"
              className={`btn btn-sm ${activeTab === 'detected' ? 'btn-primary' : ''}`}
              onClick={() => setActiveTab('detected')}
            >
              <CheckCircle size={13} />{' '}
              {isHi ? `कुंडली में सक्रिय (${detectedYogas.length})` : `Active in Chart (${detectedYogas.length})`}
            </button>
            <button
              type="button"
              className={`btn btn-sm ${activeTab === 'all' ? 'btn-primary' : ''}`}
              onClick={() => setActiveTab('all')}
            >
              <BookOpen size={13} />{' '}
              {isHi ? `समस्त 300 योग कोश` : `All 300 Yogas Corpus`}
            </button>
          </div>
        </div>

        {/* Filter bar */}
        <div className="two-col-split-pad" style={{ paddingBottom: 0 }}>
          <div className="search-box" style={{ maxWidth: 360 }}>
            <Search size={14} style={{ marginRight: 6, opacity: 0.7 }} />
            <input
              type="text"
              placeholder={isHi ? 'योग नाम या फल खोजें...' : 'Search yoga name, rule or result...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-sm"
              style={{ width: '100%', background: 'transparent', border: 'none', outline: 'none' }}
            />
          </div>

          <div className="toolbar-group" style={{ flexWrap: 'wrap' }}>
            <select
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

            <select
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
          </div>
        </div>

        {/* Yogas Grid */}
        <div className="domains-grid" style={{ marginTop: 12 }}>
          {filteredYogas.map((y) => {
            const isDetected = detectedMap.has(y.id);
            const det = detectedMap.get(y.id);
            const strength = det?.strength;

            return (
              <article
                key={y.id}
                className="domain-card"
                style={{
                  borderLeft: isDetected
                    ? '4px solid var(--accent)'
                    : '1px solid var(--border)',
                  background: isDetected ? 'rgba(217, 119, 6, 0.04)' : undefined,
                }}
              >
                <div className="domain-top">
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span className="mono muted small-text">#{y.id}</span>
                      <h4 style={{ margin: 0 }}>{isHi ? y.nameHi : y.name}</h4>
                    </div>
                    <div className="muted small-text" style={{ marginTop: 2 }}>
                      {y.category}
                    </div>
                  </div>
                  <div className="toolbar-group">
                    {isDetected && (
                      <span className="tag tag-varg">
                        <Award size={11} style={{ verticalAlign: 'middle', marginRight: 2 }} />
                        {strength || (isHi ? 'सक्रिय' : 'Active')}
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
                    >
                      {y.quality === 'Positive'
                        ? isHi ? 'शुभ' : 'Auspicious'
                        : y.quality === 'Negative'
                          ? isHi ? 'अशुभ' : 'Challenging'
                          : isHi ? 'मिश्रित' : 'Mixed'}
                    </span>
                  </div>
                </div>

                <div className="pred-bullets" style={{ marginTop: 8 }}>
                  <div>
                    <strong>{isHi ? 'शास्त्रीय नियम:' : 'Classical Rule:'}</strong>{' '}
                    <span className="muted">
                      {isHi && 'conditionHi' in y && y.conditionHi ? y.conditionHi : y.conditionEn}
                    </span>
                  </div>
                  {det && det.planets && det.planets.length > 0 && (
                    <div>
                      <strong>{isHi ? 'सक्रिय ग्रह व भाव:' : 'Active Grahas & Houses:'}</strong>{' '}
                      <span className="tag tag-karaka" style={{ marginRight: 6 }}>
                        {det.planets.join(' + ')}
                      </span>
                      {det.houses && det.houses.length > 0 && (
                        <span className="tag tag-karaka">
                          {isHi ? `भाव ${det.houses.join(', ')}` : `House ${det.houses.join(', ')}`}
                        </span>
                      )}
                    </div>
                  )}
                  <p className="lead-text" style={{ marginTop: 6, fontSize: '0.88rem' }}>
                    {isHi ? y.resultHi : y.resultEn}
                  </p>
                </div>
              </article>
            );
          })}
        </div>

        {filteredYogas.length === 0 && (
          <div className="muted" style={{ padding: 24, textAlign: 'center' }}>
            {isHi ? 'कोई योग नहीं मिला।' : 'No yogas match the selected filter.'}
          </div>
        )}
      </section>
    </div>
  );
};
