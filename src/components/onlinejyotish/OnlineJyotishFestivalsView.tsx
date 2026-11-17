import React, { useMemo, useState } from 'react';
import {
  Calendar,
  Clock,
  Download,
  Filter,
  MapPin,
  Moon,
  Printer,
  Sparkles,
  Sun,
} from 'lucide-react';
import { computeAnnualHinduCalendar, type HinduCalendarEvent } from '../../astro/panchangExtra';
import { formatDateDmy } from '../../astro/time';
import { useLanguage } from '../../i18n/LanguageContext';

interface OnlineJyotishFestivalsViewProps {
  onNavigate: (view: string, sub?: string) => void;
}

export const OnlineJyotishFestivalsView: React.FC<OnlineJyotishFestivalsViewProps> = ({
  onNavigate,
}) => {
  const { lang } = useLanguage();
  const isHi = lang === 'hi';

  const [selectedFilter, setSelectedFilter] = useState<'all' | 'ekadashi' | 'pradosham' | 'sankashti' | 'major'>('all');
  const [selectedYear, setSelectedYear] = useState<number>(2026);

  const annualEvents = useMemo(() => {
    return computeAnnualHinduCalendar(selectedYear, 'lahiri');
  }, [selectedYear]);

  const filteredFestivals = useMemo(() => {
    return annualEvents.filter((f) => {
      if (selectedFilter === 'all') return true;
      if (selectedFilter === 'ekadashi') {
        return f.category === 'ekadashi' || f.nameEn.toLowerCase().includes('ekadashi') || f.nameHi.includes('एकादशी');
      }
      if (selectedFilter === 'pradosham') {
        return f.nameEn.toLowerCase().includes('pradosh') || f.nameHi.includes('प्रदोष');
      }
      if (selectedFilter === 'sankashti') {
        return f.nameEn.toLowerCase().includes('chaturthi') || f.nameHi.includes('चतुर्थी');
      }
      if (selectedFilter === 'major') {
        return f.category === 'festival' || f.category === 'sankranti';
      }
      return true;
    });
  }, [annualEvents, selectedFilter]);

  return (
    <div className="oj-page-container">
      {/* Breadcrumb */}
      <nav className="oj-breadcrumbs" aria-label="Breadcrumb">
        <a href="#home" onClick={(e) => { e.preventDefault(); onNavigate('home'); }}>
          {isHi ? 'होम' : 'Home'}
        </a>
        <span className="oj-bc-sep">/</span>
        <span>{isHi ? 'पंचांग एवं पर्व' : 'Puja & Festivals'}</span>
        <span className="oj-bc-sep">/</span>
        <span className="oj-bc-current">{isHi ? 'हिंदू पर्व एवं व्रत कैलेंडर (Festivals)' : 'Hindu Festival Calendar'}</span>
      </nav>

      {/* Header Banner */}
      <div className="oj-page-header-card">
        <div className="oj-header-badge">
          {isHi ? 'दृक सिद्धांत आधारित हिंदू पर्व एवं व्रत · 100% निःशुल्क' : 'Drik Siddhanta Hindu Festivals & Vrats · 100% Free'}
        </div>
        <h1 className="oj-page-title">
          {isHi ? `हिंदू पर्व, व्रत एवं उत्सव कैलेंडर (${selectedYear})` : `Hindu Festival & Vrat Calendar (${selectedYear})`}
        </h1>
        <p className="oj-page-subtitle">
          {isHi
            ? 'एकादशी, प्रदोष व्रत, संकष्टी चतुर्थी, पूर्णिमा, अमावस्या, नवरात्रि, शिवरात्रि, दीपावली एवं संक्रांति की प्रामाणिक तिथियां।'
            : 'Authentic dates and tithis for Ekadashi, Pradosham, Sankashti Chaturthi, Purnima, Amavasya, Navaratri, and Sankranti.'}
        </p>

        {/* Filter Pills */}
        <div className="oj-panchang-control-bar">
          <div className="oj-btn-group">
            <button
              type="button"
              className={`oj-action-btn ${selectedYear === 2026 ? 'primary' : 'secondary'}`}
              onClick={() => setSelectedYear(2026)}
            >
              2026
            </button>
            <button
              type="button"
              className={`oj-action-btn ${selectedYear === 2027 ? 'primary' : 'secondary'}`}
              onClick={() => setSelectedYear(2027)}
            >
              2027
            </button>
          </div>

          <div className="oj-filter-pill-bar">
            <button
              type="button"
              className={`oj-varga-btn ${selectedFilter === 'all' ? 'is-active' : ''}`}
              onClick={() => setSelectedFilter('all')}
            >
              {isHi ? 'समस्त पर्व' : 'All Festivals'}
            </button>
            <button
              type="button"
              className={`oj-varga-btn ${selectedFilter === 'ekadashi' ? 'is-active' : ''}`}
              onClick={() => setSelectedFilter('ekadashi')}
            >
              {isHi ? 'एकादशी व्रत' : 'Ekadashi Dates'}
            </button>
            <button
              type="button"
              className={`oj-varga-btn ${selectedFilter === 'pradosham' ? 'is-active' : ''}`}
              onClick={() => setSelectedFilter('pradosham')}
            >
              {isHi ? 'प्रदोष व्रत' : 'Pradosham'}
            </button>
            <button
              type="button"
              className={`oj-varga-btn ${selectedFilter === 'sankashti' ? 'is-active' : ''}`}
              onClick={() => setSelectedFilter('sankashti')}
            >
              {isHi ? 'संकष्टी चतुर्थी' : 'Sankashti'}
            </button>
            <button
              type="button"
              className={`oj-varga-btn ${selectedFilter === 'major' ? 'is-active' : ''}`}
              onClick={() => setSelectedFilter('major')}
            >
              {isHi ? 'प्रमुख त्योहार' : 'Major Festivals'}
            </button>
          </div>
        </div>
      </div>

      {/* Festivals Table */}
      <div className="oj-card">
        <div className="oj-card-header">
          <h2>{isHi ? `पर्व एवं व्रत तालिका (${filteredFestivals.length} पर्व)` : `Festivals & Vrat Schedule (${filteredFestivals.length} Events)`}</h2>
        </div>
        <div className="oj-table-wrapper">
          <table className="oj-table">
            <thead>
              <tr>
                <th>{isHi ? 'दिनांक' : 'Date (DD-MM-YYYY)'}</th>
                <th>{isHi ? 'वार' : 'Day'}</th>
                <th>{isHi ? 'पर्व / व्रत का नाम' : 'Festival / Vrat'}</th>
                <th>{isHi ? 'श्रेणी' : 'Category'}</th>
                <th>{isHi ? 'तिथि विवरण' : 'Tithi Details'}</th>
              </tr>
            </thead>
            <tbody>
              {filteredFestivals.map((f: HinduCalendarEvent, i: number) => {
                const d = new Date(f.date + 'T12:00:00Z');
                const dayOfWeek = d.toLocaleDateString(isHi ? 'hi-IN' : 'en-US', { weekday: 'short' });
                const isMajor = f.category === 'festival' || f.category === 'sankranti';
                return (
                  <tr key={i} className={isMajor ? 'oj-row-highlight' : ''}>
                    <td><strong>{formatDateDmy(f.date)}</strong></td>
                    <td>{dayOfWeek}</td>
                    <td>
                      <strong style={{ color: isMajor ? 'var(--primary-maroon)' : 'var(--accent)' }}>
                        {isHi ? f.nameHi : f.nameEn}
                      </strong>
                      {isMajor && <span className="oj-major-tag">{isHi ? 'प्रमुख' : 'Major'}</span>}
                    </td>
                    <td>
                      <span className="oj-badge-popular">
                        {f.category.replace('_', ' ').toUpperCase()}
                      </span>
                    </td>
                    <td>{isHi ? f.tithiNoteHi : f.tithiNoteEn}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
