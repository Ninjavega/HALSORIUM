import React, { useState, useEffect } from 'react';
import { useDashboard } from '../../context/DashboardContext';
import { getThemeClasses } from '../../utils/themeStyles';
import { Shield, Activity, Wifi, Database, Radio, Terminal, Cpu } from 'lucide-react';

export const StatusBar: React.FC = () => {
  const { theme, accent, defcon, widgets, recentEvents } = useDashboard();
  const t = getThemeClasses(theme, accent);

  const [cursorPos, setCursorPos] = useState<{ lat: string; lng: string }>({
    lat: '34.05° N',
    lng: '118.24° W',
  });

  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      const lat = (90 - (e.clientY / window.innerHeight) * 180).toFixed(2);
      const lng = ((e.clientX / window.innerWidth) * 360 - 180).toFixed(2);
      setCursorPos({
        lat: `${Math.abs(Number(lat))}° ${Number(lat) >= 0 ? 'N' : 'S'}`,
        lng: `${Math.abs(Number(lng))}° ${Number(lng) >= 0 ? 'E' : 'W'}`,
      });
    };
    window.addEventListener('mousemove', handleGlobalMouseMove);
    return () => window.removeEventListener('mousemove', handleGlobalMouseMove);
  }, []);

  return (
    <div
      id="tactical-hud-statusbar"
      className={`border-t px-3 py-1 text-[10px] font-mono select-none flex flex-wrap items-center justify-between gap-2 z-30 ${t.bgPanelFooter} ${t.borderMain}`}
    >
      {/* Left items */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-zinc-500">PWA STATUS:</span>
          <span className="text-emerald-400 font-bold">EVENT_DRIVEN_READY</span>
        </div>

        <span className="text-zinc-700 hidden sm:inline">|</span>

        <div className="hidden sm:flex items-center gap-1">
          <span className="text-zinc-500">DEFCON:</span>
          <span
            className={`font-bold ${
              defcon <= 2 ? 'text-rose-400' : defcon === 3 ? 'text-amber-400' : 'text-cyan-400'
            }`}
          >
            LEVEL {defcon}
          </span>
        </div>

        <span className="text-zinc-700 hidden md:inline">|</span>

        <div className="hidden md:flex items-center gap-1 text-zinc-400">
          <span>COORDS:</span>
          <span className="text-zinc-200">[{cursorPos.lat}, {cursorPos.lng}]</span>
        </div>
      </div>

      {/* Right items */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1 text-zinc-400">
          <Database className="w-3 h-3 text-cyan-400" />
          <span className="hidden sm:inline">REDIS/CACHE:</span>
          <span className="text-cyan-300">COUPLER_STUB</span>
        </div>

        <span className="text-zinc-700 hidden sm:inline">|</span>

        <div className="flex items-center gap-1 text-zinc-400">
          <Activity className="w-3 h-3 text-amber-400" />
          <span>EVENTS:</span>
          <span className="text-zinc-200 font-bold">{recentEvents.length}</span>
        </div>

        <span className="text-zinc-700">|</span>

        <div className="flex items-center gap-1 text-zinc-400">
          <span>TILES:</span>
          <span className={t.accentText}>{widgets.length} ACTIVE</span>
        </div>
      </div>
    </div>
  );
};
