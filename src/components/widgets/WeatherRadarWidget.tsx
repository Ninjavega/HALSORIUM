import React, { useState } from 'react';
import { WidgetInstance } from '../../types/widget';
import { WidgetFrame } from './WidgetFrame';
import { useDashboard } from '../../context/DashboardContext';
import { getThemeClasses } from '../../utils/themeStyles';
import { CloudRain, Wind, Gauge, AlertTriangle } from 'lucide-react';

export const WeatherRadarWidget: React.FC<{ instance: WidgetInstance; index: number }> = ({ instance, index }) => {
  const { theme, accent } = useDashboard();
  const t = getThemeClasses(theme, accent);
  const [activeTab, setActiveTab] = useState<string>(instance.activeTab || 'CYCLONE_RADAR');

  return (
    <WidgetFrame instance={instance} activeTab={activeTab} onTabChange={setActiveTab} index={index}>
      <div className="flex-1 flex flex-col min-h-0 p-3 space-y-3 font-mono text-xs overflow-y-auto">
        <div className={`p-2.5 border rounded-xs flex items-center justify-between ${theme === 'dark' ? 'bg-zinc-950 border-zinc-800' : 'bg-slate-50 border-slate-200'}`}>
          <div className="flex items-center gap-2">
            <CloudRain className="w-4 h-4 text-cyan-400 animate-pulse" />
            <div>
              <span className="font-bold text-zinc-100 block">TYPHOON SHANSHAN (CAT-4)</span>
              <span className="text-[10px] text-zinc-400">WESTERN PACIFIC BASIN</span>
            </div>
          </div>
          <span className="px-1.5 py-0.5 bg-rose-950 text-rose-300 border border-rose-500 text-[10px] font-bold rounded-xs">
            115 KTS
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-[10px]">
          <div className="p-2 border border-zinc-800 bg-black/40 rounded-xs">
            <span className="text-zinc-500 block flex items-center gap-1">
              <Gauge className="w-3 h-3 text-cyan-400" /> CENTRAL PRESSURE
            </span>
            <span className="text-sm font-bold text-zinc-100 mt-1 block">945 hPa</span>
          </div>
          <div className="p-2 border border-zinc-800 bg-black/40 rounded-xs">
            <span className="text-zinc-500 block flex items-center gap-1">
              <Wind className="w-3 h-3 text-amber-400" /> MAX GUST VECTOR
            </span>
            <span className="text-sm font-bold text-zinc-100 mt-1 block">140 KTS</span>
          </div>
        </div>

        <div className="p-2 border border-zinc-800 bg-black/30 rounded-xs text-[10px] text-zinc-400">
          <span className="text-cyan-400 font-bold block mb-1">NOAA / JMA RADAR COUPLER READY</span>
          Precipitation radar reflectivity tiles and Doppler wind velocity layers will be coupled via TileJSON / WMS weather feeds.
        </div>
      </div>
    </WidgetFrame>
  );
};
