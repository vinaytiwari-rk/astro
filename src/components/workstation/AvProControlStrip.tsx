import React, { useMemo, useRef } from 'react';
import { Check, Clock, Download, Layers, RotateCcw, Upload } from 'lucide-react';
import { expandPranaDasha, expandSookshmaDasha, findActiveDashaPath } from '../../astro/dasha';
import { parseGeovisionChartXml, serializeChartToGeovisionXml } from '../../astro/geovisionXml';
import type { AyanamsaId, BirthInput, CalcSettings, ChartData } from '../../astro/types';
import { trPlanet, trSign, type AppLanguage } from '../../i18n/translations';
import { WORKSHEET_TABS, type WorksheetId } from './workstationTypes';

const AYANAMSA_LABELS: Array<{ id: AyanamsaId; label: string }> = [
  { id: 'lahiri', label: 'Lahiri' },
  { id: 'true_chitra', label: 'True Chitra' },
  { id: 'kp', label: 'KP' },
  { id: 'raman', label: 'Raman' },
  { id: 'fagan_bradley', label: 'Fagan' },
  { id: 'yukteswar', label: 'Yukteswar' },
  { id: 'tropical', label: 'Sayana' },
];

interface AvProControlStripProps {
  chart: ChartData;
  activeInput: BirthInput;
  settings: CalcSettings;
  lang: AppLanguage;
  currentView: string;
  activeWorksheet: WorksheetId;
  rectifySeconds: number;
  onSelectWorksheet: (ws: WorksheetId) => void;
  onStepBirthSeconds: (sec: number) => void;
  onResetRectify: () => void;
  onCommitRectify: () => void;
  onUpdateSettings: (next: CalcSettings) => void;
  onImportXmlChart: (imported: BirthInput) => void;
}

