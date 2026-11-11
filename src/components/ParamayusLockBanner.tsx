import React from 'react';
import { Clock, ShieldAlert } from 'lucide-react';
import type { ParamayusStatus } from '../astro/predictions/paramayus';
import { useLanguage } from '../i18n/LanguageContext';

export const ParamayusLockBanner: React.FC<{ status: ParamayusStatus }> = ({ status }) => {
  const { lang } = useLanguage();
  const isHi = lang === 'hi';

  return (
    <section className="panel">
      <div className="panel-header">
        <h2>
          <ShieldAlert size={17} />{' '}
          {isHi ? status.titleHi : status.titleEn}
        </h2>
        <span className="tag tag-combust">
          {isHi ? 'दिवंगत / अमर (120+ वर्ष)' : 'Departed (Dead) / Amar (>120 Yrs)'}
        </span>
      </div>

      <div className="pred-card-body">
        <div className="gochar-banner is-alert">
          <div>
            <strong>
              {isHi
                ? 'फलादेश अवरुद्ध — वैदिक परमायु सीमा (120 वर्ष) से अधिक आयु'
                : 'Predictions Disabled — Life Surpassed 120-Year Vedic Paramayus'}
            </strong>
            <div style={{ marginTop: 6 }}>{isHi ? status.messageHi : status.messageEn}</div>
          </div>
        </div>

        <div className="branch-highlights">
          <div className="highlight-box">
            <div className="hl-label">{isHi ? 'जन्म तिथि' : 'Birth Date'}</div>
            <div className="hl-val mono">{status.birthDate}</div>
            <div className="hl-sub">
              {isHi ? `120 वर्ष पूर्ण वर्ष: ${status.completed120Year}` : `120-Yr Cycle Completed: ${status.completed120Year}`}
            </div>
          </div>
          <div className="highlight-box">
            <div className="hl-label">{isHi ? 'वर्तमान / चयनित आयु' : 'Elapsed Age'}</div>
            <div className="hl-val">
              <Clock size={15} style={{ marginRight: 5, verticalAlign: 'middle' }} />
              {status.ageYears} {isHi ? 'वर्ष' : 'Years'}
            </div>
            <div className="hl-sub">
              {isHi ? 'परमायु सीमा: अधिकतम 120 वर्ष' : 'Classical Paramayus Cap: 120 Years'}
            </div>
          </div>
          <div className="highlight-box">
            <div className="hl-label">{isHi ? 'शास्त्रीय स्थिति' : 'Classification'}</div>
            <div className="hl-val">{isHi ? 'दिवंगत अथवा अमर' : 'Dead (Divangat) / Amar'}</div>
            <div className="hl-sub">
              {isHi
                ? 'ऐतिहासिक व सामान्य सभी कुंडलियों पर लागू'
                : 'Applied universally to historical & personal charts'}
            </div>
          </div>
        </div>

        <div className="gochar-banner is-info small-text">
          {isHi ? status.noteHi : status.noteEn}
        </div>
      </div>
    </section>
  );
};
