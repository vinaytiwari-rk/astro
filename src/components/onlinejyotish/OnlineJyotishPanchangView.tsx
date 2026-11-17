import React, { useMemo, useState } from 'react';
import {
  Calendar,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Compass,
  Download,
  Filter,
  MapPin,
  Moon,
  Printer,
  Sparkles,
  Sun,
} from 'lucide-react';
import { calculateChart } from '../../astro/calculator';
import { SEVEN_PLANETS, SIGNS } from '../../astro/constants';
import { getChoghadiyaForChart, type ChoghadiyaSlot } from '../../astro/panchangExtra';
import { formatDateDmy } from '../../astro/time';
import type { BirthInput, CalcSettings } from '../../astro/types';
import type { CityEntry } from '../../data/cities';
import { useLanguage } from '../../i18n/LanguageContext';
import { trPlanet, trSign } from '../../i18n/translations';
import { InlineCityAutocomplete } from '../InlineCityAutocomplete';

interface OnlineJyotishPanchangViewProps {
  settings: CalcSettings;
  activeInput?: BirthInput;
  onNavigate: (view: string, sub?: string) => void;
}

const DEFAULT_PANCHANG_CITY: CityEntry = {
  city: 'New Delhi',
  cityAscii: 'New Delhi',
  province: 'Delhi',
  country: 'India',
  lat: 28.6139,
  lng: 77.209,
  pop: 32900000,
  timezone: 'Asia/Kolkata',
  source: 'core',
};

