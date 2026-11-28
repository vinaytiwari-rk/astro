import React, { useMemo } from 'react';
import { computeBhavabalaReport } from '../astro/bhavabalaEngine';
import { SIGNS } from '../astro/constants';
import { computeJaimini } from '../astro/jaimini';
import {
  buildClassicalSynthesisContext,
  evaluateCareerAndAbroadOverlay,
  evaluateWeightedFatherAxis,
  evaluateWeightedMarriageAxis,
  evaluateWeightedProgenyAxis,
} from '../astro/predictions/classicalSynthesisEngine';
import { computeLifeSnapshotDossierReport } from '../astro/predictions/lifeSnapshotDossierEngine';
import type { ChartData, ChartStyle, DivisionalChartId } from '../astro/types';
import { trPlanet, trPlanetShort, trSign, type AppLanguage } from '../i18n/translations';
import { VedicChartSvg } from './VedicChartSvg';

interface ParasharaBookletFoliosProps {
  chart: ChartData;
  chartStyle: ChartStyle;
  language: AppLanguage;
}

const KEY_VARGAS: Array<{ id: DivisionalChartId; en: string; hi: string; tag: string }> = [
  { id: 'D3', en: 'Drekkana (D3 · Siblings)', hi: 'द्रेष्काण (D3 · सहोदर)', tag: 'D3' },
  { id: 'D4', en: 'Chaturthamsa (D4 · Assets)', hi: 'चतुर्थांश (D4 · संपत्ति)', tag: 'D4' },
  { id: 'D7', en: 'Saptamsa (D7 · Progeny)', hi: 'सप्तांश (D7 · संतान)', tag: 'D7' },
  { id: 'D12', en: 'Dwadasamsa (D12 · Parents)', hi: 'द्वादशांश (D12 · माता-पिता)', tag: 'D12' },
  { id: 'D24', en: 'Chaturvimsamsa (D24 · Vidya)', hi: 'चतुर्विंशांश (D24 · शिक्षा)', tag: 'D24' },
  { id: 'D60', en: 'Shashtiamsa (D60 · Karma)', hi: 'षष्ट्यंश (D60 · प्रारब्ध)', tag: 'D60' },
];

