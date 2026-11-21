import React, { useMemo, useState } from 'react';
import { BookOpen, Compass, Sliders } from 'lucide-react';
import { NINE_GRAHAS, SIGNS } from '../../astro/constants';
import {
  analyzeBodyDegree,
  type DegreePredictionItem,
} from '../../astro/predictions/degreeWise';
import type { HouseWisePrediction } from '../../astro/predictions/houseWise';
import type { PredictionBodyId } from '../../astro/predictions/planetInSign';
import type { PredictionReport } from '../../astro/predictions/types';
import { ShieldCheck } from 'lucide-react';
import { trBadge } from '../../i18n/hindiPredictions';
import { useLanguage } from '../../i18n/LanguageContext';
import { trPlanet, trSign, trTerm } from '../../i18n/translations';

export const PlanetInHousePanel: React.FC<{ report: PredictionReport }> = ({ report }) => {
  const { lang, t } = useLanguage();
  const isHi = lang === 'hi';

  return (
    <section className="panel">
      <div className="panel-header">
        <h3>
          <BookOpen size={15} />{' '}
          {isHi
            ? 'विभिन्न भावों में 9 ग्रह फल (Planets in Different Houses)'
            : 'Planets in Different Houses (1st–12th Bhava Phala)'}
        </h3>
        <span className="muted small-text">{isHi ? 'शास्त्रीय फलादेश सूत्र' : 'Classical Shastra Matrix'}</span>
      </div>

      <div className="placement-cards">
        {report.planetPlacements.map((p) => (
          <article key={p.planet} className="placement-card">
            <div className="placement-card-top">
              <div>
                <strong>
                  {isHi
                    ? `${p.house}वें भाव (${p.signName}) में ${trPlanet(p.planet, lang)}`
                    : `${p.planet} in House ${p.house} (${p.signName})`}
                </strong>
                <div className="muted small-text">{p.headline}</div>
              </div>
              <span className="tag tag-karaka">{trTerm(p.dignity, lang)}</span>
            </div>
            <p className="yoga-desc">{p.classicalReading}</p>
            <div className="muted small-text">
              {p.dignityModifier} · {t.common.house} {p.house}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

function getHouseSpecificEventAnswers(
  houseNum: number,
  lord: string,
  dignity: string,
  isHi: boolean
): { qHi: string; qEn: string; aHi: string; aEn: string } {
  const isGood = ['Exalted', 'Own Sign', 'Moolatrikona', 'Friend', 'Great Friend'].includes(dignity);

  switch (houseNum) {
    case 1:
      return {
        qHi: 'देह, आरोग्य, दीर्घायु व सामाजिक प्रभाव:',
        qEn: 'Vitality, Physique, Stature & Social Aura:',
        aHi: isGood ? 'तेजस्वी व्यक्तित्व, उत्तम आरोग्य एवं समाज में स्वाभाविक नेतृत्व। आयु 24-28 वर्ष में स्वतंत्र पहचान का उदय।' : 'आरंभिक वर्षों में स्वास्थ्य के प्रति सतर्कता आवश्यक; नियमित योगाभ्यास व सूर्य उपासना से सर्वांगीण कल्याण।',
        aEn: isGood ? 'Radiant persona, robust vitality and commanding leadership. Independent identity peaks at age 24–28.' : 'Cultivate disciplined wellness; Surya Upasana ensures vigorous longevity and immune resilience.',
      };
    case 2:
      return {
        qHi: 'संचित धन, पैतृक संपत्ति व वाणी:',
        qEn: 'Accumulated Wealth, Lineage & Speech:',
        aHi: isGood ? 'स्थायी धन संचय, कुटुंब का सहयोग एवं आयु 28-32 वर्ष में पैतृक व स्व-अर्जित कोष में उल्लेखनीय वृद्धि।' : 'वाणी में कटुता से बचें; वित्तीय योजनाबद्धता व बचत पर ध्यान देने से धन स्थिरता प्राप्त होगी।',
        aEn: isGood ? 'Steady wealth accumulation, solid family backing & significant wealth multiplication around age 28–32.' : 'Refrain from harsh speech; systematic financial planning safeguards assets.',
      };
    case 3:
      return {
        qHi: 'पराक्रम, छोटे भाई-बहन व यात्राएं:',
        qEn: 'Courage, Siblings & Ventures:',
        aHi: isGood ? 'अदम्य साहस, पुरुषार्थ से भाग्योदय, छोटे भाई-बहनों से स्नेह एवं सफल व्यावसायिक यात्राएं।' : 'अनावश्यक जोखिमपूर्ण निर्णयों से बचें; अपने पराक्रम को एक दिशा में केंद्रित करें।',
        aEn: isGood ? 'Exceptional valour, self-made enterprise success, warm sibling ties & rewarding travels.' : 'Channel courageous drive constructively; avoid hasty impulse ventures.',
      };
    case 4:
      return {
        qHi: 'माता का सुख, भूमि-भवन व वाहन योग:',
        qEn: 'Mother, Real Estate, Vehicle & Inner Peace:',
        aHi: isGood ? 'माता का आशीर्वाद, आयु 27-31 वर्ष में वाहन सुख एवं 33-37 वर्ष में स्वयं का भव्य गृह निर्माण योग।' : 'पारिवारिक शांति बनाए रखें; आयु 30 के बाद धैर्य व परिश्रम से अचल संपत्ति का निर्माण संभव होगा।',
        aEn: isGood ? 'Maternal grace, prime vehicle acquisition at age 27–31 and grand home ownership at age 33–37.' : 'Preserve domestic harmony; disciplined savings unlock real estate past age 30.',
      };
    case 5:
      return {
        qHi: 'संतान योग, उच्च विद्या व आकस्मिक लाभ:',
        qEn: 'Progeny, Higher Intellect & Speculation:',
        aHi: isGood ? 'कुशाग्र बुद्धि, उच्च शिक्षा में विशिष्ट सफलता, सुयोग्य संतान योग (आयु 26-30 वर्ष) एवं शोध/निवेश से लाभ।' : 'संतान की शिक्षा पर ध्यान दें; सट्टेबाजी व शेयर बाजार में अत्यधिक जोखिम से बचें।',
        aEn: isGood ? 'Sharp intellect, academic distinction, dutiful progeny around age 26–30 & lucrative analytical gains.' : 'Focus on progeny mentoring; avoid speculative trading without deep research.',
      };
    case 6:
      return {
        qHi: 'रोग, ऋण, शत्रु विजय व प्रतियोगी परीक्षा:',
        qEn: 'Debts, Health Immunity, Competition & Victory:',
        aHi: isGood ? 'शत्रुओं पर पूर्ण विजय, प्रतियोगी परीक्षाओं में उत्कृष्ट सफलता एवं किसी भी ऋण से शीघ्र मुक्ति।' : 'स्वास्थ्य में पाचन व उदर विकारों से बचाव रखें; बिना जांचे किसी को बड़ा उधार न दें।',
        aEn: isGood ? 'Complete triumph over adversaries, competitive exam success and quick liquidation of liabilities.' : 'Safeguard digestive health; avoid informal unsecured loans to acquaintances.',
      };
    case 7:
      return {
        qHi: 'विवाह काल, जीवनसाथी का स्वरूप व दांपत्य:',
        qEn: 'Marriage Timing, Spouse Persona & Harmony:',
        aHi: isGood ? 'आयु 25-29 वर्ष में विवाह; जीवनसाथी सुसंस्कृत, बुद्धिमान व पूर्व/उत्तर दिशा से आने का योग।' : 'विवाह में जल्दबाजी न करें; आयु 28 के पश्चात परिपक्वता से दांपत्य में स्थायी मधुरता आएगी।',
        aEn: isGood ? 'Marriage favoured around age 25–29; spouse is dignified, intelligent & supportive.' : 'Avoid impulsive haste; union after age 28 brings mature, lasting harmony.',
      };
    case 8:
      return {
        qHi: 'अचानक धन लाभ, आयु व गुप्त विद्या:',
        qEn: 'Sudden Wealth, Longevity & Transformation:',
        aHi: isGood ? 'दीर्घायु योग (75+ वर्ष), शोध/गूढ़ विज्ञान में रुचि तथा वसीयत या अप्रत्याशित लाभ।' : 'वाहन सावधानी से चलाएं; शनि व महामृत्युंजय मंत्र जप से आयु-आरोग्य की पूर्ण रक्षा होती है।',
        aEn: isGood ? 'Long life (75+ years), fascination with deep research & sudden windfall gains.' : 'Drive with disciplined care; Maha Mrityunjaya mantra shields health and longevity.',
      };
    case 9:
      return {
        qHi: 'भाग्य, धर्म, पिता व तीर्थाटन:',
        qEn: 'Fortune, Dharma, Father & Pilgrimage:',
        aHi: isGood ? 'ईश्वरीय कृपा से संकटों में स्वतः रक्षा, पिता का आशीर्वाद एवं जीवन में सुदूर तीर्थ यात्राएं।' : 'धर्म-कर्म का मार्ग न छोड़ें; गुरुजनों का आदर करने से भाग्य के अवरोध दूर होते हैं।',
        aEn: isGood ? 'Divine protection in crises, paternal blessing, and fulfilling spiritual travels.' : 'Stay anchored to ethical dharma; respecting elders steadily unlocks fortune.',
      };
    case 10:
      return {
        qHi: 'करियर, पद-प्रतिष्ठा व शासन से लाभ:',
        qEn: 'Career Authority, Status & Governance:',
        aHi: isGood ? 'प्रशासनिक अधिकार, नेतृत्व पद एवं आयु 32-36 वर्ष में करियर का ऐतिहासिक उत्कर्ष।' : 'कार्यस्थल की राजनीति से दूर रहें; अपनी कार्यकुशलता से ही स्थायी सम्मान प्राप्त होगा।',
        aEn: isGood ? 'Commanding executive authority, leadership rank & major zenith around age 32–36.' : 'Steer clear of office gossip; technical expertise ensures lasting prestige.',
      };
    case 11:
      return {
        qHi: 'स्थायी आय, बड़े मित्र व मनोकामना पूर्ति:',
        qEn: 'Inflow Streams, Elder Siblings & Desires:',
        aHi: isGood ? 'जीवन में आय के एकाधिक स्थायी स्रोत, प्रभावशाली मित्रों का नेटवर्क व इच्छाओं की पूर्ति।' : 'आय की तुलना में व्यय का अनुपात संतुलित रखें; मित्रों के साथ वित्तीय पारदर्शिता रखें।',
        aEn: isGood ? 'Multiple streams of income, influential high-status network & fulfillment of aims.' : 'Balance cash outflow against inflow; maintain strict transparency with friends.',
      };
    case 12:
      return {
        qHi: 'विदेश गमन, व्यय व मोक्ष गति:',
        qEn: 'Foreign Settlement, Expenditure & Moksha:',
        aHi: isGood ? 'सुदूर विदेश यात्रा, विदेशी कंपनियों/मुद्रा से लाभ अथवा स्थायी निवास (PR) का योग।' : 'अनावश्यक अपव्यय से बचें; रात्रि में ध्यान व प्राणायाम से मानसिक शांति व अनिद्रा से मुक्ति मिलेगी।',
        aEn: isGood ? 'Foreign travel, lucrative cross-border commerce, or permanent foreign residency.' : 'Curtail impulsive expenses; evening meditation grants deep sleep and serenity.',
      };
    default:
      return { qHi: '', qEn: '', aHi: '', aEn: '' };
  }
}

export const HouseWisePanel: React.FC<{
  houses: HouseWisePrediction[];
  report?: PredictionReport;
  simple?: boolean;
}> = ({ houses, report, simple = false }) => {
  const { lang, t } = useLanguage();
  const isHi = lang === 'hi';
  const [selectedHouse, setSelectedHouse] = useState<number | 'all'>('all');

  const visibleHouses =
    selectedHouse === 'all' ? houses : houses.filter((h) => h.houseNumber === selectedHouse);

  return (
    <div className="view-stack">
      {!simple && report && (
        <>
      {/* Quick Lagna + Nakshatra + Atmakaraka Overview Banner */}
      <div className="pred-top-grid">
        <section className="panel pred-hero-card">
          <div className="panel-header">
            <h3>
              <Compass size={15} />{' '}
              {isHi
                ? `${report.lagnaProfile.signName} लग्न — मूल जीवन सारांश`
                : `${report.lagnaProfile.signName} Lagna — Core Chart Overview`}
            </h3>
            <span className="tag">{isHi ? 'प्रथम भाव आधार' : 'H1 Foundation'}</span>
          </div>
          <div className="pred-card-body">
            <p>{report.lagnaProfile.temperament}</p>
            <div className="pred-bullets">
              <div>
                <strong>{isHi ? 'शुभ ग्रह:' : 'Functional Benefics:'}</strong>{' '}
                {report.lagnaProfile.beneficList.map((id) => trPlanet(id, lang)).join(', ')}
              </div>
              <div>
                <strong>{isHi ? 'अकारक / मारक ग्रह:' : 'Challenging / Maraka:'}</strong>{' '}
                {report.lagnaProfile.maleficList.map((id) => trPlanet(id, lang)).join(', ')} ·{' '}
                <span className="muted">
                  {report.lagnaProfile.marakaList.map((id) => trPlanet(id, lang)).join(', ')}
                </span>
              </div>
              <div>
                <strong>{isHi ? 'जन्म नक्षत्र व आत्मकारक:' : 'Moon Nakshatra & Atmakaraka:'}</strong>{' '}
                {report.nakshatraProfile.name} ({isHi ? 'चरण' : 'Pada'} {report.nakshatraProfile.pada}) ·{' '}
                {report.atmakarakaInsight.planet} ({t.common.house}{report.atmakarakaInsight.house})
              </div>
            </div>
          </div>
        </section>

        <section className="panel">
          <div className="panel-header">
            <h3>{isHi ? '8 जीवन स्तंभ स्कोर (Life Pillars)' : '8 Core Life Domain Ratings'}</h3>
          </div>
          <div className="two-col-split-pad">
            <div className="table-scroll">
              <table className="data-table">
                <tbody>
                  {report.lifeDomains.map((d) => (
                    <tr key={d.id}>
                      <td><strong>{d.title}</strong></td>
                      <td className="mono">{d.rating}/100</td>
                      <td>
                        <span
                          className={`tag ${
                            d.rating >= 62 ? 'tag-varg' : d.rating >= 46 ? 'tag-karaka' : 'tag-combust'
                          }`}
                        >
                          {trBadge(d.verdict, lang)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>

        </>
      )}

      {/* 12 Houses Holistic Synthesizer */}
      <section className="panel">
        <div className="panel-header">
          <h3>
            {isHi
              ? 'द्वादश भाव संपूर्ण फलादेश (1st to 12th House-wise Predictions)'
              : 'House-wise Predictions (1st to 12th House Complete Analysis)'}
          </h3>
          <div className="toolbar-group">
            <select
              className="select-compact"
              value={selectedHouse}
              onChange={(e) =>
                setSelectedHouse(e.target.value === 'all' ? 'all' : Number(e.target.value))
              }
            >
              <option value="all">{isHi ? 'सभी 12 भाव दिखाएँ' : 'All 12 Houses (H1–H12)'}</option>
              {houses.map((h) => (
                <option key={h.houseNumber} value={h.houseNumber}>
                  {isHi ? h.titleHi : h.titleEn}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="domains-grid">
          {visibleHouses.map((h) => {
            const tone = h.score >= 75 ? 'high' : h.score >= 55 ? 'mid' : 'low';
            const eventQa = getHouseSpecificEventAnswers(h.houseNumber, h.lordPlanet, h.lordDignity, isHi);
            return (
              <article key={h.houseNumber} className="domain-card">
                <div className="domain-top">
                  <div>
                    <h4>{isHi ? h.titleHi : h.titleEn}</h4>
                    <div className="muted small-text">
                      {trSign(h.signIndex, lang)} · {isHi ? 'भावेश:' : 'Lord:'}{' '}
                      {trPlanet(h.lordPlanet, lang)} → {t.common.house}{h.lordPlacedHouse} (
                      {trTerm(h.lordDignity, lang)})
                    </div>
                  </div>
                  {!simple && (
                    <div className="domain-score-badge">
                      <strong className={`mono tone-text-${tone}`}>{h.score}</strong>
                      <span>/100</span>
                    </div>
                  )}
                </div>

                {!simple && (
                  <div className="bar-track">
                    <div className={`bar-fill tone-${tone}`} style={{ width: `${h.score}%` }} />
                  </div>
                )}

                <div className="domain-verdict-row">
                  {!simple && (
                    <span className={`tag ${
                      h.score >= 70 ? 'tag-varg' : h.score >= 55 ? 'tag-karaka' : 'tag-combust'
                    }`}>
                      {isHi ? h.verdictHi : h.verdictEn}
                    </span>
                  )}
                  <span className="muted small-text mono">
                    SAV: {h.savBindus} · {isHi ? 'कारक:' : 'Karaka:'} {trPlanet(h.naturalKaraka, lang)}
                  </span>
                </div>

                {/* Classical Sanskrit Bhavam Names */}
                {h.bhavamNames && h.bhavamNames.length > 0 && (
                  <div style={{ marginTop: 6, display: 'flex', flexWrap: 'wrap', gap: 4, alignItems: 'center' }}>
                    <span className="muted small-text" style={{ fontSize: '0.75rem' }}>
                      {isHi ? 'शास्त्रीय संज्ञाएं:' : 'Bhavam Names:'}
                    </span>
                    {h.bhavamNames.map((name) => (
                      <span key={name} className="tag tag-varg" style={{ fontSize: '0.72rem', padding: '1px 5px' }}>
                        {name}
                      </span>
                    ))}
                  </div>
                )}

                {/* Sthanas & Sub-Karakas */}
                <div style={{ marginTop: 6, display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center' }}>
                  {h.sthanangal && h.sthanangal.length > 0 && (
                    <span className="tag tag-karaka" style={{ fontSize: '0.75rem' }}>
                      {isHi ? 'स्थान:' : 'Sthana:'} {h.sthanangal.join(' · ')}
                    </span>
                  )}
                  {h.subKarakas && h.subKarakas.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                      {h.subKarakas.map((sk) => (
                        <span key={sk.domain} className="factor-chip" style={{ fontSize: '0.72rem', padding: '1px 5px' }}>
                          {sk.domain}: <strong>{trPlanet(sk.graha, lang)}</strong>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <p className="domain-summary" style={{ marginTop: 8 }}>{isHi ? h.synthesisHi : h.synthesisEn}</p>
                <p className="yoga-desc">
                  <strong>
                    {isHi
                      ? `${h.houseNumber}वें भावेश का ${h.lordPlacedHouse}वें भाव में फल (Karma):`
                      : `House ${h.houseNumber} Lord in House ${h.lordPlacedHouse} (Karma):`}
                  </strong>{' '}
                  {isHi
                    ? (h.lordPlacementKarmaHi || h.lordReadingHi)
                    : (h.lordPlacementKarmaEn || h.lordReadingEn)}
                </p>

                {/* Concrete Event Timing & Prediction Block */}
                <div style={{
                  margin: '10px 0',
                  padding: '10px 12px',
                  background: 'rgba(217, 119, 6, 0.08)',
                  borderLeft: '4px solid #d97706',
                  borderRadius: 6,
                  fontSize: '0.88rem',
                  lineHeight: 1.5,
                }}>
                  <strong style={{ color: '#b45309' }}>
                    {isHi ? eventQa.qHi : eventQa.qEn}
                  </strong>
                  <div style={{ marginTop: 4, color: 'var(--text)' }}>
                    {isHi ? eventQa.aHi : eventQa.aEn}
                  </div>
                </div>

                {/* Sign Archetype & Demeanor */}
                {(h.signPersonalityHi || h.signPersonalityEn) && (
                  <div style={{
                    margin: '8px 0',
                    padding: '8px 10px',
                    background: 'rgba(59, 130, 246, 0.05)',
                    borderLeft: '3px solid #3b82f6',
                    borderRadius: 4,
                    fontSize: '0.84rem',
                    lineHeight: 1.45,
                  }}>
                    <strong>{isHi ? `${trSign(h.signIndex, lang)} राशि का इस भाव में स्वभाव:` : `${h.signNameEn} Sign Archetype in this House:`}</strong>{' '}
                    {isHi ? h.signPersonalityHi : h.signPersonalityEn}
                    {h.signPositiveTrait && (
                      <div style={{ marginTop: 3, fontSize: '0.78rem' }}>
                        <span style={{ color: '#16a34a' }}>+ {isHi ? 'सकारात्मक गुण:' : 'Strengths:'} {h.signPositiveTrait}</span>
                        {' · '}
                        <span style={{ color: '#dc2626' }}>- {isHi ? 'चुनौती:' : 'Shadow:'} {h.signNegativeTrait}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Occupants with Dignity Relation & Classical Effects */}
                {h.occupantEffects && h.occupantEffects.length > 0 && (
                  <div style={{ marginTop: 8 }}>
                    <div className="small-text" style={{ fontWeight: 600, marginBottom: 4 }}>
                      {isHi ? 'स्थित ग्रहों का शास्त्रीय प्रभाव व संबंध:' : 'Occupant Classical Impacts & Sign Relationship:'}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      {h.occupantEffects.map((occ) => (
                        <div key={occ.graha} style={{
                          padding: '6px 8px',
                          background: 'rgba(255,255,255,0.03)',
                          border: '1px solid rgba(255,255,255,0.08)',
                          borderRadius: 4,
                          fontSize: '0.82rem',
                          lineHeight: 1.45,
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                            <strong>{trPlanet(occ.graha, lang)}</strong>
                            <span className={`tag ${occ.dignityRelation === 'Friend' ? 'tag-varg' : occ.dignityRelation === 'Enemy' ? 'tag-combust' : 'tag-karaka'}`} style={{ fontSize: '0.72rem', padding: '0 4px' }}>
                              {isHi ? (occ.dignityRelation === 'Friend' ? 'मित्र राशि' : occ.dignityRelation === 'Enemy' ? 'शत्रु राशि' : 'सम राशि') : `${occ.dignityRelation} Sign`}
                            </span>
                          </div>
                          <div>{isHi ? occ.generalHi : occ.generalEn}</div>
                          {occ.afflictedHi && (
                            <div style={{ color: '#dc2626', fontSize: '0.78rem', marginTop: 2 }}>
                              {isHi ? 'पीड़ित होने पर: ' + occ.afflictedHi : 'If Afflicted: ' + occ.afflictedEn}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Argala & Virodhargala Mechanics */}
                {h.pvrArgalaItems && h.pvrArgalaItems.length > 0 && (
                  <div style={{ marginTop: 8 }}>
                    <div className="small-text" style={{ fontWeight: 600, marginBottom: 4 }}>
                      {isHi ? 'अर्गला एवं विरोधागला विश्लेषण (हस्तक्षेप तंत्र):' : 'Argala & Virodhargala Intervention Dynamics:'}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                      {h.pvrArgalaItems.map((arg, aIdx) => (
                        <div key={aIdx} style={{
                          padding: '6px 8px',
                          background: 'rgba(139, 92, 246, 0.05)',
                          borderLeft: '3px solid #8b5cf6',
                          borderRadius: 4,
                          fontSize: '0.82rem',
                          lineHeight: 1.45,
                        }}>
                          <div>
                            <strong>{arg.argalaType}:</strong> {arg.argalaPlanets.map((p) => trPlanet(p, lang)).join(', ')} ({arg.nature})
                            {' · '}
                            <span style={{ color: arg.isObstructed ? '#dc2626' : '#16a34a', fontWeight: 600 }}>
                              {arg.isObstructed
                                ? (isHi ? `अवरुद्ध (भाव ${arg.obstructingHouse} में ${arg.obstructingPlanets.map((p) => trPlanet(p, lang)).join(', ')} द्वारा)` : `Obstructed by H${arg.obstructingHouse} (${arg.obstructingPlanets.join(', ')})`)
                                : (isHi ? 'निर्बाध (Unobstructed — पूर्ण सक्रिय)' : 'Unobstructed (Active)')}
                            </span>
                          </div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--muted)', marginTop: 2 }}>
                            {isHi ? arg.manifestationHi : arg.manifestationEn}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Classical Vedic Remedies (Upayas) */}
                {(h.remedyMantraHi || h.remedyMantraEn) && (
                  <div style={{
                    marginTop: 10,
                    padding: '8px 10px',
                    background: 'rgba(234, 179, 8, 0.07)',
                    border: '1px solid rgba(234, 179, 8, 0.3)',
                    borderRadius: 6,
                    fontSize: '0.84rem',
                    lineHeight: 1.5,
                  }}>
                    <div style={{ fontWeight: 700, color: '#ca8a04', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                      <ShieldCheck size={14} /> {isHi ? 'भाव शुद्धि एवं शास्त्रीय वैदिक उपाय (Vedic Remedies):' : 'Classical Vedic Remedial Upayas:'}
                    </div>
                    <div>
                      <strong>{isHi ? 'गुप्त मंत्र साधना:' : 'Mantra:'}</strong> {isHi ? h.remedyMantraHi : h.remedyMantraEn}
                    </div>
                    {h.remedyFastingHi && (
                      <div style={{ marginTop: 2 }}>
                        <strong>{isHi ? 'व्रत एवं दान:' : 'Fasting & Charity:'}</strong> {isHi ? h.remedyFastingHi : h.remedyFastingEn}
                      </div>
                    )}
                    {h.remedyRitualHi && (
                      <div style={{ marginTop: 2 }}>
                        <strong>{isHi ? 'यज्ञ / अनुष्ठान:' : 'Ritual / Pooja:'}</strong> {isHi ? h.remedyRitualHi : h.remedyRitualEn}
                      </div>
                    )}
                  </div>
                )}

                {/* Granular Karakatwas & Bhavat Bhavam Significations */}
                {h.karakatwams && h.karakatwams.length > 0 && (
                  <details style={{ marginTop: 8, fontSize: '0.83rem' }}>
                    <summary style={{ cursor: 'pointer', fontWeight: 600, color: 'var(--accent, #d97706)' }}>
                      {isHi
                        ? `${h.houseNumber}वें भाव के 30+ सूक्ष्म कारकत्व एवं भावत् भावम् संबंध (विस्तार देखें)`
                        : `30+ Granular Karakatwas & Derived Relations for House ${h.houseNumber} (Click to expand)`}
                    </summary>
                    <div style={{
                      marginTop: 6,
                      padding: '8px 10px',
                      background: 'rgba(0,0,0,0.02)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: 4,
                      maxHeight: 180,
                      overflowY: 'auto',
                    }}>
                      <ol style={{ margin: 0, paddingLeft: 18 }}>
                        {h.karakatwams.map((k, kIdx) => (
                          <li key={kIdx} style={{ marginBottom: 2 }}>{k}</li>
                        ))}
                      </ol>
                    </div>
                  </details>
                )}

                <div className="small-text muted" style={{ marginTop: 8, lineHeight: 1.5 }}>
                  <strong>{isHi ? 'भावेश का कार्यात्मक स्वामित्व:' : 'Lord’s Functional House Ownership:'}</strong>{' '}
                  {isHi ? h.lordFunctionalRolesHi.join(' · ') : h.lordFunctionalRolesEn.join(' · ')}
                  <div>{isHi ? h.lordFunctionalLordshipNoteHi : h.lordFunctionalLordshipNoteEn}</div>
                </div>

                {(h.chalitShiftNoteHi || h.chalitShiftNoteEn) && (
                  <div className="gochar-banner is-info">
                    {isHi ? h.chalitShiftNoteHi : h.chalitShiftNoteEn}
                  </div>
                )}

                {(h.primaryFactorsHi || h.primaryFactorsEn) && (
                  <div className="small-text" style={{ marginTop: 8, lineHeight: 1.55, whiteSpace: 'pre-line' }}>
                    <strong>{isHi ? 'विस्तृत ग्रह-प्रमाण:' : 'Detailed Planetary Evidence:'}</strong>{' '}
                    {isHi ? h.primaryFactorsHi : h.primaryFactorsEn}
                  </div>
                )}

                <div className="domain-factors">
                  <span className="factor-chip">
                    {isHi ? 'स्थित ग्रह:' : 'Occupants:'}{' '}
                    {h.occupants.length
                      ? h.occupants.map((o) => trPlanet(o, lang)).join(', ')
                      : isHi ? 'रिक्त' : 'None'}
                  </span>
                  <span className="factor-chip">
                    {isHi ? 'दृष्टि:' : 'Aspects:'}{' '}
                    {h.aspectingPlanets.length
                      ? h.aspectingPlanets.map((a) => trPlanet(a, lang)).join(', ')
                      : isHi ? 'कोई नहीं' : 'None'}
                  </span>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export const DegreeWisePanel: React.FC<{ items: DegreePredictionItem[] }> = ({ items }) => {
  const { lang } = useLanguage();
  const isHi = lang === 'hi';

  const [simPlanet, setSimPlanet] = useState<PredictionBodyId>('Sun');
  const [simSign, setSimSign] = useState<number>(0);
  const [simDeg, setSimDeg] = useState<number>(15);

  const simResult = useMemo(
    () =>
      analyzeBodyDegree(
        simPlanet,
        simSign,
        simDeg,
        `${Math.floor(simDeg)}°00'00"`,
        simSign * 30 + simDeg
      ),
    [simPlanet, simSign, simDeg]
  );

  return (
    <div className="view-stack">
      <section className="panel">
        <div className="panel-header">
          <h3>
            <Sliders size={15} />{' '}
            {isHi
              ? 'अंश-वार फलादेश (Degree-wise Predictions — बलादि अवस्था, पुष्कर व गंडांत जांच)'
              : 'Degree-wise Predictions (0°–30° Baladi Avastha, Pushkara & Critical Degrees)'}
          </h3>
          <span className="muted small-text">{isHi ? 'ग्रह अवस्था विश्लेषण' : 'Planetary Avasthas & States'}</span>
        </div>

        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th>{isHi ? 'ग्रह / लग्न' : 'Body'}</th>
                <th>{isHi ? 'राशि व अंश' : 'Sign & Degree'}</th>
                <th>{isHi ? 'बलादि अवस्था' : 'Baladi Avastha'}</th>
                <th>{isHi ? 'फल क्षमता' : 'Manifest %'}</th>
                <th>{isHi ? 'द्रेष्काण' : 'Drekkana'}</th>
                <th>{isHi ? 'विशेष अंश (पुष्कर / संधि)' : 'Special Degree Flags'}</th>
                <th>{isHi ? 'सूर्य से दूरी' : 'Sun Orb'}</th>
              </tr>
            </thead>
            <tbody>
              {items.map((d) => (
                <tr key={d.planet}>
                  <td><strong>{trPlanet(d.planet, lang)}</strong></td>
                  <td className="mono">
                    {trSign(d.signIndex, lang)} {d.dms}
                  </td>
                  <td>{isHi ? d.avasthaHi : d.avasthaEn}</td>
                  <td>
                    <span
                      className={`tag ${
                        d.strengthPercent >= 75
                          ? 'tag-varg'
                          : d.strengthPercent >= 45
                            ? 'tag-karaka'
                            : 'tag-retro'
                      }`}
                    >
                      {d.strengthPercent}%
                    </span>
                  </td>
                  <td>{isHi ? d.drekkanaLabelHi : d.drekkanaLabelEn}</td>
                  <td className="wrap-cell">
                    {d.specialDegTagHi || d.specialDegTagEn ? (
                      <span
                        className={`tag ${
                          d.isGandanta || d.isRashiSandhi
                            ? 'tag-combust'
                            : d.isPushkaraBhaga || d.isPushkaraNavamsha
                              ? 'tag-varg'
                              : 'tag-karaka'
                        }`}
                      >
                        {isHi ? d.specialDegTagHi : d.specialDegTagEn}
                      </span>
                    ) : (
                      <span className="muted">—</span>
                    )}
                  </td>
                  <td className="mono">
                    {d.sunDistanceDeg !== null ? `${d.sunDistanceDeg}°` : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Detailed Degree Cards */}
      <div className="placement-cards">
        {items.map((d) => (
          <article key={d.planet} className="placement-card">
            <div className="placement-card-top">
              <strong>
                {trPlanet(d.planet, lang)} · {trSign(d.signIndex, lang)} {d.degreeInSign.toFixed(2)}°
              </strong>
              <span className="tag tag-karaka">{d.strengthPercent}%</span>
            </div>
            <p className="yoga-desc">{isHi ? d.readingHi : d.readingEn}</p>
          </article>
        ))}
      </div>

      {/* Interactive 0°–30° Degree Simulator */}
      <section className="panel">
        <div className="panel-header">
          <h3>
            {isHi
              ? 'अंश कैलकुलेटर (0°–30° किसी भी डिग्री का फल जांचें)'
              : 'Interactive Degree (Ansha) Simulator (0°–30°)'}
          </h3>
          <div className="toolbar-group">
            <select
              className="select-compact"
              value={simPlanet}
              onChange={(e) => setSimPlanet(e.target.value as PredictionBodyId)}
            >
              {(['Asc', ...NINE_GRAHAS] as PredictionBodyId[]).map((b) => (
                <option key={b} value={b}>{trPlanet(b, lang)}</option>
              ))}
            </select>
            <select
              className="select-compact"
              value={simSign}
              onChange={(e) => setSimSign(Number(e.target.value))}
            >
              {SIGNS.map((s) => (
                <option key={s.index} value={s.index}>{trSign(s.index, lang)}</option>
              ))}
            </select>
            <input
              type="range"
              min={0}
              max={29.9}
              step={0.5}
              value={simDeg}
              onChange={(e) => setSimDeg(Number(e.target.value))}
            />
            <span className="mono tag tag-karaka">{simDeg.toFixed(1)}°</span>
          </div>
        </div>
        <div className="pred-card-body">
          <p className="lead-text">
            {isHi ? simResult.avasthaHi : simResult.avasthaEn} ({simResult.strengthPercent}%) ·{' '}
            {isHi ? simResult.drekkanaLabelHi : simResult.drekkanaLabelEn}
          </p>
          <p>{isHi ? simResult.readingHi : simResult.readingEn}</p>
        </div>
      </section>
    </div>
  );
};
