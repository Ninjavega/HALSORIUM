import React, { useState, useEffect } from 'react';
import { WidgetInstance } from '../../types/widget';
import { WidgetFrame } from './WidgetFrame';
import { useDashboard } from '../../context/DashboardContext';
import { getThemeClasses } from '../../utils/themeStyles';
import { eventBus } from '../../services/eventBus';
import { soundFx } from '../../services/soundFx';
import { Orbit, Compass, Radio, Satellite, RefreshCw } from 'lucide-react';

export const SatCommTrackerWidget: React.FC<{ instance: WidgetInstance; index: number }> = ({ instance, index }) => {
  const { theme, accent } = useDashboard();
  const t = getThemeClasses(theme, accent);

  const [activeTab, setActiveTab] = useState<string>(instance.activeTab || 'RADAR_SCOPE');
  const [azimuth, setAzimuth] = useState<number>(142.4);
  const [elevation, setElevation] = useState<number>(68.2);

  useEffect(() => {
    const timer = setInterval(() => {
      setAzimuth((prev) => +(prev + 0.2 > 360 ? 0 : prev + 0.2).toFixed(1));
      setElevation((prev) => +(prev + 0.1 > 90 ? 10 : prev + 0.1).toFixed(1));
    }, 500);
    return () => clearInterval(timer);
  }, []);

  return (
    <WidgetFrame instance={instance} activeTab={activeTab} onTabChange={setActiveTab} index={index}>
      <div className="flex-1 flex flex-col min-h-0 p-3 space-y-3 font-mono text-xs overflow-y-auto">
        <div className={`p-2 border rounded-xs flex items-center justify-between ${theme === 'dark' ? 'bg-zinc-950 border-zinc-800' : 'bg-slate-50 border-slate-200'}`}>
          <div className="flex items-center gap-2">
            <Orbit className="w-3.5 h-3.5 text-cyan-400 animate-spin" style={{ animationDuration: '8s' }} />
            <div>
              <span className="font-bold text-zinc-200">NORAD SPACE SURVEILLANCE</span>
              <span className="text-[10px] text-zinc-500 block">TLE ORBITAL PROPAGATION</span>
            </div>
          </div>
          <span className="px-1.5 py-0.5 border border-emerald-500/40 text-emerald-400 bg-emerald-950/40 text-[9px] rounded-xs font-bold">
            3,840 OBJECTS
          </span>
        </div>

        {activeTab === 'RADAR_SCOPE' && (
          <div className="space-y-2">
            {/* Polar Scope Display */}
            <div className="h-36 bg-black border border-zinc-800 rounded-xs relative flex items-center justify-center overflow-hidden">
              {/* Concentric rings */}
              <div className="w-28 h-28 rounded-full border border-zinc-700/60 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full border border-zinc-700/60 flex items-center justify-center">
                  <div className="w-6 h-6 rounded-full border border-zinc-700/60" />
                </div>
              </div>
              <div className="absolute inset-x-0 top-1/2 h-px bg-zinc-700/60" />
              <div className="absolute inset-y-0 left-1/2 w-px bg-zinc-700/60" />

              {/* Sat blip */}
              <div
                className="absolute w-3 h-3 bg-cyan-400 rounded-full shadow-[0_0_8px_#38bdf8] flex items-center justify-center"
                style={{
                  transform: `rotate(${azimuth}deg) translate(38px) rotate(-${azimuth}deg)`,
                }}
              >
                <div className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
              </div>

              <div className="absolute top-1 left-2 text-[9px] text-cyan-400">SAT-USA-326 (OPTICAL)</div>
              <div className="absolute bottom-1 right-2 text-[9px] text-zinc-500">POLAR AZ/EL</div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[10px]">
              <div className="p-2 border border-zinc-800 bg-black/40 rounded-xs">
                <span className="text-zinc-500 block">CURRENT AZIMUTH</span>
                <span className="text-cyan-400 font-bold text-xs">{azimuth}° TRUE</span>
              </div>
              <div className="p-2 border border-zinc-800 bg-black/40 rounded-xs">
                <span className="text-zinc-500 block">CURRENT ELEVATION</span>
                <span className="text-emerald-400 font-bold text-xs">{elevation}° HORIZON</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'TLE_DATA' && (
          <div className="p-2 bg-black text-emerald-400 border border-zinc-800 rounded-xs text-[9px] font-mono leading-tight space-y-1">
            <div>1 25544U 98067A   26238.54128912  .00016717  00000-0  10270-3 0  9993</div>
            <div>2 25544  51.6416 247.4627 0006703 130.5360 325.0288 15.72125391562385</div>
          </div>
        )}
      </div>
    </WidgetFrame>
  );
};
