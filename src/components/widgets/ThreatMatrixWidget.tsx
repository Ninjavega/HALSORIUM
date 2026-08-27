import React, { useState } from 'react';
import { WidgetInstance, DefconLevel } from '../../types/widget';
import { WidgetFrame } from './WidgetFrame';
import { useDashboard } from '../../context/DashboardContext';
import { getThemeClasses } from '../../utils/themeStyles';
import { eventBus } from '../../services/eventBus';
import { soundFx } from '../../services/soundFx';
import { 
  ShieldAlert, 
  AlertTriangle, 
  Radio, 
  Flame, 
  Compass, 
  Lock, 
  Zap, 
  Globe, 
  Activity 
} from 'lucide-react';

interface ThreatSector {
  id: string;
  name: string;
  level: 'CRITICAL' | 'ELEVATED' | 'MODERATE' | 'NOMINAL';
  score: number;
  description: string;
  indicator: string;
}

const INITIAL_SECTORS: ThreatSector[] = [
  { id: 'sec-1', name: 'INDO-PACIFIC / TAIWAN STRAIT', level: 'ELEVATED', score: 76, description: 'Naval strike group transit and airspace ADIZ probes.', indicator: 'HIGH SORTIE FREQUENCY' },
  { id: 'sec-2', name: 'EASTERN EUROPEAN THEATER', level: 'CRITICAL', score: 92, description: 'GPS spoofing, kinetic engagement, and drone interception alarms.', indicator: 'ELECTRONIC JAMMING ACTIVE' },
  { id: 'sec-3', name: 'MIDDLE EAST & MARITIME GATEWAY', level: 'CRITICAL', score: 88, description: 'Red Sea & Gulf of Aden commercial escort and ASBM deterrence.', indicator: 'AIR DEFENSE INTERCEPTS' },
  { id: 'sec-4', name: 'GLOBAL CYBER INFRASTRUCTURE', level: 'ELEVATED', score: 82, description: 'Industrial SCADA and BGP route hijacking attempts observed.', indicator: 'ZERO-DAY DISCLOSURE' },
  { id: 'sec-5', name: 'SPACE & SATELLITE ASSETS', level: 'NOMINAL', score: 35, description: 'LEO constellation passes and ground station telemetry nominal.', indicator: 'ORBITAL EPHEMERIS NORMAL' },
];

