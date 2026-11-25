import React, { useMemo, useState } from 'react';
import { Compass, Sparkles, Star } from 'lucide-react';
import { NAKSHATRAS, NINE_GRAHAS, SIGNS } from '../../astro/constants';
import {
  inspectHypotheticalPlanetInSign,
  type PlanetInSignPrediction,
  type PredictionBodyId,
} from '../../astro/predictions/planetInSign';
import {
  inspectHypotheticalNakshatra,
  type PlanetInNakshatraPrediction,
} from '../../astro/predictions/planetInNakshatra';
import { useLanguage } from '../../i18n/LanguageContext';
import { trPlanet, trSign, trTerm } from '../../i18n/translations';

const BODY_LIST: PredictionBodyId[] = ['Asc', ...NINE_GRAHAS];

export const PlanetInSignPanel: React.FC<{ items: PlanetInSignPrediction[] }> = ({ items }) => {
  const { lang, t } = useLanguage();
  const isHi = lang === 'hi';
  const [expPlanet, setExpPlanet] = useState<PredictionBodyId>('Sun');
  const [expSign, setExpSign] = useState<number>(0);

  const explorerResult = useMemo(
    () => inspectHypotheticalPlanetInSign(expPlanet, expSign),
    [expPlanet, expSign]
  );

  return (
    <div className="view-stack">
      <section className="panel" style={{ borderLeft: '4px solid var(--accent)' }}>
        <div className="panel-header">
          <div>
            <h3>
              <Compass size={15} />{' '}
              {isHi
                ? 'राशिवार शास्त्रीय फलादेश (Planets in Signs — सारावली व बृहज्जातक)'
                : 'Planets in Signs — Saravali & Brihat Jataka Shastric Synthesis'}
            </h3>
            <span className="muted small-text">
              {isHi
                ? 'कल्याण वर्मा विरचित "सारावली", वराहमिहिर कृत "बृहज्जातक" व फलदीपिका सम्मत फलोदय आयु एवं शास्त्रीय उपाय'
                : 'Authoritative Classical Readings from Saravali (Kalyana Varma) & Brihat Jataka (Varahamihira) with Fruition Milestones'}
            </span>
          </div>
        </div>
        <div className="placement-cards">
          {items.map((item) => (
            <article key={item.planet} className="placement-card">
              <div className="placement-card-top">
                <div>
                  <strong>
                    {trPlanet(item.planet, lang)} — {trSign(item.signIndex, lang)} ({item.degreeDms})
                  </strong>
                  <div className="muted small-text">{isHi ? item.headlineHi : item.headlineEn}</div>
                </div>
                <div className="toolbar-group">
                  <span className="tag tag-karaka mono">
                    {isHi ? `फलोदय: ${item.fruitionAge} वर्ष (${item.peakDecade})` : `Peak: Age ${item.fruitionAge} (${item.peakDecade})`}
                  </span>
                  {item.dignity !== '-' && (
                    <span
                      className={`tag ${
                        ['Exalted', 'Moolatrikona', 'Own Sign'].includes(item.dignity)
                          ? 'tag-varg'
                          : ['Debilitated', 'Great Enemy', 'Enemy'].includes(item.dignity)
                            ? 'tag-combust'
                            : 'tag-karaka'
                      }`}
                    >
                      {trTerm(item.dignity, lang)}
                    </span>
                  )}
                  <span className="tag">{t.common.house}{item.houseNumber}</span>
                </div>
              </div>
              <p className="yoga-desc">{isHi ? item.readingHi : item.readingEn}</p>
              
              {/* Saravali Classical Shastric Sutra */}
              <div className="gochar-banner is-clear" style={{ marginTop: '8px', fontSize: '12.5px' }}>
                <strong>{isHi ? 'सारावली शास्त्रीय सूत्र: ' : 'Saravali Classical Phala: '}</strong>
                {isHi ? item.saravaliPhalaHi : item.saravaliPhalaEn}
              </div>

              <div className="pred-bullets" style={{ marginTop: '8px' }}>
                <div>
                  <strong>{isHi ? 'शुभ गुण:' : 'Key Strength:'}</strong>{' '}
                  {isHi ? item.positiveHi : item.positiveEn}
                </div>
                <div>
                  <strong>{isHi ? 'सावधानी:' : 'Balance Note:'}</strong>{' '}
                  {isHi ? item.cautionHi : item.cautionEn}
                </div>
              </div>

              {/* Classical Remedy Directive */}
              <div style={{ marginTop: '8px', fontSize: '12px', color: 'var(--text-muted)' }}>
                <strong>{isHi ? 'शास्त्रीय उपाय निर्देश: ' : 'Remedy Directive: '}</strong>
                {isHi ? item.remedyDirectiveHi : item.remedyDirectiveEn}
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Interactive Sign Lookup across all 12 Rashis */}
      <section className="panel">
        <div className="panel-header">
          <h3>
            <Sparkles size={15} />{' '}
            {isHi
              ? '12 राशियों में ग्रह प्रभाव एक्सप्लोरर (कोई भी ग्रह व राशि चुनें)'
              : 'Planets in All 12 Signs Reference Explorer'}
          </h3>
          <div className="toolbar-group">
            <select
              aria-label="Select Planet for Explorer"
              className="select-compact"
              value={expPlanet}
              onChange={(e) => setExpPlanet(e.target.value as PredictionBodyId)}
            >
              {BODY_LIST.map((b) => (
                <option key={b} value={b}>{trPlanet(b, lang)}</option>
              ))}
            </select>
            <select
              aria-label="Select Sign for Explorer"
              className="select-compact"
              value={expSign}
              onChange={(e) => setExpSign(Number(e.target.value))}
            >
              {SIGNS.map((s) => (
                <option key={s.index} value={s.index}>{trSign(s.index, lang)}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="pred-card-body">
          <p className="lead-text">{isHi ? explorerResult.headlineHi : explorerResult.headlineEn}</p>
          <p>{isHi ? explorerResult.readingHi : explorerResult.readingEn}</p>
          <div className="gochar-banner is-info">
            <strong>{isHi ? 'सावधानी सूत्र:' : 'Watchout:'}</strong>{' '}
            {isHi ? explorerResult.cautionHi : explorerResult.cautionEn}
          </div>
          <div style={{ marginTop: '8px', fontSize: '12px', color: 'var(--text-muted)' }}>
            <strong>{isHi ? 'शास्त्रीय उपाय: ' : 'Classical Remedy: '}</strong>
            {isHi ? explorerResult.remedyHi : explorerResult.remedyEn}
          </div>
        </div>
      </section>
    </div>
  );
};

export const PlanetInNakshatraPanel: React.FC<{ items: PlanetInNakshatraPrediction[] }> = ({
  items,
}) => {
  const { lang } = useLanguage();
  const isHi = lang === 'hi';
  const [expPlanet, setExpPlanet] = useState<PredictionBodyId>('Moon');
  const [expNak, setExpNak] = useState<number>(items.find((x) => x.planet === 'Moon')?.nakshatraIndex ?? 0);
  const [expPada, setExpPada] = useState<number>(items.find((x) => x.planet === 'Moon')?.pada ?? 1);

  const explorer = useMemo(
    () => inspectHypotheticalNakshatra(expPlanet, expNak, expPada),
    [expPlanet, expNak, expPada]
  );

  return (
    <div className="view-stack">
      <section className="panel" style={{ borderLeft: '4px solid var(--accent)' }}>
        <div className="panel-header">
          <div>
            <h3>
              <Star size={15} />{' '}
              {isHi
                ? 'नक्षत्रवार शास्त्रीय फलादेश (27 नक्षत्र, 4 चरण व तारा बल)'
                : 'Nakshatra & Tara Bala Predictions — Phaladeepika & Brihat Samhita'}
            </h3>
            <span className="muted small-text">
              {isHi
                ? 'फलदीपिका (अध्याय 11), तैत्तिरीय ब्राह्मण, बृहत्संहिता एवं नवतारा बल दशा-सक्रियण आयु'
                : 'Phaladeepika (Ch. 11), Taittiriya Brahmana, Brihat Samhita & Navatara Activation Timelines'}
            </span>
          </div>
        </div>
        <div className="placement-cards">
          {items.map((item) => (
            <article key={item.planet} className="placement-card">
              <div className="placement-card-top">
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '3px' }}>
                    {item.planet === 'Moon' && (
                      <span className="badge badge-accent" style={{ fontWeight: 700, fontSize: '11px' }}>
                        {isHi ? '★ जन्म नक्षत्र (Janma Nakshatra)' : '★ Birth Star (Janma Nakshatra)'}
                      </span>
                    )}
                    {item.planet === 'Asc' && (
                      <span className="badge badge-subtle" style={{ fontWeight: 700, fontSize: '11px' }}>
                        {isHi ? '★ लग्न नक्षत्र (Rising Star)' : '★ Ascendant Star'}
                      </span>
                    )}
                    <strong>
                      {trPlanet(item.planet, lang)} —{' '}
                      {isHi ? item.nakshatraNameHi : item.nakshatraNameEn} ({isHi ? 'चरण' : 'Pada'}{' '}
                      {item.pada})
                    </strong>
                  </div>
                  <div className="muted small-text">
                    {isHi ? 'नक्षत्रेश:' : 'Lord:'} {trPlanet(item.nakshatraLord, lang)} ·{' '}
                    {isHi ? 'देवता:' : 'Deity:'} {isHi ? item.deityHi : item.deityEn}
                  </div>
                </div>
                <div className="toolbar-group">
                  <span className="tag tag-varg mono">
                    {isHi ? `सक्रियता आयु: ${item.activationAges.join(', ')} वर्ष` : `Active Ages: ${item.activationAges.join(', ')}`}
                  </span>
                  <span className={`tag ${item.taraAuspicious ? 'tag-varg' : 'tag-retro'}`}>
                    {isHi ? item.taraFromMoonHi : item.taraFromMoonEn}
                  </span>
                </div>
              </div>
              <p className="yoga-desc">{isHi ? item.readingHi : item.readingEn}</p>
              
              {/* Tara Bala Dynamic Timing */}
              <div className="gochar-banner is-info" style={{ marginTop: '8px', fontSize: '12.5px' }}>
                <strong>{isHi ? 'तारा बल दशा व गोचर प्रभाव: ' : 'Tara Bala Dasha & Transit Impact: '}</strong>
                {isHi ? item.taraTimingHi : item.taraTimingEn}
              </div>

              {/* Phaladeepika Sutra */}
              <div className="gochar-banner is-clear" style={{ marginTop: '6px', fontSize: '12px' }}>
                <strong>{isHi ? 'फलदीपिका शास्त्रीय सूत्र: ' : 'Phaladeepika Classical Sutra: '}</strong>
                {isHi ? item.classicalSutraHi : item.classicalSutraEn}
              </div>

              <div className="pred-bullets" style={{ marginTop: '8px' }}>
                <div>
                  <strong>{isHi ? 'प्रतीक व गण/नाड़ी:' : 'Symbol & Attributes:'}</strong>{' '}
                  {isHi ? item.symbolHi : item.symbolEn} · {trTerm(item.gana, lang)} / {trTerm(item.nadi, lang)}
                </div>
                <div>
                  <strong>{isHi ? 'चरण (नवांश) प्रभाव:' : 'Pada Nuance:'}</strong>{' '}
                  {isHi ? item.padaNuanceHi : item.padaNuanceEn}
                </div>
                <div>
                  <strong>{isHi ? 'कार्यक्षेत्र उपयुक्तता:' : 'Vocations:'}</strong>{' '}
                  {isHi ? item.vocationHi : item.vocationEn}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Interactive 27 Nakshatra x 4 Pada Explorer */}
      <section className="panel">
        <div className="panel-header">
          <h3>
            <Star size={15} />{' '}
            {isHi
              ? '27 नक्षत्र व 4 चरण फलादेश एक्सप्लोरर'
              : 'All 27 Nakshatras × 4 Padas Reference Explorer'}
          </h3>
          <div className="toolbar-group">
            <select
              aria-label="Select Planet for Explorer"
              className="select-compact"
              value={expPlanet}
              onChange={(e) => setExpPlanet(e.target.value as PredictionBodyId)}
            >
              {BODY_LIST.map((b) => (
                <option key={b} value={b}>{trPlanet(b, lang)}</option>
              ))}
            </select>
            <select
              aria-label="Select Nakshatra for Explorer"
              className="select-compact"
              value={expNak}
              onChange={(e) => setExpNak(Number(e.target.value))}
            >
              {NAKSHATRAS.map((n) => (
                <option key={n.index} value={n.index}>
                  {n.index + 1}. {trTerm(n.name, lang)}
                </option>
              ))}
            </select>
            <select
              aria-label="Select Pada for Explorer"
              className="select-compact"
              value={expPada}
              onChange={(e) => setExpPada(Number(e.target.value))}
            >
              {[1, 2, 3, 4].map((p) => (
                <option key={p} value={p}>{isHi ? `चरण ${p}` : `Pada ${p}`}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="pred-card-body">
          <p className="lead-text">
            {trPlanet(expPlanet, lang)} · {isHi ? explorer.nakNameHi : explorer.nakNameEn} (
            {isHi ? `चरण ${expPada}` : `Pada ${expPada}`}) —{' '}
            {isHi ? 'स्वामी' : 'Lord'}: {trPlanet(explorer.lord, lang)} ·{' '}
            {isHi ? explorer.deityHi : explorer.deityEn}
          </p>
          <p>{isHi ? explorer.readingHi : explorer.readingEn}</p>
          <div className="gochar-banner is-clear" style={{ marginTop: '8px', fontSize: '12.5px' }}>
            <strong>{isHi ? 'शास्त्रीय फलोदय आयु: ' : 'Fruition Ages: '}</strong>
            {explorer.activationAges.join(', ')} {isHi ? 'वर्ष' : 'years'}
          </div>
          <div className="pred-bullets" style={{ marginTop: '8px' }}>
            <div>
              <strong>{isHi ? 'चरण विशेषता:' : 'Pada Quality:'}</strong>{' '}
              {isHi ? explorer.padaHi : explorer.padaEn}
            </div>
            <div>
              <strong>{isHi ? 'अनुकूल व्यवसाय:' : 'Vocation Focus:'}</strong>{' '}
              {isHi ? explorer.vocationHi : explorer.vocationEn}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