export const ParasharaBookletFolios: React.FC<ParasharaBookletFoliosProps> = ({
  chart,
  chartStyle,
  language,
}) => {
  const isHi = language === 'hi';

  const data = useMemo(() => {
    const synthCtx = buildClassicalSynthesisContext(chart);
    const bhavabala = computeBhavabalaReport(chart);
    const jaimini = computeJaimini(chart);
    const dossier = computeLifeSnapshotDossierReport(chart);
    const ascIdx = chart.ascendant.signIndex;
    const father = evaluateWeightedFatherAxis(synthCtx, ascIdx);
    const marriage = evaluateWeightedMarriageAxis(synthCtx, ascIdx);
    const progeny = evaluateWeightedProgenyAxis(synthCtx, ascIdx);
    const careerAbroad = evaluateCareerAndAbroadOverlay(synthCtx, ascIdx);
    const shadbalaSorted = Array.from(synthCtx.shadbalaByPlanet.values()).sort((a, b) => a.rank - b.rank);
    return {
      synthCtx,
      bhavabala,
      jaimini,
      dossier,
      father,
      marriage,
      progeny,
      careerAbroad,
      shadbalaSorted,
    };
  }, [chart]);

  const toVargaBadges = (varga: DivisionalChartId) =>
    chart.divisionalCharts[varga].placements.map((p) => ({
      id: p.id,
      label: trPlanetShort(p.id, language),
      signIndex: p.signIndex,
      isLagna: p.id === 'Asc',
      isRetrograde: p.isRetrograde,
      dignity: p.dignity,
    }));

  const { synthCtx, bhavabala, jaimini, dossier, father, marriage, progeny, careerAbroad, shadbalaSorted } = data;
  const spec = synthCtx.specialPointsDigest;

  return (
    <>
      {/* PARASHARA FOLIO A: 6-Component Shadbala Rank + Ishta/Kashta + Avasthas + Bhavabala */}
      <div className="print-page-break" />

      <section className="panel pl-folio-panel">
        <div className="panel-header pl-folio-head">
          <h3>
            {isHi
              ? 'पाराशरी शक्ति तालिका — षड्बल रैंक, इष्ट/कष्ट फल, अवस्था एवं भाव बल'
              : "Parashara Classical Strength Matrix — Shadbala Rank, Ishta/Kashta, Avasthas & Bhava Bala"}
          </h3>
          <span className="tag tag-karaka">{isHi ? 'षड्बल एवं भावबल' : 'BPHS Strength Folio'}</span>
        </div>

        <div className="pl-special-points-strip">
          <div>
            <strong>{isHi ? '२२वाँ द्रेष्काण:' : '22nd Drekkana:'}</strong>{' '}
            {trSign(spec.kharaDrekkanaSignIdx, language)} ({trPlanet(spec.kharaDrekkanaLord, language)})
          </div>
          <div>
            <strong>{isHi ? '६४वाँ नवांश:' : '64th Navamsha:'}</strong>{' '}
            {trSign(spec.chaturshashtaNavSignIdx, language)} ({trPlanet(spec.chaturshashtaNavLord, language)})
          </div>
          <div>
            <strong>{isHi ? 'योगी / अवयोगी:' : 'Yogi / Avayogi:'}</strong>{' '}
            {trPlanet(spec.yogiLord, language)} / {trPlanet(spec.avayogiLord, language)}
          </div>
          {synthCtx.avasthaReport && (
            <div>
              <strong>{isHi ? 'भृगु बिंदु:' : 'Bhrigu Bindu:'}</strong>{' '}
              {synthCtx.avasthaReport.bhriguBindu.signName} ({synthCtx.avasthaReport.bhriguBindu.dms}, H{synthCtx.avasthaReport.bhriguBindu.house})
            </div>
          )}
        </div>

        <div className="table-scroll">
          <table className="data-table pl-compact-table">
            <thead>
              <tr>
                <th>{isHi ? 'ग्रह' : 'Planet'}</th>
                <th>{isHi ? 'स्थान' : 'Sthana'}</th>
                <th>{isHi ? 'दिग्' : 'Dig'}</th>
                <th>{isHi ? 'काल' : 'Kala'}</th>
                <th>{isHi ? 'चेष्टा' : 'Cheshta'}</th>
                <th>{isHi ? 'नैसर्गिक' : 'Nais.'}</th>
                <th>{isHi ? 'दृक्' : 'Drik'}</th>
                <th>{isHi ? 'रूप' : 'Rupas'}</th>
                <th>{isHi ? 'अनुपात' : 'Ratio'}</th>
                <th>{isHi ? 'रैंक' : 'Rank'}</th>
                <th>{isHi ? 'इष्ट / कष्ट' : 'Ishta / Kashta'}</th>
                <th>{isHi ? 'बलादि / दीप्तादि अवस्था' : 'Avastha (Baladi · Deeptadi)'}</th>
              </tr>
            </thead>
            <tbody>
              {shadbalaSorted.map((s) => {
                const av = synthCtx.avasthaByPlanet.get(s.planet);
                return (
                  <tr key={s.planet}>
                    <td><strong>{trPlanet(s.planet, language)}</strong></td>
                    <td className="mono">{s.sthanaBala.toFixed(0)}</td>
                    <td className="mono">{s.digBala.toFixed(0)}</td>
                    <td className="mono">{s.kalaBala.toFixed(0)}</td>
                    <td className="mono">{s.cheshtaBala.toFixed(0)}</td>
                    <td className="mono">{s.naisargikaBala.toFixed(0)}</td>
                    <td className="mono">{s.drikBala.toFixed(0)}</td>
                    <td className="mono"><strong>{s.totalRupas.toFixed(2)}</strong></td>
                    <td className="mono">
                      <span className={`tag ${s.isStrong ? 'tag-varg' : 'tag-combust'}`}>{s.ratio.toFixed(2)}x</span>
                    </td>
                    <td className="mono"><strong>#{s.rank}</strong></td>
                    <td className="mono">{s.ishtaPhala.toFixed(1)} / {s.kashtaPhala.toFixed(1)}</td>
                    <td>{av ? `${av.baladi.split(' ')[0]} · ${av.deeptadi.split(' ')[0]}` : '-'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <h4 className="pl-subhead">
          {isHi ? 'द्वादश भाव बल एवं सर्वाष्टकवर्ग (SAV) बिंदु तालिका' : 'Twelve-House Bhavabala & Sarvashtakavarga (SAV) Synthesis Table'}
        </h4>
        <div className="table-scroll">
          <table className="data-table pl-compact-table">
            <thead>
              <tr>
                <th>{isHi ? 'भाव' : 'House'}</th>
                <th>{isHi ? 'राशि / स्वामी' : 'Sign / Lord'}</th>
                <th>{isHi ? 'भावेश बल' : 'Adhipati'}</th>
                <th>{isHi ? 'दिग्बल' : 'Dig'}</th>
                <th>{isHi ? 'दृष्टि बल' : 'Drishti'}</th>
                <th>{isHi ? 'कुल रूप' : 'Rupas'}</th>
                <th>{isHi ? 'रैंक' : 'Rank'}</th>
                <th>{isHi ? 'SAV बिंदु' : 'SAV Bindus'}</th>
                <th>{isHi ? 'प्रभाव स्तर' : 'Potency'}</th>
              </tr>
            </thead>
            <tbody>
              {bhavabala.houses.map((bh) => {
                const hSynth = synthCtx.bhavaByHouse.get(bh.house);
                return (
                  <tr key={bh.house}>
                    <td className="mono"><strong>H{bh.house}</strong></td>
                    <td>{trSign(bh.signIndex, language)} ({trPlanetShort(bh.lord, language)})</td>
                    <td className="mono">{bh.bhavadhipatiBalaVirupas.toFixed(0)}</td>
                    <td className="mono">{bh.bhavaDigbalaVirupas.toFixed(0)}</td>
                    <td className="mono">{bh.bhavaDrishtiBalaVirupas.toFixed(1)}</td>
                    <td className="mono"><strong>{bh.totalRupas.toFixed(2)}</strong></td>
                    <td className="mono">#{bh.rank}</td>
                    <td className="mono">
                      <strong className={(hSynth?.savBindus ?? 28) >= 30 ? 'tone-text-high' : (hSynth?.savBindus ?? 28) <= 23 ? 'tone-text-low' : ''}>
                        {hSynth?.savBindus ?? '-'}
                      </strong>
                    </td>
                    <td>{isHi ? bh.potencyVerdict.split('(')[1]?.replace(')', '') || bh.potencyVerdict : bh.potencyVerdict.split(' (')[0]}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* PARASHARA FOLIO B: Vector Shodashvarga Charts Grid + Jaimini Sutras Table */}
      <div className="print-page-break" />

      <section className="panel pl-folio-panel">
        <div className="panel-header pl-folio-head">
          <h3>
            {isHi
              ? 'षोडशवर्ग वेक्टर कुंडली चक्र (D3, D4, D7, D12, D24, D60) एवं जैमिनी कारक'
              : 'Vector Divisional Charts Folio (D3, D4, D7, D12, D24, D60) & Jaimini Karakas'}
          </h3>
          <span className="tag tag-varg">{isHi ? 'वेक्टर वर्ग कुंडली' : 'Vector Varga Atlas'}</span>
        </div>

        <div className="pl-varga-grid">
          {KEY_VARGAS.map((v) => (
            <VedicChartSvg
              key={v.id}
              title={`${isHi ? v.hi : v.en} — ${trSign(chart.divisionalCharts[v.id].lagnaSignIndex, language)}`}
              style={chartStyle}
              lagnaSignIndex={chart.divisionalCharts[v.id].lagnaSignIndex}
              items={toVargaBadges(v.id)}
              showDownload={false}
              compact
              centerLabel={v.tag}
            />
          ))}
        </div>

        <div className="pred-top-grid" style={{ marginTop: 12 }}>
          <div>
            <h4 className="pl-subhead">{isHi ? 'जैमिनी चर कारक एवं कारकांश' : 'Jaimini Chara Karakas & Karakamsha'}</h4>
            <table className="data-table pl-compact-table">
              <thead>
                <tr>
                  <th>{isHi ? 'कारक' : 'Role'}</th>
                  <th>{isHi ? 'ग्रह' : 'Planet'}</th>
                  <th>{isHi ? 'अंश' : 'Deg'}</th>
                  <th>{isHi ? 'राशि' : 'Sign'}</th>
                </tr>
              </thead>
              <tbody>
                {jaimini.karakas.map((k) => (
                  <tr key={k.role}>
                    <td><strong>{k.role}</strong></td>
                    <td>{trPlanet(k.planet, language)}</td>
                    <td className="mono">{k.actualDegreeInSign.toFixed(2)}°</td>
                    <td>{trSign(k.signIndex, language)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div>
            <h4 className="pl-subhead">{isHi ? 'प्रमुख आरुढ़ पद (AL, UL, A7, A10)' : 'Key Jaimini Arudha Padas (AL, UL, A7, A10)'}</h4>
            <table className="data-table pl-compact-table">
              <thead>
                <tr>
                  <th>{isHi ? 'पद' : 'Pada'}</th>
                  <th>{isHi ? 'राशि' : 'Sign'}</th>
                  <th>{isHi ? 'भाव' : 'House'}</th>
                </tr>
              </thead>
              <tbody>
                {jaimini.arudhaPadas
                  .filter((a) => [1, 4, 5, 7, 9, 10, 12].includes(a.house))
                  .map((a) => (
                    <tr key={a.label}>
                      <td><strong>{a.label}{a.specialLabel ? ` (${a.specialLabel})` : ''}</strong></td>
                      <td>{trSign(a.signIndex, language)}</td>
                      <td className="mono">H{a.houseFromLagna}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
            <p className="small-text muted" style={{ marginTop: 6 }}>
              {isHi ? jaimini.karakamsha.summaryHi : jaimini.karakamsha.summaryEn}
            </p>
          </div>
        </div>
      </section>

      {/* PARASHARA FOLIO C: Decisive Weighted Synthesis + All 16 Life Pillars Summary */}
      <div className="print-page-break" />

      <section className="panel pl-folio-panel">
        <div className="panel-header pl-folio-head">
          <h3>
            {isHi
              ? 'निर्णायक वैदिक फलादेश संश्लेषण एवं ३६०° षोडश-स्तंभ सारांश (१६ स्तंभ)'
              : 'Decisive Weighted Classical Synthesis & 360° Sixteen-Pillar Dossier'}
          </h3>
          <span className="tag tag-karaka">{isHi ? 'निर्णायक फलादेश' : 'Weighed Verdict (No Contradictions)'}</span>
        </div>

        <div className="pl-summary-band">
          <div>
            <strong>{isHi ? '१. पितृ एवं पैतृक पक्ष:' : '1. Paternal & Ancestral Axis:'}</strong>{' '}
            {isHi ? father.valHi : father.valEn}
          </div>
          <div>
            <strong>{isHi ? '२. विवाह समय एवं आयु सामंजस्य:' : '2. Marriage Timing & Spouse Parity:'}</strong>{' '}
            {isHi
              ? `${marriage.timingWindowHi} | ${marriage.spouseAgeParity.valHi}`
              : `${marriage.timingWindowEn} | ${marriage.spouseAgeParity.valEn}`}
          </div>
          <div>
            <strong>{isHi ? '३. संतान योग एवं गर्भधारण काल:' : '3. Progeny Yoga & Timing:'}</strong>{' '}
            {isHi
              ? `${progeny.childrenYoga.valHi} (${progeny.conceiveTiming.valHi})`
              : `${progeny.childrenYoga.valEn} (${progeny.conceiveTiming.valEn})`}
          </div>
          <div>
            <strong>{isHi ? '४. कार्यक्षेत्र एवं विदेश/प्रवास:' : '4. Career Specialization & Overseas/Migration:'}</strong>{' '}
            {isHi
              ? `${careerAbroad.techCareerSuffixHi.replace(/^ \| /, '')} · ${careerAbroad.abroadTravelResult.valHi}`
              : `${careerAbroad.techCareerSuffixEn.replace(/^ \| /, '')} · ${careerAbroad.abroadTravelResult.valEn}`}
          </div>
        </div>

        <div className="pl-dossier-grid">
          {dossier.pillars.map((pillar) => (
            <article key={pillar.id} className="pl-dossier-card">
              <h4>
                {pillar.pillarNumber}. {isHi ? pillar.titleHi : pillar.titleEn}
              </h4>
              <div className="pl-dossier-list">
                {pillar.attributes.slice(0, 5).map((attr) => (
                  <div key={attr.id} className="pl-dossier-row">
                    <strong>{isHi ? attr.titleHi : attr.titleEn}:</strong>{' '}
                    <span>{isHi ? attr.valueHi : attr.valueEn}</span>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
};
