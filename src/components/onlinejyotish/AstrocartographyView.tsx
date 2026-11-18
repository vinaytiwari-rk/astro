import React, { useMemo, useState } from 'react';
import {
  Award,
  BookOpen,
  Briefcase,
  Compass,
  DollarSign,
  Flame,
  Globe,
  Heart,
  Info,
  MapPin,
  Printer,
  Search,
  Shield,
  Sparkles,
  Zap,
} from 'lucide-react';
import {
  computeAstrocartography,
  type AstroLineType,
  type CityPowerZone,
  type PlanetaryLine,
} from '../../astro/astrocartography';
import type { ChartData, NineGrahaId } from '../../astro/types';
import { useLanguage } from '../../i18n/LanguageContext';

interface AstrocartographyViewProps {
  chart: ChartData;
  onNavigate?: (view: string) => void;
}

export const AstrocartographyView: React.FC<AstrocartographyViewProps> = ({ chart, onNavigate }) => {
  const { lang } = useLanguage();
  const isHi = lang === 'hi';

  const [selectedCategory, setSelectedCategory] = useState<'all' | 'career' | 'wealth' | 'love' | 'spirituality'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlanet, setSelectedPlanet] = useState<NineGrahaId | 'all'>('all');
  const [activeCityModal, setActiveCityModal] = useState<CityPowerZone | null>(null);

  const report = useMemo(() => computeAstrocartography(chart), [chart]);

  // Filter cities by search, category, and planet
  const filteredCities = useMemo(() => {
    return report.topPowerCities.filter((city) => {
      const matchesSearch =
        searchQuery === '' ||
        city.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        city.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
        city.countryHi.includes(searchQuery);

      if (!matchesSearch) return false;

      const hasPlanet =
        selectedPlanet === 'all' ||
        city.activeLines.some((line) => line.planetId === selectedPlanet);

      if (!hasPlanet) return false;

      if (selectedCategory === 'all') return true;
      return city.activeLines.some((line) => line.category === selectedCategory);
    });
  }, [report.topPowerCities, searchQuery, selectedCategory, selectedPlanet]);

  // SVG dimensions for World Map (Equirectangular)
  const mapWidth = 900;
  const mapHeight = 450;

  // Converts longitude (-180..180) to SVG X (0..mapWidth)
  const lonToX = (lon: number) => ((lon + 180) / 360) * mapWidth;
  // Converts latitude (-90..90) to SVG Y (mapHeight..0)
  const latToY = (lat: number) => ((90 - lat) / 180) * mapHeight;

  return (
    <div className="oj-page-container">
      {/* Breadcrumb */}
      <nav className="oj-breadcrumbs no-print" aria-label="Breadcrumb">
        <a
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            if (onNavigate) onNavigate('home');
          }}
        >
          {isHi ? 'होम' : 'Home'}
        </a>
        <span className="oj-bc-sep">/</span>
        <span className="oj-bc-current">
          {isHi ? 'एस्ट्रोकार्टोग्राफी (भू-ज्योतिष व विश्व शक्ति रेखाएं)' : 'Astrocartography & Planetary World Lines'}
        </span>
      </nav>

      {/* Header Card */}
      <div className="oj-page-header-card">
        <div className="oj-header-badge">
          {isHi
            ? 'जिम लेविस प्रतिपादित एवं वैदिक दिग्बल सिद्धांत पर आधारित विश्व भू-ग्रह वेध'
            : 'Planetary Geographic Power Lines Across 120+ Global Cities & Continents'}
        </div>
        <h1 className="oj-page-title">
          {isHi
            ? 'एस्ट्रोकार्टोग्राफी: आपकी जन्मकुंडली का वैश्विक मानचित्र'
            : 'Astrocartography: Global Horizon & Meridian Power Map'}
        </h1>
        <p className="oj-page-subtitle">
          {isHi
            ? 'जानिए पृथ्वी के किस नगर अथवा महाद्वीप में आपके ग्रहों की मध्यलग्न (MC), चतुर्थ भाव (IC), लग्न (AC) व सप्तम (DC) रेखाएं गुजरती हैं, और वह स्थान आपके कॅरियर, धन, विवाह अथवा साधना के लिए कैसा सिद्ध होगा।'
            : 'Discover how the positions of the nine grahas at your exact moment of birth project power meridians and horizon vectors across the globe to optimize career, relocation, wealth, and spiritual growth.'}
        </p>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '12px' }}>
          <button
            onClick={() => window.print()}
            className="oj-action-btn no-print"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <Printer size={15} />
            <span>{isHi ? 'मानचित्र व रिपोर्ट प्रिंट करें' : 'Print Map & Report'}</span>
          </button>
        </div>
      </div>

      {/* Map Card */}
      <div className="oj-card" style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
          <h2 className="oj-card-title" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Globe size={18} color="#d97706" />
            {isHi ? 'वैश्विक ग्रहीय रेखाएं (Interactive Planetary World Grid)' : 'Interactive Planetary World Grid'}
          </h2>
          <div style={{ fontSize: '12px', color: '#64748b' }}>
            {isHi ? 'जन्म स्थान:' : 'Birth Location:'} {chart.input.name} ({chart.input.latitude.toFixed(2)}°, {chart.input.longitude.toFixed(2)}°)
          </div>
        </div>

        {/* Planet filter selector */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '14px' }}>
          <button
            onClick={() => setSelectedPlanet('all')}
            className={`oj-tab-pill ${selectedPlanet === 'all' ? 'is-active' : ''}`}
            style={{ fontSize: '11px', padding: '4px 10px' }}
          >
            {isHi ? 'समस्त ९ ग्रह' : 'All 9 Planets'}
          </button>
          {report.planetaryLines.map((line) => (
            <button
              key={line.planetId}
              onClick={() => setSelectedPlanet(line.planetId)}
              className={`oj-tab-pill ${selectedPlanet === line.planetId ? 'is-active' : ''}`}
              style={{
                fontSize: '11px',
                padding: '4px 10px',
                borderLeft: `4px solid ${line.color}`,
              }}
            >
              {isHi ? line.planetNameHi : line.planetNameEn}
            </button>
          ))}
        </div>

        {/* SVG World Map */}
        <div style={{ overflowX: 'auto', background: '#0b1329', borderRadius: '8px', padding: '8px', border: '1px solid #1e293b' }}>
          <svg
            viewBox={`0 0 ${mapWidth} ${mapHeight}`}
            style={{ width: '100%', height: 'auto', minWidth: '650px', display: 'block' }}
          >
            {/* World Grid Lines */}
            {[-120, -60, 0, 60, 120].map((lon) => (
              <line
                key={`grid-lon-${lon}`}
                x1={lonToX(lon)}
                y1={0}
                x2={lonToX(lon)}
                y2={mapHeight}
                stroke="#1e293b"
                strokeWidth="1"
                strokeDasharray="4 4"
              />
            ))}
            {[-60, -30, 0, 30, 60].map((lat) => (
              <line
                key={`grid-lat-${lat}`}
                x1={0}
                y1={latToY(lat)}
                x2={mapWidth}
                y2={latToY(lat)}
                stroke="#1e293b"
                strokeWidth="1"
                strokeDasharray="4 4"
              />
            ))}

            {/* Equator */}
            <line x1={0} y1={latToY(0)} x2={mapWidth} y2={latToY(0)} stroke="#334155" strokeWidth="1.5" />
            {/* Prime Meridian */}
            <line x1={lonToX(0)} y1={0} x2={lonToX(0)} y2={mapHeight} stroke="#334155" strokeWidth="1.5" />

            {/* Continents Outline approximation */}
            <text x="140" y="160" fill="#334155" fontSize="12" fontWeight="600">NORTH AMERICA</text>
            <text x="260" y="320" fill="#334155" fontSize="12" fontWeight="600">SOUTH AMERICA</text>
            <text x="470" y="140" fill="#334155" fontSize="12" fontWeight="600">EUROPE</text>
            <text x="480" y="250" fill="#334155" fontSize="12" fontWeight="600">AFRICA</text>
            <text x="660" y="160" fill="#334155" fontSize="12" fontWeight="600">ASIA</text>
            <text x="760" y="330" fill="#334155" fontSize="12" fontWeight="600">AUSTRALIA</text>

            {/* Native Birth Place Beacon */}
            <g>
              <circle
                cx={lonToX(chart.input.longitude)}
                cy={latToY(chart.input.latitude)}
                r="6"
                fill="#fbbf24"
                stroke="#ffffff"
                strokeWidth="2"
              />
              <circle
                cx={lonToX(chart.input.longitude)}
                cy={latToY(chart.input.latitude)}
                r="12"
                fill="none"
                stroke="#fbbf24"
                strokeWidth="1"
                opacity="0.6"
              />
              <text
                x={lonToX(chart.input.longitude) + 8}
                y={latToY(chart.input.latitude) - 6}
                fill="#fde68a"
                fontSize="10"
                fontWeight="bold"
              >
                {isHi ? 'जन्म स्थल' : 'Birthplace'}
              </text>
            </g>

            {/* Render Planetary Lines */}
            {report.planetaryLines
              .filter((line) => selectedPlanet === 'all' || line.planetId === selectedPlanet)
              .map((line) => {
                const mcX = lonToX(line.mcLongitude);
                const icX = lonToX(line.icLongitude);

                return (
                  <g key={line.planetId}>
                    {/* MC Line (Midheaven - Career & Zenith) */}
                    <line
                      x1={mcX}
                      y1={0}
                      x2={mcX}
                      y2={mapHeight}
                      stroke={line.color}
                      strokeWidth={selectedPlanet === line.planetId ? '3' : '1.8'}
                      opacity={selectedPlanet === 'all' ? 0.75 : 1}
                    />
                    <text
                      x={mcX + 3}
                      y={18}
                      fill={line.color}
                      fontSize="9"
                      fontWeight="bold"
                    >
                      {isHi ? line.planetNameHi : line.planetNameEn} MC
                    </text>

                    {/* IC Line (Nadir - Home & Roots) */}
                    <line
                      x1={icX}
                      y1={0}
                      x2={icX}
                      y2={mapHeight}
                      stroke={line.color}
                      strokeWidth="1.2"
                      strokeDasharray="5 3"
                      opacity={selectedPlanet === 'all' ? 0.6 : 0.9}
                    />
                    <text
                      x={icX + 3}
                      y={mapHeight - 10}
                      fill={line.color}
                      fontSize="9"
                    >
                      {isHi ? line.planetNameHi : line.planetNameEn} IC
                    </text>
                  </g>
                );
              })}

            {/* Plot Top Power Cities on map */}
            {filteredCities.slice(0, 40).map((city) => {
              const cx = lonToX(city.longitude);
              const cy = latToY(city.latitude);
              const topImpact = city.activeLines[0];
              const dotColor =
                topImpact?.category === 'career'
                  ? '#3b82f6'
                  : topImpact?.category === 'wealth'
                  ? '#10b981'
                  : topImpact?.category === 'love'
                  ? '#ec4899'
                  : '#a855f7';

              return (
                <g
                  key={`${city.city}-${city.country}`}
                  style={{ cursor: 'pointer' }}
                  onClick={() => setActiveCityModal(city)}
                >
                  <circle
                    cx={cx}
                    cy={cy}
                    r="4"
                    fill={dotColor}
                    stroke="#ffffff"
                    strokeWidth="1"
                  />
                  <text
                    x={cx + 5}
                    y={cy + 3}
                    fill="#e2e8f0"
                    fontSize="8.5"
                    fontWeight="500"
                  >
                    {city.city}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginTop: '12px', fontSize: '11px', color: '#64748b' }}>
          <div>
            <strong style={{ color: '#0284c7' }}>MC (Midheaven / दशम):</strong> {isHi ? 'कॅरियर, प्रतिष्ठा, सामाजिक प्रभाव' : 'Career, Status, Public Leadership'}
          </div>
          <div>
            <strong style={{ color: '#0d9488' }}>IC (Nadir / चतुर्थ):</strong> {isHi ? 'गृह, मनःशांति, पैतृक सुख, अचल संपत्ति' : 'Home, Peace, Ancestral Roots, Real Estate'}
          </div>
          <div>
            <strong style={{ color: '#e11d48' }}>AC (Ascendant / लग्न):</strong> {isHi ? 'व्यक्तिगत कायाकल्प, स्वास्थ्य, आत्मविश्वास' : 'Vitality, Self-Transformation, Charisma'}
          </div>
          <div>
            <strong style={{ color: '#7c3aed' }}>DC (Descendant / सप्तम):</strong> {isHi ? 'विवाह, साझेदारी, जनसंपर्क' : 'Partnership, Marriage, Public Relations'}
          </div>
        </div>
      </div>

      {/* Objective Recommendations */}
      <div className="oj-card" style={{ marginBottom: '20px' }}>
        <h2 className="oj-card-title">
          <Award size={18} color="#d97706" />
          {isHi ? 'जीवन लक्ष्यों के अनुसार सर्वोत्तम वैश्विक स्थल' : 'Top Geographic Recommendations by Life Domain'}
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px', marginTop: '12px' }}>
          {report.objectiveRecommendations.map((rec) => (
            <div
              key={rec.category}
              style={{
                background: '#fafaf9',
                border: '1px solid #e7e5e4',
                borderRadius: '8px',
                padding: '12px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 'bold', fontSize: '13px', color: '#854d0e', marginBottom: '8px' }}>
                {rec.category === 'Career & Professional Eminence' && <Briefcase size={16} />}
                {rec.category === 'Wealth, Commerce & Abundance' && <DollarSign size={16} />}
                {rec.category === 'Soulmate, Marriage & Harmonious Relationships' && <Heart size={16} />}
                {rec.category === 'Spiritual Awakening & Internal Peace' && <Sparkles size={16} />}
                <span>{isHi ? rec.categoryHi : rec.category}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {rec.bestCities.map((c) => (
                  <div key={c.city} style={{ fontSize: '12px', borderLeft: '3px solid #d97706', paddingLeft: '8px' }}>
                    <div style={{ fontWeight: 600, color: '#1e293b' }}>
                      {c.city}, {c.country}
                    </div>
                    <div style={{ color: '#475569', fontSize: '11px', marginTop: '2px' }}>
                      {isHi ? c.reasonHi : c.reasonEn}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* City Power Zones Filter & List */}
      <div className="oj-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '14px' }}>
          <h2 className="oj-card-title" style={{ margin: 0 }}>
            <MapPin size={18} color="#d97706" />
            {isHi ? '१२०+ वैश्विक महानगरों का शक्ति विश्लेषण' : '120+ Global Power Cities Breakdown'}
          </h2>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
            {/* Search Box */}
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Search size={14} style={{ position: 'absolute', left: '8px', color: '#94a3b8' }} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isHi ? 'शहर या देश खोजें...' : 'Search city or country...'}
                style={{
                  padding: '5px 8px 5px 28px',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  fontSize: '12px',
                  width: '180px',
                }}
              />
            </div>

            {/* Category tabs */}
            <button
              onClick={() => setSelectedCategory('all')}
              className={`oj-tab-pill ${selectedCategory === 'all' ? 'is-active' : ''}`}
              style={{ fontSize: '11px', padding: '4px 8px' }}
            >
              {isHi ? 'सभी' : 'All'}
            </button>
            <button
              onClick={() => setSelectedCategory('career')}
              className={`oj-tab-pill ${selectedCategory === 'career' ? 'is-active' : ''}`}
              style={{ fontSize: '11px', padding: '4px 8px' }}
            >
              {isHi ? 'कॅरियर (MC)' : 'Career'}
            </button>
            <button
              onClick={() => setSelectedCategory('wealth')}
              className={`oj-tab-pill ${selectedCategory === 'wealth' ? 'is-active' : ''}`}
              style={{ fontSize: '11px', padding: '4px 8px' }}
            >
              {isHi ? 'धन (Wealth)' : 'Wealth'}
            </button>
            <button
              onClick={() => setSelectedCategory('love')}
              className={`oj-tab-pill ${selectedCategory === 'love' ? 'is-active' : ''}`}
              style={{ fontSize: '11px', padding: '4px 8px' }}
            >
              {isHi ? 'संबंध (Love)' : 'Love'}
            </button>
            <button
              onClick={() => setSelectedCategory('spirituality')}
              className={`oj-tab-pill ${selectedCategory === 'spirituality' ? 'is-active' : ''}`}
              style={{ fontSize: '11px', padding: '4px 8px' }}
            >
              {isHi ? 'अध्यात्म (Peace)' : 'Peace'}
            </button>
          </div>
        </div>

        {/* Cities Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '12px' }}>
          {filteredCities.map((city) => (
            <div
              key={`${city.city}-${city.country}`}
              style={{
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '12px',
                background: '#ffffff',
                boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '6px' }}>
                <span style={{ fontWeight: 700, fontSize: '14px', color: '#1e293b' }}>
                  {city.city}
                </span>
                <span style={{ fontSize: '11px', color: '#64748b' }}>
                  {isHi ? city.countryHi : city.country}
                </span>
              </div>
              <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '8px' }}>
                {city.latitude.toFixed(1)}°N, {city.longitude.toFixed(1)}°E
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {city.activeLines.map((line, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: '6px 8px',
                      borderRadius: '6px',
                      background:
                        line.category === 'career'
                          ? '#eff6ff'
                          : line.category === 'wealth'
                          ? '#ecfdf5'
                          : line.category === 'love'
                          ? '#fdf2f8'
                          : '#faf5ff',
                      borderLeft: `3px solid ${
                        line.category === 'career'
                          ? '#3b82f6'
                          : line.category === 'wealth'
                          ? '#10b981'
                          : line.category === 'love'
                          ? '#ec4899'
                          : '#a855f7'
                      }`,
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: 600 }}>
                      <span style={{ color: '#1e293b' }}>
                        {line.planetNameHi} {line.lineType} रेखा
                      </span>
                      <span style={{ color: '#64748b', fontSize: '10px' }}>
                        {line.intensity}
                      </span>
                    </div>
                    <div style={{ fontSize: '11px', color: '#334155', marginTop: '2px' }}>
                      {isHi ? line.impactHi : line.impactEn}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {filteredCities.length === 0 && (
          <div style={{ textAlign: 'center', padding: '30px', color: '#94a3b8', fontSize: '13px' }}>
            {isHi ? 'कोई नगर इस फ़िल्टर के अनुकूल नहीं मिला।' : 'No cities matched your current search / filter.'}
          </div>
        )}
      </div>

      {/* Modal / Popup for clicked city */}
      {activeCityModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '16px',
          }}
          onClick={() => setActiveCityModal(null)}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: '12px',
              maxWidth: '480px',
              width: '100%',
              padding: '20px',
              boxShadow: '0 20px 25px -5px rgba(0,0,0,0.2)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '18px', color: '#1e293b' }}>
                  {activeCityModal.city}, {isHi ? activeCityModal.countryHi : activeCityModal.country}
                </h3>
                <div style={{ fontSize: '12px', color: '#64748b' }}>
                  {activeCityModal.latitude.toFixed(2)}°, {activeCityModal.longitude.toFixed(2)}°
                </div>
              </div>
              <button
                onClick={() => setActiveCityModal(null)}
                style={{
                  border: 'none',
                  background: '#f1f5f9',
                  borderRadius: '50%',
                  width: '28px',
                  height: '28px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {activeCityModal.activeLines.map((line, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '10px',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    background: '#f8fafc',
                  }}
                >
                  <div style={{ fontWeight: 600, fontSize: '13px', color: '#0f172a', marginBottom: '4px' }}>
                    {line.planetNameHi} {line.lineType} ({line.intensity})
                  </div>
                  <div style={{ fontSize: '12px', color: '#334155' }}>
                    {isHi ? line.impactHi : line.impactEn}
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

export default AstrocartographyView;
