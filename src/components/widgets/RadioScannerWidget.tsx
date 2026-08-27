import React, { useState, useEffect } from 'react';
import { WidgetInstance } from '../../types/widget';
import { WidgetFrame } from './WidgetFrame';
import { useDashboard } from '../../context/DashboardContext';
import { getThemeClasses } from '../../utils/themeStyles';
import { eventBus } from '../../services/eventBus';
import { soundFx } from '../../services/soundFx';
import { Radio, Volume2, VolumeX, Sliders, Play, Square } from 'lucide-react';

export const RadioScannerWidget: React.FC<{ instance: WidgetInstance; index: number }> = ({ instance, index }) => {
  const { theme, accent } = useDashboard();
  const t = getThemeClasses(theme, accent);

  const [activeTab, setActiveTab] = useState<string>(instance.activeTab || 'WATERFALL');
  const [freq, setFreq] = useState<number>(121.5);
  const [waterfallRows, setWaterfallRows] = useState<number[][]>([]);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);

  // Generate real-time SDR waterfall rows
  useEffect(() => {
    const interval = setInterval(() => {
      const newRow = Array.from({ length: 32 }, () => Math.floor(Math.random() * 100));
      // simulate carrier spike near center
      newRow[15] = Math.min(100, newRow[15] + 60);
      newRow[16] = Math.min(100, newRow[16] + 80);
      newRow[17] = Math.min(100, newRow[17] + 50);

      setWaterfallRows((prev) => [newRow, ...prev.slice(0, 14)]);
    }, 150);
    return () => clearInterval(interval);
  }, []);

  const handleTune = (delta: number) => {
    soundFx.playClick(1400);
    setFreq((f) => +(f + delta).toFixed(3));
    eventBus.publish('SIGNAL_INTERCEPTED', {
      title: `SDR Tuned to ${(freq + delta).toFixed(3)} MHz`,
      sourceWidgetId: instance.instanceId,
      payload: { frequencyMhz: freq + delta, mode: 'AM_GUARD' },
    });
  };

  const toggleAudio = () => {
    setIsPlayingAudio(!isPlayingAudio);
    if (!isPlayingAudio) {
      soundFx.playBlip(1000);
    } else {
      soundFx.playClick(600);
    }
  };

  return (
    <WidgetFrame instance={instance} activeTab={activeTab} onTabChange={setActiveTab} index={index}>
      <div className="flex-1 flex flex-col min-h-0 p-3 space-y-3 font-mono text-xs overflow-y-auto">
        {/* Tuner dial bar */}
        <div className={`p-2.5 border rounded-xs flex items-center justify-between ${theme === 'dark' ? 'bg-zinc-950 border-zinc-800' : 'bg-slate-50 border-slate-200'}`}>
          <div>
            <span className="text-[10px] text-zinc-500 block">VHF/UHF EMERGENCY & TACTICAL FREQ</span>
            <span className="text-sm font-black text-cyan-400">{freq.toFixed(3)} MHz</span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => handleTune(-0.025)}
              className="px-2 py-1 border border-zinc-800 bg-black text-zinc-300 hover:text-cyan-400 rounded-xs cursor-pointer"
            >
              -25k
            </button>
            <button
              onClick={() => handleTune(0.025)}
              className="px-2 py-1 border border-zinc-800 bg-black text-zinc-300 hover:text-cyan-400 rounded-xs cursor-pointer"
            >
              +25k
            </button>
            <button
              onClick={toggleAudio}
              className={`p-1.5 border rounded-xs cursor-pointer ${
                isPlayingAudio
                  ? 'bg-emerald-950 text-emerald-400 border-emerald-500'
                  : 'bg-zinc-900 border-zinc-800 text-zinc-400'
              }`}
            >
              {isPlayingAudio ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* WATERFALL CANVAS / MATRIX */}
        <div className="h-32 bg-black border border-zinc-800 rounded-xs p-1 flex flex-col overflow-hidden relative">
          <div className="flex-1 flex flex-col justify-between">
            {waterfallRows.map((row, rIdx) => (
              <div key={rIdx} className="flex h-2 gap-0.5">
                {row.map((val, cIdx) => {
                  const color =
                    val > 80
                      ? 'bg-rose-500'
                      : val > 60
                      ? 'bg-amber-400'
                      : val > 40
                      ? 'bg-cyan-500'
                      : val > 20
                      ? 'bg-blue-800'
                      : 'bg-zinc-900';
                  return <div key={cIdx} className={`flex-1 ${color} opacity-90`} />;
                })}
              </div>
            ))}
          </div>
          <div className="absolute bottom-1 left-2 text-[9px] text-cyan-400 bg-black/80 px-1 border border-zinc-800">
            SDR WATERFALL: -110 dBm NOISE FLOOR
          </div>
        </div>
      </div>
    </WidgetFrame>
  );
};
