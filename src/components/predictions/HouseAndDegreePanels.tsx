import React, { useMemo, useState } from 'react';
import { AlertTriangle, BookOpen, CheckCircle2, Compass, Sliders } from 'lucide-react';
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
        qHi: 'देह, आरोग्य, दीर्घायु, आत्मबल व सामाजिक प्रभाव:',
        qEn: 'Vitality, Physique, Stature, Willpower & Social Aura:',
        aHi: isGood
          ? 'बृहत्पाराशर होराशास्त्र अनुसार लग्नेश की अनुकूल स्थिति से जातक को तेजस्वी व्यक्तित्व, उत्कृष्ट शारीरिक रोग-प्रतिरोधक क्षमता (ओजस) एवं समाज में स्वाभाविक नेतृत्व प्राप्त होता है। आयु २१ से २४ वर्ष में बौद्धिक नींव पूर्ण होती है तथा २६ से २८ वर्ष में समाज में स्वतंत्र पहचान व मान-सम्मान का उत्कर्ष होता है।'
          : 'प्रारंभिक वर्षों में शारीरिक स्वास्थ्य व मौसमी व्याधियों के प्रति सतर्कता अपेक्षित है। नियमित योगाभ्यास, सूर्य नमस्कार एवं सात्विक दिनचर्या अपनाने से आत्मबल में वृद्धि होती है और आयु २८ के बाद स्थायी स्वावलंबन व आरोग्यता स्थापित होती है।',
        aEn: isGood
          ? 'Per Brihat Parashara Hora Shastra, a fortified Lagna lord confers magnetic personality, robust immune vitality (Ojas), and commanding societal leadership. Core intellectual foundation solidifies at age 21–24, followed by independent recognition and executive identity at age 26–28.'
          : 'Early years warrant attentive wellness care against lifestyle strain. Daily Surya Namaskar, pranayama, and disciplined habits strengthen constitutional vitality, unlocking firm self-reliance and vigor past age 28.',
      };
    case 2:
      return {
        qHi: 'संचित कोष, पैतृक संपत्ति, वाणी प्रभाव व पारिवारिक सुख:',
        qEn: 'Accumulated Treasury, Family Heritage, Speech & Stability:',
        aHi: isGood
          ? 'आचार्य रामानुजाचार्य कृत भावार्थ रत्नाकर के अनुसार द्वितीयेश की शुभ स्थिति से जातक को स्थायी धन संचय, कुल का पूर्ण सहयोग एवं वाणी में गंभीरता प्राप्त होती है। आयु २७ से २९ वर्ष में प्रथम स्थायी आय स्रोत की स्थापना तथा आयु ३१ से ३४ वर्ष में संचित कोष व पैतृक संपत्ति में उल्लेखनीय वृद्धि होती है।'
          : 'वाणी में कटुता व अविवेकपूर्ण व्यय से बचाव रखें। सट्टेबाजी व असुरक्षित ऋण देने से बचें; सुव्यवस्थित बजट व अनुशासित बचत से आयु ३२ के पश्चात कोष में स्थायित्व व समृद्धि निर्मित होगी।',
        aEn: isGood
          ? 'In accordance with Sri Ramanujacharya’s Bhavartha Ratnakara, a favorable 2nd lord grants disciplined wealth preservation, steadfast family backing, and persuasive speech. A primary stable revenue stream forms at age 27–29, followed by significant treasury expansion during ages 31–34.'
          : 'Guard against impulsive expenditure and harsh speech. Avoid speculative lending; disciplined budgeting and systematic savings build enduring financial security past age 32.',
      };
    case 3:
      return {
        qHi: 'पराक्रम, पुरुषार्थ, छोटे भाई-बहन व उद्यम सिद्धि:',
        qEn: 'Courage, Initiative, Co-born Siblings & Enterprise:',
        aHi: isGood
          ? 'कल्याण वर्मा कृत सारावली अनुसार अदम्य पराक्रम, स्वतंत्र पुरुषार्थ से भाग्योदय, छोटे भाई-बहनों से स्नेह एवं सफल व्यावसायिक यात्राएं। आयु २६ से २८ वर्ष में जातक अपने बाहुबल व कौशल से विशिष्ट व्यावसायिक सफलता व पहचान अर्जित करता है।'
          : 'अनावश्यक जोखिमपूर्ण निर्णयों व जल्दबाजी से बचें। अपनी ऊर्जा को एकाग्र दिशा में लगाएं; भाइयों व सहयोगियों से पारदर्शिता रखने पर पुरुषार्थ का पूर्ण फल प्राप्त होगा।',
        aEn: isGood
          ? 'Per Kalyana Varma’s Saravali, dynamic valor, self-made initiative, affectionate sibling ties, and profitable ventures flourish. High enterprise milestones manifest around age 26–28 through personal competence.'
          : 'Channel energetic initiative constructively; avoid scattered pursuits and impetuous disputes. Transparent collaboration with associates ensures steady fruition of hard work.',
      };
    case 4:
      return {
        qHi: 'मातृ सुख, भूमि, भवन, वाहन एवं गृहस्थ शांति:',
        qEn: 'Maternal Grace, Landed Property, Vehicles & Inner Peace:',
        aHi: isGood
          ? 'फलदीपिका अनुसार माता का अगाध आशीर्वाद, पारिवारिक सौख्य, आयु २७ से ३१ वर्ष में मनपसंद वाहन सुख तथा आयु ३३ से ३७ वर्ष में स्वयं के भव्य गृह निर्माण/भूमि अर्जन का प्रबल मांगलिक योग।'
          : 'पारिवारिक सौहार्द व माता के स्वास्थ्य के प्रति सजग रहें। संपत्ति क्रय-विक्रय में कानूनी जांच पूर्ण रखें; आयु ३२ के पश्चात धैर्य व योजनाबद्ध निवेश से अचल संपत्ति का स्थायी लाभ होगा।',
        aEn: isGood
          ? 'Per Phaladeepika, maternal blessings, domestic harmony, prime vehicle acquisition at age 27–31, and grand home or landed property ownership during ages 33–37 are strongly indicated.'
          : 'Nurture domestic peace and attend to maternal wellness. Exercise legal diligence in real estate documentation; structured patience unlocks solid immovable assets past age 32.',
      };
    case 5:
      return {
        qHi: 'संतान योग, उच्च मेधा, विवेक एवं पूर्व पुण्य फलोदय:',
        qEn: 'Progeny Blessings, Higher Intellect, Wisdom & Purva Punya:',
        aHi: isGood
          ? 'बृहत्पाराशर होराशास्त्र अनुसार कुशाग्र बुद्धि, उच्च विद्या में विशिष्ट सम्मान, सुसंस्कृत एवं आज्ञाकारी संतान सुख (आयु २६ से ३० वर्ष) तथा पूर्व जन्म के संचित पुण्यों से संकटों में स्वतः ईश्वरीय मार्गदर्शन।'
          : 'संतान के अध्ययन व स्वास्थ्य पर सतत ध्यान दें। शेयर बाजार या सट्टे में अत्यधिक जोखिम से बचें; विद्या व ज्ञान के निरंतर संवर्धन से भाग्योदय सुनिश्चित होता है।',
        aEn: isGood
          ? 'According to BPHS, keen intellect, academic distinction, dutiful and accomplished progeny around age 26–30, and divine intuition arising from past-life merits (Purva Punya) are assured.'
          : 'Prioritize progeny mentoring and emotional bonding. Avoid speculative financial gambles; steady scholastic and analytical application steadily elevates status.',
      };
    case 6:
      return {
        qHi: 'शत्रु शमन, रोग-प्रतिरोध, ऋण मुक्ति व प्रतियोगी विजय:',
        qEn: 'Adversary Triumph, Disease Immunity, Debt Relief & Competition:',
        aHi: isGood
          ? 'फलदीपिका अनुसार शत्रुओं पर पूर्ण विजय, प्रतियोगी परीक्षाओं एवं साक्षात्कारों में उत्कृष्ट सफलता, ऋणों से त्वरित मुक्ति एवं कार्यक्षेत्र में विरोधियों पर स्वाभाविक वर्चस्व।'
          : 'पाचन, उदर एवं वात-पित्त संतुलन के प्रति सावधान रहें। बिना लिखा-पढ़ी किसी को बड़ा उधार न दें; नियमित दिनचर्या व सात्विक खानपान से सभी व्याधियों पर नियंत्रण रहेगा।',
        aEn: isGood
          ? 'Per Phaladeepika, complete triumph over adversaries, outstanding competitive exam and interview performance, swift liquidation of debts, and effortless professional dominance.'
          : 'Maintain digestive vigilance and dietary balance. Avoid uncollateralized lending to acquaintances; steady daily regimens protect against chronic inflammation.',
      };
    case 7:
      return {
        qHi: 'विवाह काल, जीवनसाथी का स्वरूप व दांपत्य माधुर्य:',
        qEn: 'Marriage Timing, Spouse Persona, Partnership & Matrimony:',
        aHi: isGood
          ? 'बृहत्पाराशर होराशास्त्र अनुसार आयु २५ से २९ वर्ष में विवाह का सर्वोत्तम योग; जीवनसाथी सुसंस्कृत, बुद्धिमान, रूपवान, प्रतिष्ठित कुल से संबंध रखने वाला एवं वैवाहिक जीवन में परस्पर निष्ठा व समृद्धि देने वाला होगा।'
          : 'विवाह निर्णय में जल्दबाजी न करें; कुंडली मिलान व आपसी समझ को प्राथमिकता दें। आयु २८ के पश्चात परिपक्वता से दांपत्य में स्थायी स्थायित्व व मधुरता आएगी।',
        aEn: isGood
          ? 'Per BPHS, prime auspicious marriage window opens at age 25–29; spouse is cultured, intelligent, dignified, aesthetic, from an honorable lineage, bringing mutual prosperity and harmony.'
          : 'Avoid impulsive haste in marital alliances; prioritize deep compatibility and shared values. Nuptials past age 28 yield seasoned emotional grounding and lasting companionship.',
      };
    case 8:
      return {
        qHi: 'दीर्घायु योग, गूढ़ अनुसंधान, पैतृक लाभ व रूपांतरण:',
        qEn: 'Longevity Assurance, Occult Depth, Inheritance & Transformation:',
        aHi: isGood
          ? 'पृथु यशस् कृत होरासार अनुसार दीर्घायु योग (७५+ वर्ष), गूढ़ विद्याओं, ज्योतिष व शोध में असाधारण रुचि तथा वसीयत, बीमा या अप्रत्याशित स्रोतों से आकस्मिक लाभ का योग।'
          : 'वाहन सावधानी से चलाएं एवं रात्रि में यात्राओं में सतर्क रहें। भगवान शिव की आराधना व महामृत्युंजय मंत्र जप से आयु-आरोग्य की पूर्ण रक्षा एवं मानसिक शांति प्राप्त होती है।',
        aEn: isGood
          ? 'Per Horasara of Prithu Yasas, Full Longevity (Dirghayu 75+ years) is assured, accompanied by deep fascination with occult research, analytics, and unexpected windfall or inheritance gains.'
          : 'Exercise vehicular caution and avoid late-night road risks. Devotion to Lord Shiva and Maha Mrityunjaya Japa provides an unshakeable protective shield for life and health.',
      };
    case 9:
      return {
        qHi: 'भाग्योदय, पिता का आशीष, गुरु कृपा व तीर्थाटन:',
        qEn: 'Fortune Awakening, Paternal Grace, Dharma & Pilgrimages:',
        aHi: isGood
          ? 'बृहत्पाराशर होराशास्त्र अनुसार ईश्वरीय कृपा से संकटों में स्वतः रक्षा, पिता व गुरुजनों का स्नेहमयी मार्गदर्शन, धार्मिक निष्ठा एवं आयु २५, २९ व ३६ वर्ष में महत्वपूर्ण भाग्योदय व पवित्र तीर्थ यात्राएं।'
          : 'धार्मिक मर्यादाओं व नीति का मार्ग कभी न छोड़ें। पिता एवं वरिष्ठों का सम्मान करने से भाग्य के समस्त अवरोध स्वतः समाप्त होकर उन्नति का मार्ग प्रशस्त होता है।',
        aEn: isGood
          ? 'Per BPHS, providential protection in worldly crises, profound paternal blessings, spiritual mentor guidance, and major fortune breakthroughs at ages 25, 29, and 36 alongside sacred travels.'
          : 'Remain anchored to ethical dharma and truth. Reverence toward parents and spiritual teachers systematically dissolves karmic bottlenecks and unlocks auspicious fortune.',
      };
    case 10:
      return {
        qHi: 'करियर उत्कर्ष, प्रशासनिक अधिकार, पद-प्रतिष्ठा व शासन लाभ:',
        qEn: 'Career Zenith, Administrative Authority, Rank & Governance:',
        aHi: isGood
          ? 'फलदीपिका एवं सारावली अनुसार प्रशासनिक अधिकार, उच्च प्रबंधकीय पद, नेतृत्व कीर्ति एवं आयु ३० से ३३ वर्ष में पदोन्नति तथा आयु ३६ से ४० वर्ष में करियर का ऐतिहासिक स्वर्णिम उत्कर्ष (Zenith)।'
          : 'कार्यस्थल की आंतरिक राजनीति व विवादों से दूर रहें। अपनी व्यावसायिक निपुणता व निष्ठा को ही आधार बनाएं; सतत पुरुषार्थ से आयु ३४ के बाद स्थायी पद-प्रतिष्ठा प्राप्त होगी।',
        aEn: isGood
          ? 'Per Phaladeepika and Saravali, executive administrative authority, leadership status, institutional honor, decisive promotion at age 30–33, and monumental career zenith during ages 36–40.'
          : 'Steer clear of office factionalism and workplace gossip. Cultivate technical mastery and professional integrity; consistent effort establishes enduring stature past age 34.',
      };
    case 11:
      return {
        qHi: 'स्थायी आय स्रोत, प्रतिष्ठित मित्र, लाभ व महत्वाकांक्षा पूर्ति:',
        qEn: 'Recurring Income Streams, Elite Network, Gains & Aspirations:',
        aHi: isGood
          ? 'भावार्थ रत्नाकर अनुसार जीवन में आय के एकाधिक स्थायी स्रोत, प्रभावशाली व उच्च पदस्थ मित्रों का सहयोग एवं आयु ३२ से ३५ व ४२+ वर्ष में सभी दीर्घकालिक महत्वाकांक्षाओं की पूर्ण सिद्धि।'
          : 'आय व व्यय के संतुलन पर ध्यान दें। मित्रों के साथ व्यावसायिक लेन-देन में स्पष्टता रखें; विवेकपूर्ण निवेश से वित्तीय समृद्धि निरंतर बढ़ती रहेगी।',
        aEn: isGood
          ? 'Per Bhavartha Ratnakara, multiple diversified revenue streams, influential high-status social networks, and full realization of long-cherished life ambitions at ages 32–35 and 42+.'
          : 'Balance cash retention against operational expenditures. Maintain commercial clarity in shared endeavors with peers; prudent investing compounds wealth steadily.',
      };
    case 12:
      return {
        qHi: 'विदेश गमन, सुदूर व्यापार, व्यय संतुलन, शयन सुख व मोक्ष:',
        qEn: 'Foreign Settlement, Cross-border Trade, Bed Comfort & Moksha:',
        aHi: isGood
          ? 'उत्तर कालामृत अनुसार सुदूर विदेश यात्रा, बहुराष्ट्रीय कंपनियों/विदेशी मुद्रा से प्रचुर लाभ अथवा स्थायी विदेशी निवास (PR) का योग; परोपकारी कार्यों में व्यय तथा अंतर्मुखी आध्यात्मिक शांति।'
          : 'अनावश्यक दिखावे व अपव्यय पर नियंत्रण रखें। सोने से पूर्व ध्यान, प्राणायाम व सात्विक चिंतन करने से गहरी आरामदायक निद्रा व मानसिक शांति की प्राप्ति होगी।',
        aEn: isGood
          ? 'Per Uttara Kalamrita, foreign travel, lucrative cross-border commerce, permanent foreign residency, philanthropic stewardship, and profound inner spiritual contemplation.'
          : 'Curtail ostentatious expenditure. Evening meditation, pranayama, and detached contemplation grant restorative sleep and mental equanimity.',
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
              <article key={h.houseNumber} className="domain-card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {/* 1. Header with House Title & Lord summary */}
                <div className="domain-top" style={{ borderBottom: '1px solid var(--border)', paddingBottom: '8px', marginBottom: '2px' }}>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '15.5px', fontWeight: 700 }}>{isHi ? h.titleHi : h.titleEn}</h4>
                    <div className="muted small-text" style={{ marginTop: '3px' }}>
                      {trSign(h.signIndex, lang)} · {isHi ? 'भावेश:' : 'Lord:'}{' '}
                      <strong>{trPlanet(h.lordPlanet, lang)}</strong> → {t.common.house}{h.lordPlacedHouse} ({trTerm(h.lordDignity, lang)})
                    </div>
                  </div>
                  <span className={`tag ${
                    h.score >= 70 ? 'tag-varg' : h.score >= 55 ? 'tag-karaka' : 'tag-combust'
                  }`}>
                    {isHi ? h.verdictHi : h.verdictEn}
                  </span>
                </div>

                {/* 2. TOP: Rich Decisive Prediction Narrative */}
                <div style={{
                  padding: '14px 16px',
                  background: 'var(--accent-soft)',
                  borderRadius: 8,
                  borderLeft: '4px solid var(--accent)',
                  fontSize: '13.5px',
                  lineHeight: 1.65,
                }}>
                  <strong style={{ color: 'var(--accent)', display: 'block', marginBottom: '6px', fontSize: '14.5px', fontWeight: 700 }}>
                    {isHi ? (h.headlineHi || 'प्रामाणिक शास्त्रीय फलादेश:') : (h.headlineEn || 'Authoritative Shastric Prophecy:')}
                  </strong>
                  <div style={{ whiteSpace: 'pre-line', color: 'var(--text)' }}>
                    {isHi ? (h.coreNarrativeHi || h.predictionHi) : (h.coreNarrativeEn || h.predictionEn)}
                  </div>
                </div>

                {/* 2b. Two-Column Grid: Key Strengths vs Cautions */}
                {((h.keyStrengthsEn && h.keyStrengthsEn.length > 0) || (h.watchOutsEn && h.watchOutsEn.length > 0)) && (
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                    gap: '10px',
                    marginTop: '2px',
                  }}>
                    {h.keyStrengthsEn && h.keyStrengthsEn.length > 0 && (
                      <div style={{
                        padding: '10px 12px',
                        background: 'rgba(34, 197, 94, 0.06)',
                        border: '1px solid rgba(34, 197, 94, 0.2)',
                        borderRadius: 6,
                        fontSize: '12.5px',
                        lineHeight: 1.45,
                      }}>
                        <strong style={{ color: '#16a34a', display: 'flex', alignItems: 'center', gap: 4, marginBottom: '4px' }}>
                          <CheckCircle2 size={13} /> {isHi ? 'मुख्य सकारात्मक सामर्थ्य (Key Strengths):' : 'Key Natural Strengths:'}
                        </strong>
                        <ul style={{ margin: 0, paddingLeft: '16px' }}>
                          {(isHi ? (h.keyStrengthsHi || h.keyStrengthsEn) : h.keyStrengthsEn).map((str, idx) => (
                            <li key={idx} style={{ marginBottom: '3px' }}>{str}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {h.watchOutsEn && h.watchOutsEn.length > 0 && (
                      <div style={{
                        padding: '10px 12px',
                        background: 'rgba(239, 68, 68, 0.06)',
                        border: '1px solid rgba(239, 68, 68, 0.2)',
                        borderRadius: 6,
                        fontSize: '12.5px',
                        lineHeight: 1.45,
                      }}>
                        <strong style={{ color: '#dc2626', display: 'flex', alignItems: 'center', gap: 4, marginBottom: '4px' }}>
                          <AlertTriangle size={13} /> {isHi ? 'सावधानियां एवं चुनौतियां (Watch-Outs):' : 'Cautions & Pitfalls to Avoid:'}
                        </strong>
                        <ul style={{ margin: 0, paddingLeft: '16px' }}>
                          {(isHi ? (h.watchOutsHi || h.watchOutsEn) : h.watchOutsEn).map((wo, idx) => (
                            <li key={idx} style={{ marginBottom: '3px' }}>{wo}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {/* 3. Concrete Event Timing & Prediction Q&A Block */}
                <div style={{
                  padding: '10px 12px',
                  background: 'rgba(217, 119, 6, 0.08)',
                  borderLeft: '4px solid #d97706',
                  borderRadius: 8,
                  fontSize: '12.5px',
                  lineHeight: 1.5,
                }}>
                  <strong style={{ color: '#b45309', display: 'block', marginBottom: '3px' }}>
                    {isHi ? (h.timingMilestonesHi ? 'फलोदय कालखंड व महत्वपूर्ण जीवन पड़ाव:' : eventQa.qHi) : (h.timingMilestonesEn ? 'Milestone Timing & Life Fruition Window:' : eventQa.qEn)}
                  </strong>
                  <div style={{ color: 'var(--text)' }}>
                    {isHi ? (h.timingMilestonesHi || eventQa.aHi) : (h.timingMilestonesEn || eventQa.aEn)}
                  </div>
                </div>

                {/* 4. House Lord's Placement Karma */}
                <div style={{ fontSize: '13px', lineHeight: 1.5, padding: '8px 10px', background: 'var(--bg-subtle)', borderRadius: 6 }}>
                  <strong>
                    {isHi
                      ? `${h.houseNumber}वें भावेश का ${h.lordPlacedHouse}वें भाव में फल (Karma): `
                      : `House ${h.houseNumber} Lord in House ${h.lordPlacedHouse} (Karma): `}
                  </strong>
                  <span>
                    {isHi
                      ? (h.lordPlacementKarmaHi || h.lordReadingHi)
                      : (h.lordPlacementKarmaEn || h.lordReadingEn)}
                  </span>
                </div>

                {/* 5. Sign Archetype & Demeanor */}
                {(h.signPersonalityHi || h.signPersonalityEn) && (
                  <div style={{
                    padding: '8px 10px',
                    background: 'rgba(59, 130, 246, 0.05)',
                    borderLeft: '3px solid #3b82f6',
                    borderRadius: 6,
                    fontSize: '12.5px',
                    lineHeight: 1.45,
                  }}>
                    <strong>{isHi ? `${trSign(h.signIndex, lang)} राशि का इस भाव में स्वभाव:` : `${h.signNameEn} Sign Archetype in this House:`}</strong>{' '}
                    {isHi ? h.signPersonalityHi : h.signPersonalityEn}
                    {h.signPositiveTrait && (
                      <div style={{ marginTop: 3, fontSize: '11.5px' }}>
                        <span style={{ color: '#16a34a' }}>+ {isHi ? 'सकारात्मक गुण:' : 'Strengths:'} {h.signPositiveTrait}</span>
                        {' · '}
                        <span style={{ color: '#dc2626' }}>- {isHi ? 'चुनौती:' : 'Shadow:'} {h.signNegativeTrait}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* 6. Occupants with Dignity Relation & Classical Effects */}
                {h.occupantEffects && h.occupantEffects.length > 0 && (
                  <div>
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
                          fontSize: '12.5px',
                          lineHeight: 1.45,
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                            <strong>{trPlanet(occ.graha, lang)}</strong>
                            <span className={`tag ${occ.dignityRelation === 'Friend' ? 'tag-varg' : occ.dignityRelation === 'Enemy' ? 'tag-combust' : 'tag-karaka'}`} style={{ fontSize: '11px', padding: '0 4px' }}>
                              {isHi ? (occ.dignityRelation === 'Friend' ? 'मित्र राशि' : occ.dignityRelation === 'Enemy' ? 'शत्रु राशि' : 'सम राशि') : `${occ.dignityRelation} Sign`}
                            </span>
                          </div>
                          <div>{isHi ? occ.generalHi : occ.generalEn}</div>
                          {occ.afflictedHi && (
                            <div style={{ color: '#dc2626', fontSize: '11.5px', marginTop: 2 }}>
                              {isHi ? 'पीड़ित होने पर: ' + occ.afflictedHi : 'If Afflicted: ' + occ.afflictedEn}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 7. Classical Vedic Remedies (Upayas) */}
                {(h.remedyMantraHi || h.remedyMantraEn) && (
                  <div style={{
                    padding: '8px 10px',
                    background: 'rgba(234, 179, 8, 0.07)',
                    border: '1px solid rgba(234, 179, 8, 0.3)',
                    borderRadius: 6,
                    fontSize: '12.5px',
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

                {/* 8. Collapsible Classical Astrological Details */}
                <details style={{
                  marginTop: '4px',
                  padding: '8px 10px',
                  background: 'var(--bg-subtle)',
                  borderRadius: 6,
                  fontSize: '12px',
                  border: '1px solid var(--border)',
                }}>
                  <summary style={{ cursor: 'pointer', fontWeight: 600, color: 'var(--text-muted)' }}>
                    {isHi ? 'शास्त्रीय गणना सूत्र व तकनीकी विवरण देखें (Technical Astrological Details)' : 'View Classical Shastric Calculations & Details'}
                  </summary>
                  <div style={{ marginTop: '8px', whiteSpace: 'pre-line', lineHeight: 1.5, color: 'var(--text)' }}>
                    {isHi ? h.synthesisHi : h.synthesisEn}
                  </div>
                </details>
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