export const ThreatMatrixWidget: React.FC<{ instance: WidgetInstance; index: number }> = ({ instance, index }) => {
  const { theme, accent, defcon, setDefcon } = useDashboard();
  const t = getThemeClasses(theme, accent);

  const [activeTab, setActiveTab] = useState<string>(instance.activeTab || 'POSTURE_STATUS');
  const [sectors, setSectors] = useState<ThreatSector[]>(INITIAL_SECTORS);

  const defconColors: Record<DefconLevel, { bg: string; text: string; border: string; label: string }> = {
    1: { bg: 'bg-rose-950/90', text: 'text-rose-400', border: 'border-rose-500', label: 'DEFCON 1: MAXIMUM FORCE READINESS (NUCLEAR / IMMINENT)' },
    2: { bg: 'bg-orange-950/90', text: 'text-orange-400', border: 'border-orange-500', label: 'DEFCON 2: ARMED FORCES READY TO DEPLOY IN 6 HOURS' },
    3: { bg: 'bg-yellow-950/90', text: 'text-yellow-400', border: 'border-yellow-500', label: 'DEFCON 3: AIR FORCE READY TO MOBILIZE IN 15 MINUTES' },
    4: { bg: 'bg-emerald-950/90', text: 'text-emerald-400', border: 'border-emerald-500', label: 'DEFCON 4: INCREASED INTELLIGENCE WATCH & ENHANCED SECURITY' },
    5: { bg: 'bg-cyan-950/90', text: 'text-cyan-400', border: 'border-cyan-500', label: 'DEFCON 5: NORMAL PEACETIME MILITARY READINESS POSTURE' },
  };

  const handleDefconChange = (level: DefconLevel) => {
    setDefcon(level);
  };

  const handleEscalateSector = (secId: string) => {
    soundFx.playAlert();
    setSectors((prev) =>
      prev.map((s) =>
        s.id === secId
          ? {
              ...s,
              level: 'CRITICAL',
              score: Math.min(99, s.score + 10),
            }
          : s
      )
    );
    const sec = sectors.find((s) => s.id === secId);
    eventBus.publish('SECTOR_ALERT_ESCALATED', {
      severity: 'critical',
      title: `Sector ${sec?.name} Alert Escalated to CRITICAL`,
      sourceWidgetId: instance.instanceId,
      payload: { sector: sec },
    });
  };

  return (
    <WidgetFrame instance={instance} activeTab={activeTab} onTabChange={setActiveTab} index={index}>
      <div className="flex-1 flex flex-col min-h-0 p-3 space-y-3 font-mono text-xs overflow-y-auto">
        {/* DEFCON SELECTOR BAR */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[10px] text-zinc-400">
            <span className="font-bold flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400" /> CENTRAL DEFENSE READINESS CONDITION (DEFCON)
            </span>
            <span className="text-zinc-500">CLICK TO ENGAGE POSTURE</span>
          </div>

          <div className="grid grid-cols-5 gap-1.5">
            {([5, 4, 3, 2, 1] as DefconLevel[]).map((lvl) => {
              const isSelected = defcon === lvl;
              const col = defconColors[lvl];
              return (
                <button
                  key={lvl}
                  id={`btn-defcon-${lvl}`}
                  onClick={() => handleDefconChange(lvl)}
                  className={`py-2 px-1 text-center border rounded-xs transition-all cursor-pointer ${
                    isSelected
                      ? `${col.bg} ${col.text} ${col.border} ring-2 ring-current font-bold scale-[1.02]`
                      : theme === 'dark'
                      ? 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
                      : 'bg-slate-100 border-slate-300 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <span className="text-sm font-black block">DEFCON {lvl}</span>
                  <span className="text-[8px] opacity-70 block truncate">
                    {lvl === 1 ? 'MAX CRITICAL' : lvl === 2 ? 'MOBILIZE' : lvl === 3 ? 'ELEVATED' : lvl === 4 ? 'WATCH' : 'PEACETIME'}
                  </span>
                </button>
              );
            })}
          </div>

          <div className={`p-2 border rounded-xs text-[10px] ${defconColors[defcon].bg} ${defconColors[defcon].border} ${defconColors[defcon].text}`}>
            <span className="font-bold">{defconColors[defcon].label}</span>
          </div>
        </div>

        {/* SECTOR THREAT BREAKDOWN */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[10px] text-zinc-400">
            <span className="font-bold">STRATEGIC THEATER POSTURES</span>
            <span className="text-zinc-500">SCORE / 100</span>
          </div>

          <div className="space-y-1.5">
            {sectors.map((sec) => {
              const isCritical = sec.level === 'CRITICAL';
              const isElevated = sec.level === 'ELEVATED';

              return (
                <div
                  key={sec.id}
                  className={`p-2 border rounded-xs transition-colors flex flex-col gap-1 ${
                    theme === 'dark' ? 'bg-zinc-950/60 border-zinc-800' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          isCritical ? 'bg-rose-500 animate-ping' : isElevated ? 'bg-amber-400' : 'bg-emerald-400'
                        }`}
                      />
                      <span className="font-semibold text-zinc-200 text-[11px]">{sec.name}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[9px] px-1.5 py-0.2 border rounded-xs font-bold ${
                          isCritical
                            ? 'bg-rose-950 text-rose-300 border-rose-500'
                            : isElevated
                            ? 'bg-amber-950 text-amber-300 border-amber-500'
                            : 'bg-emerald-950 text-emerald-300 border-emerald-500'
                        }`}
                      >
                        {sec.level}
                      </span>
                      <span className="text-zinc-400 font-bold text-xs">{sec.score}</span>
                    </div>
                  </div>

                  <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${
                        isCritical ? 'bg-rose-500' : isElevated ? 'bg-amber-400' : 'bg-emerald-400'
                      }`}
                      style={{ width: `${sec.score}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[9px] text-zinc-500">
                    <span>{sec.description}</span>
                    <button
                      onClick={() => handleEscalateSector(sec.id)}
                      className="text-cyan-400 hover:underline cursor-pointer"
                    >
                      ESCALATE
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </WidgetFrame>
  );
};
