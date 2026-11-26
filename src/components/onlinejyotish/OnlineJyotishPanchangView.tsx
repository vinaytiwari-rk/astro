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
import { computeSunriseSunsetForLocalDay } from '../../astro/ephemeris';
import {
  getChoghadiyaForChart,
  computeAnnualHinduCalendar,
  computeDailyPanchangExtras,
  type ChoghadiyaSlot,
  type HinduCalendarEvent,
} from '../../astro/panchangExtra';
import { formatDateDmy, formatLocalTimeFromUtc } from '../../astro/time';
import type { BirthInput, CalcSettings } from '../../astro/types';
import type { CityEntry } from '../../data/cities';
import { useLanguage } from '../../i18n/LanguageContext';
import { trPlanet, trSign } from '../../i18n/translations';
import { InlineCityAutocomplete } from '../InlineCityAutocomplete';
import { DateDmyInput } from '../DateDmyInput';

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
  const [panchangViewTab, setPanchangViewTab] = useState<'daily' | 'monthly'>('daily');
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

  // Probe at local noon first so we get true timezone offset and exact local Sunrise
  const noonProbeChart = useMemo(
    () =>
      calculateChart(
        {
          id: 'panchang-probe',
          name: 'Panchang Native',
          gender: 'other',
          date: selectedDate,
          time: '12:00',
          city: selectedCity.city,
          country: selectedCity.country,
          latitude: selectedCity.lat,
          longitude: selectedCity.lng,
          timezone: selectedCity.timezone,
        },
        settings
      ),
    [selectedDate, selectedCity, settings]
  );

  const panchangExtras = useMemo(
    () =>
      computeDailyPanchangExtras(
        selectedDate,
        selectedCity.lat,
        selectedCity.lng,
        noonProbeChart.offsetMinutesUsed,
        settings.ayanamsa || 'lahiri'
      ),
    [selectedDate, selectedCity, noonProbeChart.offsetMinutesUsed, settings.ayanamsa]
  );

  const panchangInput: BirthInput = useMemo(
    () => ({
      id: 'panchang-day',
      name: 'Panchang Native',
      gender: 'other',
      date: selectedDate,
      time: panchangExtras.sunriseTimeHms || '12:00:00',
      city: selectedCity.city,
      country: selectedCity.country,
      latitude: selectedCity.lat,
      longitude: selectedCity.lng,
      timezone: selectedCity.timezone,
    }),
    [selectedDate, selectedCity, panchangExtras.sunriseTimeHms]
  );

  const chart = useMemo(() => calculateChart(panchangInput, settings), [panchangInput, settings]);
  const choghadiya = useMemo(() => getChoghadiyaForChart(chart), [chart]);
  const moon = useMemo(() => chart.planets.find((p) => p.id === 'Moon') || chart.ascendant, [chart]);

  // Year & Month details for 30-Day Wall Calendar
  const [curYear, curMonth] = useMemo(() => {
    const parts = selectedDate.split('-').map(Number);
    return [parts[0], parts[1]];
  }, [selectedDate]);

  const annualEvents = useMemo(() => {
    return computeAnnualHinduCalendar(
      curYear,
      settings.ayanamsa || 'lahiri',
      noonProbeChart.offsetMinutesUsed,
      selectedCity.lat,
      selectedCity.lng
    );
  }, [curYear, settings.ayanamsa, noonProbeChart.offsetMinutesUsed, selectedCity]);

  const monthGridData = useMemo(() => {
    const firstDay = new Date(curYear, curMonth - 1, 1);
    const lastDay = new Date(curYear, curMonth, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay(); // 0 = Sunday
    const pad = (n: number) => String(n).padStart(2, '0');
    const offsetMin = noonProbeChart.offsetMinutesUsed;

    const days = [];
    for (let d = 1; d <= daysInMonth; d++) {
      const dStr = `${curYear}-${pad(curMonth)}-${pad(d)}`;
      const noonUtc = Date.UTC(curYear, curMonth - 1, d, 12, 0, 0) - offsetMin * 60_000;
      const sunTimes = computeSunriseSunsetForLocalDay(noonUtc, offsetMin, selectedCity.lat, selectedCity.lng);
      const srTimeStr = sunTimes.sunriseMs
        ? formatLocalTimeFromUtc(sunTimes.sunriseMs + 1000, offsetMin, true)
        : '12:00:00';
      const dayInput: BirthInput = {
        id: `cal-day-${d}`,
        name: 'Calendar Day',
        gender: 'other',
        date: dStr,
        time: srTimeStr,
        city: selectedCity.city,
        country: selectedCity.country,
        latitude: selectedCity.lat,
        longitude: selectedCity.lng,
        timezone: selectedCity.timezone,
      };
      const c = calculateChart(dayInput, settings);
      const evts = annualEvents.filter((e) => e.date === dStr);
      days.push({
        dayNum: d,
        dateStr: dStr,
        panchang: c.panchang,
        events: evts,
      });
    }

    return {
      daysInMonth,
      startingDayOfWeek,
      days,
    };
  }, [curYear, curMonth, selectedCity, settings, annualEvents, noonProbeChart.offsetMinutesUsed]);

  const stepMonthNav = (offset: number) => {
    const d = new Date(selectedDate);
    d.setMonth(d.getMonth() + offset);
    const pad = (n: number) => String(n).padStart(2, '0');
    setSelectedDate(`${d.getFullYear()}-${pad(d.getMonth() + 1)}-01`);
  };

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

        {/* Daily vs Monthly Wall Calendar Tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '14px', flexWrap: 'wrap' }}>
          <button
            type="button"
            className={`btn ${panchangViewTab === 'daily' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setPanchangViewTab('daily')}
          >
            {isHi ? 'दैनिक पंचांग विवरण (Daily Panchang)' : 'Daily Panchang Details'}
          </button>
          <button
            type="button"
            className={`btn ${panchangViewTab === 'monthly' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setPanchangViewTab('monthly')}
          >
            {isHi ? 'मासिक दीवार कैलेंडर (30-Day Wall Calendar)' : '30-Day Monthly Wall Calendar Grid'}
          </button>
        </div>

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
            <DateDmyInput
              value={selectedDate}
              onChange={setSelectedDate}
              compact
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

      {/* Monthly 30-Day Wall Calendar Grid */}
      {panchangViewTab === 'monthly' && (
        <div className="oj-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
            <div>
              <h2 style={{ margin: 0, fontSize: '18px', fontFamily: 'Cinzel, Playfair Display, serif' }}>
                {isHi ? `मासिक पंचांग कैलेंडर — ${new Date(curYear, curMonth - 1).toLocaleDateString('hi-IN', { month: 'long', year: 'numeric' })}` : `Monthly Vedic Calendar — ${new Date(curYear, curMonth - 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`}
              </h2>
              <p style={{ margin: '4px 0 0', fontSize: '12px', color: 'var(--text-muted)' }}>
                {isHi ? 'प्रत्येक दिन की तिथि, पक्ष, नक्षत्र, व्रत-त्योहार व शुभता। किसी भी दिन पर क्लिक कर उसका दैनिक पंचांग देखें।' : 'Daily Tithi, Paksha, Nakshatra, Festivals and Auspiciousness indicators. Click any date to inspect.'}
              </p>
            </div>
            <div style={{ display: 'flex', gap: '6px' }}>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => stepMonthNav(-1)}
              >
                {isHi ? '◄ पिछला माह' : '◄ Prev Month'}
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => stepMonthNav(1)}
              >
                {isHi ? 'अगला माह ►' : 'Next Month ►'}
              </button>
            </div>
          </div>

          {/* Calendar Day Headers */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px', textAlign: 'center', fontWeight: 'bold', fontSize: '12px', marginBottom: '8px' }}>
            {['रवि (Sun)', 'सोम (Mon)', 'मंगल (Tue)', 'बुध (Wed)', 'गुरु (Thu)', 'शुक्र (Fri)', 'शनि (Sat)'].map((dName, idx) => (
              <div key={idx} style={{ padding: '6px', background: 'var(--bg-subtle)', borderRadius: '6px', color: idx === 0 ? '#dc2626' : 'var(--text)' }}>
                {isHi ? dName.split(' ')[0] : dName.split(' ')[1].replace(/[()]/g, '')}
              </div>
            ))}
          </div>

          {/* Calendar Days Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px' }}>
            {/* Blank cells for starting day offset */}
            {Array.from({ length: monthGridData.startingDayOfWeek }).map((_, idx) => (
              <div key={`blank-${idx}`} style={{ minHeight: '88px', background: 'transparent' }} />
            ))}

            {/* Actual Month Days */}
            {monthGridData.days.map((item) => {
              const isSelected = item.dateStr === selectedDate;
              const hasEvents = item.events.length > 0;
              const tithiName = isHi ? item.panchang.tithi.name : item.panchang.tithi.name;
              const isEkadashiOrPurnima = tithiName.includes('एकादशी') || tithiName.includes('पूर्णिमा') || tithiName.includes('अमावस्या') || tithiName.includes('Ekadashi') || tithiName.includes('Purnima') || tithiName.includes('Amavasya');

              return (
                <div
                  key={item.dayNum}
                  onClick={() => {
                    setSelectedDate(item.dateStr);
                    setPanchangViewTab('daily');
                  }}
                  style={{
                    minHeight: '88px',
                    padding: '6px 8px',
                    borderRadius: '8px',
                    border: isSelected ? '2px solid #d97706' : '1px solid var(--border)',
                    background: isSelected ? 'rgba(217, 119, 6, 0.08)' : 'var(--bg-elevated)',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    transition: 'all 0.15s ease',
                    boxShadow: isSelected ? '0 2px 8px rgba(217, 119, 6, 0.2)' : 'none',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 'bold', fontSize: '13px', color: isSelected ? '#b45309' : 'var(--text)' }}>
                      {item.dayNum}
                    </span>
                    <span
                      style={{
                        width: '7px',
                        height: '7px',
                        borderRadius: '50%',
                        backgroundColor: isEkadashiOrPurnima ? '#16a34a' : hasEvents ? '#d97706' : '#9ca3af',
                      }}
                      title={isEkadashiOrPurnima ? 'अति शुभ पर्व तिथि' : hasEvents ? 'पर्व / उत्सव' : 'सामान्य'}
                    />
                  </div>

                  <div style={{ fontSize: '10.5px', color: isSelected ? '#b45309' : 'var(--text-muted)', lineHeight: '1.2', marginTop: '2px' }}>
                    <div style={{ fontWeight: '600', color: isEkadashiOrPurnima ? '#b45309' : 'inherit' }}>
                      {tithiName.split(' ')[0]}
                    </div>
                    <div style={{ fontSize: '9.5px', opacity: 0.85 }}>
                      {isHi ? item.panchang.nakshatra.name : item.panchang.nakshatra.name}
                    </div>
                  </div>

                  {hasEvents && (
                    <div style={{ marginTop: '3px' }}>
                      <span
                        style={{
                          display: 'inline-block',
                          fontSize: '9px',
                          fontWeight: 'bold',
                          padding: '1px 4px',
                          borderRadius: '4px',
                          backgroundColor: '#fef3c7',
                          color: '#78350f',
                          border: '1px solid #fde68a',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          maxWidth: '100%',
                        }}
                      >
                        {isHi ? item.events[0].nameHi : item.events[0].nameEn}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Five Limbs of Panchang Grid (Daily View) */}
      {panchangViewTab === 'daily' && (
      <>
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
                  <strong>{p.tithi.name}</strong> ({p.tithi.paksha} {isHi ? 'पक्ष' : 'Paksha'})
                  <br />
                  <span className="muted">{isHi ? 'समाप्ति:' : 'Upto:'} {panchangExtras.tithiEnd}</span>
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
                  <span className="muted">
                    {isHi ? 'स्वामी:' : 'Lord:'} {trPlanet(moon.nakshatraLord, lang)} · {isHi ? 'समाप्ति:' : 'Upto:'} {panchangExtras.nakshatraEnd}
                  </span>
                </td>
              </tr>
              <tr>
                <th>{isHi ? 'योग' : 'Yoga'}</th>
                <td>
                  <strong>{p.yoga.name}</strong>
                  <br />
                  <span className="muted">{isHi ? 'समाप्ति:' : 'Upto:'} {panchangExtras.yogaEnd}</span>
                </td>
              </tr>
              <tr>
                <th>{isHi ? 'करण' : 'Karana'}</th>
                <td>
                  <strong>{p.karana.name}</strong> ({p.karana.type})
                  <br />
                  <span className="muted">{isHi ? 'समाप्ति:' : 'Upto:'} {panchangExtras.karanaEnd}</span>
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
                <td>{panchangExtras.amritaKalam}</td>
              </tr>
              <tr className="oj-row-good">
                <th>{isHi ? 'ब्रह्म मुहूर्त' : 'Brahma Muhurta'}</th>
                <td>{panchangExtras.brahmaMuhurta}</td>
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
      </>
      )}
    </div>
  );
};