export const AvProControlStrip: React.FC<AvProControlStripProps> = ({
  chart,
  activeInput,
  settings,
  lang,
  currentView,
  activeWorksheet,
  rectifySeconds,
  onSelectWorksheet,
  onStepBirthSeconds,
  onResetRectify,
  onCommitRectify,
  onUpdateSettings,
  onImportXmlChart,
}) => {
  const isHi = lang === 'hi';
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activePath = useMemo(() => {
    const now = Date.now();
    const path3 = findActiveDashaPath(chart.vimshottari, now);
    if (path3.length < 3) return path3;
    const sdList = expandSookshmaDasha(path3[2]);
    const sd = sdList.find((s) => now >= s.startMs && now < s.endMs);
    if (!sd) return path3;
    const prList = expandPranaDasha(sd);
    const pr = prList.find((p) => now >= p.startMs && now < p.endMs);
    return pr ? [...path3, sd, pr] : [...path3, sd];
  }, [chart.vimshottari]);

  const moon = chart.planets.find((p) => p.id === 'Moon');

  const formatDelta = (sec: number) => {
    if (sec === 0) return '0s';
    const sign = sec > 0 ? '+' : '-';
    const abs = Math.abs(sec);
    const h = Math.floor(abs / 3600);
    const m = Math.floor((abs % 3600) / 60);
    const s = abs % 60;
    const p = [];
    if (h) p.push(`${h}h`);
    if (m) p.push(`${m}m`);
    if (s || p.length === 0) p.push(`${s}s`);
    return `${sign}${p.join(' ')}`;
  };

  const handleXmlUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const parsed = parseGeovisionChartXml(text);
      if (parsed) onImportXmlChart(parsed);
    } finally {
      e.target.value = '';
    }
  };

  const handleXmlExport = () => {
    const xml = serializeChartToGeovisionXml(activeInput, chart.offsetMinutesUsed);
    const blob = new Blob([xml], { type: 'application/xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeInput.name.replace(/[^a-z0-9]+/gi, '_') || 'chart'}.xml`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="av-unified-strip no-print">
      {/* Row 1: Global Live Metrics + Time-Tool BTR Stepper + Ayanamsha / XML I/O */}
      <div className="av-strip-row">
        <div className="av-strip-metrics">
          <span>
            <strong>Asc:</strong> {trSign(chart.ascendant.signIndex, lang)} {chart.ascendant.shortDms}
          </span>
          <span>
            <strong>Moon:</strong> {moon ? `${trSign(moon.signIndex, lang)} · ${moon.nakshatraName}-${moon.pada}` : '-'}
          </span>
          <span className="av-dasha-path-pill">
            <strong>Dasha:</strong>{' '}
            {activePath.map((p) => trPlanet(p.lord as string, lang)).join(' → ') || 'N/A'}
          </span>
        </div>

        <div className="av-strip-controls">
          {/* Global Live Birth-Time Stepper (works across all views!) */}
          <div className="av-time-stepper" title={isHi ? 'तात्कालिक जन्म-समय सुधार' : 'Live Birth-Time Rectification'}>
            <Clock size={12} className="av-amber-ico" />
            <span className="av-stepper-label">{isHi ? 'समय:' : 'Time:'}</span>
            {[
              { lbl: '-1h', sec: -3600 },
              { lbl: '-10m', sec: -600 },
              { lbl: '-1m', sec: -60 },
              { lbl: '-10s', sec: -10 },
              { lbl: '+10s', sec: 10 },
              { lbl: '+1m', sec: 60 },
              { lbl: '+10m', sec: 600 },
              { lbl: '+1h', sec: 3600 },
            ].map((b) => (
              <button
                key={b.lbl}
                type="button"
                className="av-step-btn"
                onClick={() => onStepBirthSeconds(b.sec)}
              >
                {b.lbl}
              </button>
            ))}
            {rectifySeconds !== 0 && (
              <>
                <span className="av-delta-badge">{formatDelta(rectifySeconds)}</span>
                <button type="button" className="av-step-btn is-commit" onClick={onCommitRectify}>
                  <Check size={11} /> Save
                </button>
                <button type="button" className="av-step-btn" onClick={onResetRectify} title="Reset">
                  <RotateCcw size={11} />
                </button>
              </>
            )}
          </div>

          <select
            aria-label="Global Ayanamsa"
            className="av-select-xs"
            value={settings.ayanamsa}
            onChange={(e) => onUpdateSettings({ ...settings, ayanamsa: e.target.value as AyanamsaId })}
          >
            {AYANAMSA_LABELS.map((a) => (
              <option key={a.id} value={a.id}>{a.label}</option>
            ))}
          </select>

          <button
            type="button"
            className={`av-toggle-pill ${settings.nodeMode === 'true' ? 'is-on' : ''}`}
            onClick={() =>
              onUpdateSettings({
                ...settings,
                nodeMode: settings.nodeMode === 'mean' ? 'true' : 'mean',
              })
            }
          >
            {settings.nodeMode === 'true' ? 'True Nodes' : 'Mean Nodes'}
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept=".xml"
            style={{ display: 'none' }}
            onChange={handleXmlUpload}
          />
          <button
            type="button"
            className="av-tool-btn"
            onClick={() => fileInputRef.current?.click()}
            title="Import GeoVision .xml Chart"
          >
            <Upload size={12} />
            <span>Import XML</span>
          </button>
          <button
            type="button"
            className="av-tool-btn"
            onClick={handleXmlExport}
            title="Export Active Chart to .xml"
          >
            <Download size={12} />
            <span>Export XML</span>
          </button>
        </div>
      </div>

      {/* Row 2: Unified Interactive Worksheets Switcher */}
      <div className="av-worksheet-tabs" role="tablist" aria-label="Unified Worksheets">
        <span className="av-ws-prefix">
          <Layers size={12} />
          <span>{isHi ? 'वर्कशीट:' : 'Worksheets:'}</span>
        </span>
        {WORKSHEET_TABS.map((ws) => {
          const isActive = currentView === 'workstation' && activeWorksheet === ws.id;
          return (
            <button
              key={ws.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              className={`av-ws-tab ${isActive ? 'is-active' : ''}`}
              onClick={() => onSelectWorksheet(ws.id)}
            >
              <span>{isHi ? ws.labelHi : ws.labelEn}</span>
              <span className="av-ws-fkey">{ws.shortcut}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