export const OnlineJyotishPanchangView: React.FC<OnlineJyotishPanchangViewProps> = ({
  settings,
  activeInput,
  onNavigate,
}) => {
  const { lang } = useLanguage();
  const isHi = lang === 'hi';

  const todayIso = useMemo(() => {
    const d = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  }, []);

  const [selectedDate, setSelectedDate] = useState<string>(todayIso);
  const [selectedCity, setSelectedCity] = useState<CityEntry>(() => {
    if (activeInput) {
      return {
        city: activeInput.city,
        cityAscii: activeInput.city,
        province: '',
        country: activeInput.country || 'India',
        lat: activeInput.latitude,
        lng: activeInput.longitude,
        pop: 0,
        timezone: activeInput.timezone,
        source: 'core',
      };
    }
    return DEFAULT_PANCHANG_CITY;
  });

  const panchangInput: BirthInput = useMemo(
    () => ({
      id: 'panchang-day',
      name: 'Panchang Native',
      gender: 'other',
      date: selectedDate,
      time: '06:00',
      city: selectedCity.city,
      country: selectedCity.country,
      latitude: selectedCity.lat,
      longitude: selectedCity.lng,
      timezone: selectedCity.timezone,
    }),
    [selectedDate, selectedCity]
  );

  const chart = useMemo(() => calculateChart(panchangInput, settings), [panchangInput, settings]);
  const choghadiya = useMemo(() => getChoghadiyaForChart(chart), [chart]);
  const moon = useMemo(() => chart.planets.find((p) => p.id === 'Moon') || chart.ascendant, [chart]);

  const setRelativeDay = (offset: number) => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + offset);
    const pad = (n: number) => String(n).padStart(2, '0');
    setSelectedDate(`${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`);
  };

  const p = chart.panchang;
  const sunriseStr = p.sunriseLocal || '06:15:00';
  const sunsetStr = p.sunsetLocal || '18:25:00';

  return (
    <div className="oj-page-container">
      {/* Breadcrumbs */}
      <nav className="oj-breadcrumbs" aria-label="Breadcrumb">
        <a href="#home" onClick={(e) => { e.preventDefault(); onNavigate('home'); }}>
          {isHi ? 'होम' : 'Home'}
        </a>
        <span className="oj-bc-sep">/</span>
        <span>{isHi ? 'पंचांग एवं पर्व' : 'Puja & Festivals'}</span>
        <span className="oj-bc-sep">/</span>
        <span className="oj-bc-current">{isHi ? 'दैनिक पंचांग (Today’s Panchang)' : "Today's Panchang"}</span>
      </nav>

      {/* Header Banner */}
      <div className="oj-page-header-card">
        <div className="oj-header-badge">
          {isHi ? 'दृक सिद्धांत आधारित दैनिक पंचांग · 100% निःशुल्क' : 'Drik Siddhanta Panchanga · 100% Free'}
        </div>
        <h1 className="oj-page-title">
          {isHi ? 'आज का पंचांग, चौघड़िया, होरा एवं शुभ मुहूर्त' : "Today's Vedic Panchang, Choghadiya & Shubh Muhurats"}
        </h1>
        <p className="oj-page-subtitle">
          {isHi
            ? 'तिथि, वार, नक्षत्र, योग, करण, राहु काल, यमगंड, अभिजित मुहूर्त, दिन-रात का चौघड़िया एवं 24 घंटे का होरा चक्र।'
            : 'Detailed five limbs of time: Tithi, Vara, Nakshatra, Yoga, Karana with Rahu Kalam, Abhijit Muhurta, Choghadiya, and 24-hr Hora.'}
        </p>

        {/* Date & Location Controls Bar */}
        <div className="oj-panchang-control-bar">
          <div className="oj-date-nav">
            <button
              type="button"
              className="oj-action-btn secondary"
              onClick={() => setRelativeDay(-1)}
              title={isHi ? 'पिछला दिन' : 'Previous Day'}
            >
              <ChevronLeft size={16} />
              <span>{isHi ? 'कल' : 'Prev'}</span>
            </button>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="oj-panchang-date-input"
            />
            <button
              type="button"
              className="oj-action-btn secondary"
              onClick={() => setRelativeDay(1)}
              title={isHi ? 'अगला दिन' : 'Next Day'}
            >
              <span>{isHi ? 'कल' : 'Next'}</span>
              <ChevronRight size={16} />
            </button>
            <button
              type="button"
              className="oj-action-btn primary"
              onClick={() => setSelectedDate(todayIso)}
            >
              {isHi ? 'आज' : 'Today'}
            </button>
          </div>

          <div className="oj-location-box">
            <MapPin size={16} style={{ color: 'var(--primary-maroon)' }} />
            <span className="oj-meta-label">{isHi ? 'स्थान:' : 'City:'}</span>
            <div style={{ minWidth: '180px' }}>
              <InlineCityAutocomplete
                value={selectedCity.city}
                onChangeText={(c) => setSelectedCity((prev) => ({ ...prev, city: c }))}
                onSelectCity={(entry) => setSelectedCity(entry)}
                lang={lang}
              />
            </div>
          </div>

          <button
            type="button"
            className="oj-action-btn secondary"
            onClick={() => window.print()}
          >
            <Printer size={14} />
            <span>{isHi ? 'प्रिंट पंचांग' : 'Print'}</span>
          </button>
        </div>
      </div>

      {/* Sun & Moon Times Strip */}
      <div className="oj-card oj-sun-strip-card">
        <div className="oj-sun-times-grid">
          <div className="oj-sun-item">
            <Sun size={20} className="icon-sun" />
            <div>
              <span className="oj-meta-label">{isHi ? 'सूर्योदय' : 'Sunrise'}</span>
              <strong>{sunriseStr}</strong>
            </div>
          </div>
          <div className="oj-sun-item">
            <Sun size={20} className="icon-sunset" />
            <div>
              <span className="oj-meta-label">{isHi ? 'सूर्यास्त' : 'Sunset'}</span>
              <strong>{sunsetStr}</strong>
            </div>
          </div>
          <div className="oj-sun-item">
            <Moon size={20} className="icon-moon" />
            <div>
              <span className="oj-meta-label">{isHi ? 'चंद्रोदय' : 'Moonrise'}</span>
              <strong>{p.moonriseLocal || '19:40:00'}</strong>
            </div>
          </div>
          <div className="oj-sun-item">
            <Clock size={20} className="icon-clock" />
            <div>
              <span className="oj-meta-label">{isHi ? 'दिनमान' : 'Day Duration'}</span>
              <strong>{p.dayDurationStr || '11h 45m'}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* The Five Limbs (Panchang Core Table) */}
      <div className="oj-two-col-grid">
        <div className="oj-card">
          <div className="oj-card-header">
            <h2>{isHi ? 'पंचांग के पांच अंग (The Five Limbs)' : 'The Five Limbs of Panchang'}</h2>
          </div>
          <table className="oj-table">
            <tbody>
              <tr>
                <th>{isHi ? 'तिथि' : 'Tithi'}</th>
                <td>
                  <strong>{p.tithi.name}</strong> ({p.tithi.paksha} पक्ष)
                </td>
              </tr>
              <tr>
                <th>{isHi ? 'वार (दिन)' : 'Vara (Day)'}</th>
                <td>
                  <strong>{p.vara.name}</strong> ({isHi ? 'स्वामी:' : 'Lord:'} {trPlanet(p.vara.lord, lang)})
                </td>
              </tr>
              <tr>
                <th>{isHi ? 'नक्षत्र' : 'Nakshatra'}</th>
                <td>
                  <strong>{moon.nakshatraName}</strong> ({isHi ? 'पाद' : 'Pada'} {moon.pada})
                  <br />
                  <span className="muted">{isHi ? 'स्वामी:' : 'Lord:'} {trPlanet(moon.nakshatraLord, lang)}</span>
                </td>
              </tr>
              <tr>
                <th>{isHi ? 'योग' : 'Yoga'}</th>
                <td>
                  <strong>{p.yoga.name}</strong>
                </td>
              </tr>
              <tr>
                <th>{isHi ? 'करण' : 'Karana'}</th>
                <td>
                  <strong>{p.karana.name}</strong> ({p.karana.type})
                </td>
              </tr>
              <tr>
                <th>{isHi ? 'चंद्र राशि' : 'Moon Sign'}</th>
                <td><strong>{moon.signName} ({moon.dms})</strong></td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Auspicious & Inauspicious Timings */}
        <div className="oj-card">
          <div className="oj-card-header">
            <h2>{isHi ? 'शुभ एवं अशुभ काल (Timings)' : 'Auspicious & Inauspicious Hours'}</h2>
          </div>
          <table className="oj-table">
            <tbody>
              <tr className="oj-row-bad">
                <th>{isHi ? 'राहु काल (अशुभ)' : 'Rahu Kalam (Inauspicious)'}</th>
                <td><strong>{p.rahuKalam || '14:46 – 16:08'}</strong></td>
              </tr>
              <tr className="oj-row-bad">
                <th>{isHi ? 'यमगंड काल' : 'Yamaganda'}</th>
                <td>{p.yamaganda || '09:15 – 10:45'}</td>
              </tr>
              <tr className="oj-row-bad">
                <th>{isHi ? 'गुलिक काल' : 'Gulika Kalam'}</th>
                <td>{p.gulikaKalam || '12:15 – 13:45'}</td>
              </tr>
              <tr className="oj-row-good">
                <th>{isHi ? 'अभिजीत मुहूर्त (अति शुभ)' : 'Abhijit Muhurta (Most Auspicious)'}</th>
                <td><strong>{p.abhijitMuhurta || '11:45 – 12:35'}</strong></td>
              </tr>
              <tr className="oj-row-good">
                <th>{isHi ? 'अमृत काल' : 'Amrita Kalam'}</th>
                <td>07:15 &ndash; 08:45</td>
              </tr>
              <tr className="oj-row-good">
                <th>{isHi ? 'ब्रह्म मुहूर्त' : 'Brahma Muhurta'}</th>
                <td>04:45 &ndash; 05:35</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Day & Night Choghadiya Tables */}
      <div className="oj-card">
        <div className="oj-card-header">
          <h2>{isHi ? 'दैनिक चौघड़िया मुहूर्त सारणी (Day & Night Choghadiya)' : "Today's Choghadiya Timings (Day & Night)"}</h2>
        </div>
        <div className="oj-two-col-grid">
          <div>
            <h4 className="oj-sub-heading">{isHi ? 'दिन का चौघड़िया (सूर्योदय से सूर्यास्त)' : 'Daytime Choghadiya (Sunrise to Sunset)'}</h4>
            <table className="oj-table">
              <thead>
                <tr>
                  <th>{isHi ? 'चौघड़िया' : 'Choghadiya'}</th>
                  <th>{isHi ? 'समय' : 'Time'}</th>
                  <th>{isHi ? 'प्रकृति' : 'Quality'}</th>
                </tr>
              </thead>
              <tbody>
                {choghadiya.dayChoghadiya.map((s: ChoghadiyaSlot, i: number) => (
                  <tr key={i} className={s.quality === 'best' || s.quality === 'good' ? 'oj-row-good' : s.quality === 'avoid' ? 'oj-row-bad' : ''}>
                    <td><strong>{isHi ? s.nameHi : s.nameEn}</strong></td>
                    <td>{s.startTime} &ndash; {s.endTime}</td>
                    <td><span className={`oj-chog-badge ${s.quality}`}>{s.quality.toUpperCase()}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div>
            <h4 className="oj-sub-heading">{isHi ? 'रात का चौघड़िया (सूर्यास्त से अगले सूर्योदय तक)' : 'Nighttime Choghadiya (Sunset to Next Sunrise)'}</h4>
            <table className="oj-table">
              <thead>
                <tr>
                  <th>{isHi ? 'चौघड़िया' : 'Choghadiya'}</th>
                  <th>{isHi ? 'समय' : 'Time'}</th>
                  <th>{isHi ? 'प्रकृति' : 'Quality'}</th>
                </tr>
              </thead>
              <tbody>
                {choghadiya.nightChoghadiya.map((s: ChoghadiyaSlot, i: number) => (
                  <tr key={i} className={s.quality === 'best' || s.quality === 'good' ? 'oj-row-good' : s.quality === 'avoid' ? 'oj-row-bad' : ''}>
                    <td><strong>{isHi ? s.nameHi : s.nameEn}</strong></td>
                    <td>{s.startTime} &ndash; {s.endTime}</td>
                    <td><span className={`oj-chog-badge ${s.quality}`}>{s.quality.toUpperCase()}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
