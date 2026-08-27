import React, { useState, useEffect } from 'react';
import { WidgetInstance } from '../../types/widget';
import { WidgetFrame } from './WidgetFrame';
import { useDashboard } from '../../context/DashboardContext';
import { getThemeClasses } from '../../utils/themeStyles';
import { Cpu, HardDrive, Wifi, Server, Activity, Database } from 'lucide-react';

export const SystemTelemetryWidget: React.FC<{ instance: WidgetInstance; index: number }> = ({ instance, index }) => {
  const { theme, accent, recentEvents } = useDashboard();
  const t = getThemeClasses(theme, accent);
  const [activeTab, setActiveTab] = useState<string>(instance.activeTab || 'EVENT_METRICS');

  const [ping, setPing] = useState<number>(24);
  const [cpuUsage, setCpuUsage] = useState<number>(34);
  const [memoryMb, setMemoryMb] = useState<number>(52.4);

  useEffect(() => {
    const timer = setInterval(() => {
      setPing(20 + Math.floor(Math.random() * 12));
      setCpuUsage(28 + Math.floor(Math.random() * 18));
      setMemoryMb(+(50 + Math.random() * 6).toFixed(1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <WidgetFrame instance={instance} activeTab={activeTab} onTabChange={setActiveTab} index={index}>
      <div className="flex-1 flex flex-col min-h-0 p-3 space-y-3 font-mono text-xs overflow-y-auto">
        <div className="grid grid-cols-3 gap-2 text-[10px]">
          <div className="p-2 border border-zinc-800 bg-black/40 rounded-xs">
            <span className="text-zinc-500 block flex items-center gap-1">
              <Cpu className="w-3 h-3 text-cyan-400" /> CPU LOAD
            </span>
            <span className="text-sm font-bold text-zinc-100 mt-1 block">{cpuUsage}%</span>
          </div>
          <div className="p-2 border border-zinc-800 bg-black/40 rounded-xs">
            <span className="text-zinc-500 block flex items-center gap-1">
              <HardDrive className="w-3 h-3 text-emerald-400" /> RAM BUFFER
            </span>
            <span className="text-sm font-bold text-zinc-100 mt-1 block">{memoryMb} MB</span>
          </div>
          <div className="p-2 border border-zinc-800 bg-black/40 rounded-xs">
            <span className="text-zinc-500 block flex items-center gap-1">
              <Wifi className="w-3 h-3 text-amber-400" /> EDGE PING
            </span>
            <span className="text-sm font-bold text-zinc-100 mt-1 block">{ping} ms</span>
          </div>
        </div>

        {/* Event Bus Log Stream */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[10px] text-zinc-400">
            <span className="font-bold flex items-center gap-1">
              <Activity className="w-3 h-3 text-cyan-400" /> DECOUPLED EVENT BUS LOGS
            </span>
            <span className="text-zinc-500">{recentEvents.length} TOTAL</span>
          </div>

          <div className="h-32 bg-black border border-zinc-800 rounded-xs p-2 overflow-y-auto text-[10px] space-y-1">
            {recentEvents.slice(0, 10).map((evt) => (
              <div key={evt.id} className="flex items-center justify-between text-zinc-300 hover:text-cyan-300">
                <span className="text-cyan-400 truncate max-w-[120px]">[{evt.channel}]</span>
                <span className="truncate flex-1 mx-2">{evt.title}</span>
                <span className="text-zinc-500 text-[8px]">{new Date(evt.timestamp).toLocaleTimeString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </WidgetFrame>
  );
};
