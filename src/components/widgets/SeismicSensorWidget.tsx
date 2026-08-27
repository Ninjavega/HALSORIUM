import React, { useState, useEffect } from 'react';
import { WidgetInstance } from '../../types/widget';
import { WidgetFrame } from './WidgetFrame';
import { useDashboard } from '../../context/DashboardContext';
import { getThemeClasses } from '../../utils/themeStyles';
import { eventBus } from '../../services/eventBus';
import { soundFx } from '../../services/soundFx';
import { Activity, AlertTriangle, Radio, Waves, MapPin } from 'lucide-react';

export const SeismicSensorWidget: React.FC<{ instance: WidgetInstance; index: number }> = ({ instance, index }) => {
  const { theme, accent } = useDashboard();
  const t = getThemeClasses(theme, accent);

  const [activeTab, setActiveTab] = useState<string>(instance.activeTab || 'SEISMOGRAM');
  const [wavePoints, setWavePoints] = useState<number[]>(Array.from({ length: 60 }, () => 50));
  const [currentMagnitude, setCurrentMagnitude] = useState<number>(3.2);

  // Live seismogram wave simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setWavePoints((prev) => {
        const noise = (Math.random() - 0.5) * (currentMagnitude > 5 ? 40 : 12);
        const nextVal = Math.max(10, Math.min(90, 50 + noise));
        return [...prev.slice(1), nextVal];
      });
    }, 100);
    return () => clearInterval(interval);
  }, [currentMagnitude]);

  const handleSimulateQuake = () => {
    setCurrentMagnitude(6.8);
    soundFx.playAlert();
    eventBus.publish('SEISMIC_ALERT_TRIGGERED', {
      severity: 'critical',
      title: 'M6.8 Major Earthquake Detected (Japan Trench)',
      sourceWidgetId: instance.instanceId,
      payload: { magnitude: 6.8, depthKm: 24, tsunamiWarning: false },
    });

    setTimeout(() => {
      setCurrentMagnitude(3.4);
    }, 6000);
  };

  const svgPath = wavePoints
    .map((val, idx) => {
      const x = (idx / (wavePoints.length - 1)) * 300;
      const y = val;
      return `${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
    })
    .join(' ');

  return (
    <WidgetFrame instance={instance} activeTab={activeTab} onTabChange={setActiveTab} index={index}>
      <div className="flex-1 flex flex-col min-h-0 p-3 space-y-3 font-mono text-xs overflow-y-auto">
        {/* Sub-header metric */}
        <div className={`p-2 border rounded-xs flex items-center justify-between ${theme === 'dark' ? 'bg-zinc-950 border-zinc-800' : 'bg-slate-50 border-slate-200'}`}>
          <div className="flex items-center gap-2">
            <Activity className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <div>
              <span className="font-bold text-zinc-200">USGS GLOBAL SEISMIC NETWORK</span>
              <span className="text-[10px] text-zinc-500 block">REAL-TIME BROADBAND ACCELEROMETERS</span>
            </div>
          </div>
          <button
            onClick={handleSimulateQuake}
            className="px-2 py-0.5 text-[10px] font-bold border rounded-xs bg-rose-950/60 text-rose-300 border-rose-500/50 hover:bg-rose-900 cursor-pointer"
          >
            SIMULATE M6.8
          </button>
        </div>

        {/* TAB 1: LIVE SEISMOGRAM WAVE */}
        {activeTab === 'SEISMOGRAM' && (
          <div className="space-y-2">
            <div className="h-32 bg-black border border-zinc-800 rounded-xs relative overflow-hidden flex items-center justify-center">
              {/* Grid backdrop */}
              <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:12px_12px] opacity-40 pointer-events-none" />

              <svg viewBox="0 0 300 100" className="w-full h-full preserve-3d">
                <line x1="0" y1="50" x2="300" y2="50" stroke="#334155" strokeWidth="0.5" strokeDasharray="2 2" />
                <path d={svgPath} fill="none" stroke={currentMagnitude > 5 ? '#f43f5e' : '#06b6d4'} strokeWidth="1.5" />
              </svg>

              <div className="absolute top-1 left-2 text-[9px] text-zinc-400 bg-black/70 px-1 border border-zinc-800">
                CHANNEL: BHZ (VERTICAL)
              </div>
              <div className="absolute bottom-1 right-2 text-[9px] text-cyan-400 font-bold bg-black/70 px-1 border border-zinc-800">
                AMP: {currentMagnitude > 5 ? 'ELEVATED (P-WAVE)' : 'NOMINAL BASELINE'}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[10px]">
              <div className="p-2 border border-zinc-800 bg-black/30 rounded-xs">
                <span className="text-zinc-400 block">LATEST SIGNIFICANT EVENT</span>
                <span className="text-rose-400 font-bold text-xs">M6.4 HONSHU, JAPAN</span>
                <span className="text-zinc-500 block">Depth: 32.4 km • 18m ago</span>
              </div>
              <div className="p-2 border border-zinc-800 bg-black/30 rounded-xs">
                <span className="text-zinc-400 block">TSUNAMI ADVISORY</span>
                <span className="text-emerald-400 font-bold text-xs">NO THREAT POSTED</span>
                <span className="text-zinc-500 block">Pacific Warning Center (PTWC)</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: RECENT QUAKES LIST */}
        {activeTab === 'RECENT_QUAKES' && (
          <div className="space-y-1.5 text-[11px]">
            <div className="p-2 border border-zinc-800 bg-black/40 rounded-xs flex justify-between items-center">
              <div>
                <span className="font-bold text-rose-400">M6.4 - Off East Coast of Honshu</span>
                <span className="text-[10px] text-zinc-500 block">Depth: 32km • 22m ago</span>
              </div>
              <span className="px-1.5 py-0.5 bg-rose-950 text-rose-300 border border-rose-500 text-[10px] font-bold rounded-xs">
                M6.4
              </span>
            </div>
            <div className="p-2 border border-zinc-800 bg-black/40 rounded-xs flex justify-between items-center">
              <div>
                <span className="font-bold text-amber-400">M5.1 - Hindu Kush Region, Afghanistan</span>
                <span className="text-[10px] text-zinc-500 block">Depth: 180km • 1h ago</span>
              </div>
              <span className="px-1.5 py-0.5 bg-amber-950 text-amber-300 border border-amber-500 text-[10px] font-bold rounded-xs">
                M5.1
              </span>
            </div>
            <div className="p-2 border border-zinc-800 bg-black/40 rounded-xs flex justify-between items-center">
              <div>
                <span className="font-bold text-cyan-400">M4.7 - Reykjanes Ridge, Iceland</span>
                <span className="text-[10px] text-zinc-500 block">Depth: 10km • 2h ago</span>
              </div>
              <span className="px-1.5 py-0.5 bg-cyan-950 text-cyan-300 border border-cyan-500 text-[10px] font-bold rounded-xs">
                M4.7
              </span>
            </div>
          </div>
        )}
      </div>
    </WidgetFrame>
  );
};
