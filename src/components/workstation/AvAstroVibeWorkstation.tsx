import React, { useState } from 'react';
import type { BirthInput, CalcSettings, ChartData } from '../../astro/types';
import type { AppLanguage } from '../../i18n/translations';
import { DashaView } from '../DashaView';
import { AvRasiPane, AvVargaPane } from './AvChartPaneWidget';
import {
  CustomBuilderWorksheet,
  EphemerisWorksheet,
  MatchmakingWorksheet,
  ResearchAndSystemsWorksheet,
  VargasWorksheet,
} from './AvSpecialWorksheets';
import {
  AshtakavargaSavWidget,
  BhavabalaWidget,
  GocharLiveWidget,
  PlanetsTableWidget,
  ShadbalaWidget,
  ShadPhalaWidget,
  VarshaphalaSummaryWidget,
  Vimshottari5TierWidget,
} from './AvWorksheetWidgets';
import type { ChartDisplayOptions, WorksheetId } from './workstationTypes';

interface AvAstroVibeWorkstationProps {
  chart: ChartData;
  profiles: BirthInput[];
  settings: CalcSettings;
  lang: AppLanguage;
  activeWorksheet: WorksheetId;
  onSelectWorksheet: (ws: WorksheetId) => void;
  onAddAndLoadProfile: (input: BirthInput) => void;
}

export const AvAstroVibeWorkstation: React.FC<AvAstroVibeWorkstationProps> = ({
  chart,
  profiles,
  settings,
  lang,
  activeWorksheet,
  onSelectWorksheet,
  onAddAndLoadProfile,
}) => {
  const [displayOptions, setDisplayOptions] = useState<ChartDisplayOptions>({
    showDegrees: false,
    showArudhas: false,
    showSavInRasi: false,
    rasiRef: 'lagna',
    secondaryVarga: 'D9',
  });

  return (
    <div className="av-worksheet-canvas">
      {activeWorksheet === 'main' && (
        <div className="av-grid-4">
          <AvRasiPane
            chart={chart}
            chartStyle={settings.chartStyle}
            lang={lang}
            displayOptions={displayOptions}
            onUpdateDisplayOptions={setDisplayOptions}
            onExploreSimilarPlanet={() => onSelectWorksheet('yogas_research')}
          />
          <AvVargaPane
            chart={chart}
            chartStyle={settings.chartStyle}
            lang={lang}
            vargaId={displayOptions.secondaryVarga}
            onChangeVargaId={(next) =>
              setDisplayOptions({ ...displayOptions, secondaryVarga: next })
            }
            showDegrees={displayOptions.showDegrees}
          />
          <PlanetsTableWidget chart={chart} lang={lang} />
          <Vimshottari5TierWidget chart={chart} lang={lang} />
        </div>
      )}

      {activeWorksheet === 'vargas' && (
        <VargasWorksheet
          chart={chart}
          chartStyle={settings.chartStyle}
          lang={lang}
        />
      )}

      {activeWorksheet === 'strengths' && (
        <div className="av-grid-4">
          <ShadbalaWidget chart={chart} lang={lang} />
          <BhavabalaWidget chart={chart} lang={lang} />
          <ShadPhalaWidget chart={chart} lang={lang} />
          <AshtakavargaSavWidget
            chart={chart}
            chartStyle={settings.chartStyle}
            lang={lang}
          />
        </div>
      )}

      {activeWorksheet === 'dashas' && (
        <div className="av-pane-card" style={{ padding: '12px' }}>
          <DashaView chart={chart} />
        </div>
      )}

      {activeWorksheet === 'transits' && (
        <div className="av-grid-2">
          <GocharLiveWidget chart={chart} lang={lang} />
          <VarshaphalaSummaryWidget
            chart={chart}
            chartStyle={settings.chartStyle}
            lang={lang}
          />
        </div>
      )}

      {activeWorksheet === 'yogas_research' && (
        <ResearchAndSystemsWorksheet
          chart={chart}
          profiles={profiles}
          settings={settings}
          lang={lang}
          onLoadProfileOrBenchmark={(input) => {
            onAddAndLoadProfile(input);
            onSelectWorksheet('main');
          }}
        />
      )}

      {activeWorksheet === 'matchmaking' && (
        <MatchmakingWorksheet
          chart={chart}
          chartStyle={settings.chartStyle}
          profiles={profiles}
          settings={settings}
          lang={lang}
        />
      )}

      {activeWorksheet === 'ephemeris_panchang' && (
        <EphemerisWorksheet chart={chart} settings={settings} lang={lang} />
      )}

      {activeWorksheet === 'custom' && (
        <CustomBuilderWorksheet
          chart={chart}
          chartStyle={settings.chartStyle}
          lang={lang}
          displayOptions={displayOptions}
          onUpdateDisplayOptions={setDisplayOptions}
        />
      )}
    </div>
  );
};
