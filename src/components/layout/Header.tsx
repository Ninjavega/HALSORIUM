import React, { useState, useEffect } from 'react';
import { useDashboard } from '../../context/DashboardContext';
import { getThemeClasses } from '../../utils/themeStyles';
import { LAYOUT_PRESETS } from '../../services/widgetRegistry';
import { soundFx } from '../../services/soundFx';
import { AccentColor } from '../../types/widget';
import { 
  Sun, 
  Moon, 
  Volume2, 
  VolumeX, 
  Plus, 
  SlidersHorizontal, 
  Code, 
  RotateCcw, 
  ShieldAlert, 
  Radio, 
  Terminal, 
  Grid, 
  Tv,
  Layers,
  ChevronDown,
  Activity,
  Cpu
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    theme,
    toggleTheme,
    accent,
    setAccent,
    defcon,
    setDefcon,
    scanlines,
    setScanlines,
    gridOverlay,
    setGridOverlay,
    soundEnabled,
    setSoundEnabled,
    activePresetId,
    loadPreset,
    setIsCatalogOpen,
    setIsExtensibilityOpen,
    resetAllWidgets,
    widgets,
  } = useDashboard();

  const t = getThemeClasses(theme, accent);

  const [utcTime, setUtcTime] = useState<string>('');
  const [localTime, setLocalTime] = useState<string>('');
  const [showPresetsMenu, setShowPresetsMenu] = useState<boolean>(false);
  const [showAccentMenu, setShowAccentMenu] = useState<boolean>(false);

  useEffect(() => {
    const updateClocks = () => {
      const now = new Date();
      setUtcTime(
        now.toISOString().replace('T', ' ').substring(11, 19) + ' Z'
      );
      setLocalTime(
        now.toLocaleTimeString('en-US', { hour12: false }) + ' LOC'
      );
    };
    updateClocks();
    const interval = setInterval(updateClocks, 1000);
    return () => clearInterval(interval);
  }, []);

  const accents: { id: AccentColor; name: string; colorClass: string }[] = [
    { id: 'cyan', name: 'NEON CYAN', colorClass: 'bg-cyan-500' },
    { id: 'emerald', name: 'TACTICAL EMERALD', colorClass: 'bg-emerald-500' },
    { id: 'amber', name: 'CYBER AMBER', colorClass: 'bg-amber-500' },
    { id: 'crimson', name: 'CRIMSON ALERT', colorClass: 'bg-rose-500' },
    { id: 'violet', name: 'VOID VIOLET', colorClass: 'bg-purple-500' },
  ];

  return (
    <header
      id="tactical-hud-header"
      className={`sticky top-0 z-40 border-b px-3 sm:px-4 py-2 select-none backdrop-blur-md ${t.bgPanelHeader} ${t.borderMain}`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2 max-w-[1920px] mx-auto">
        {/* LEFT SECTION: BRANDING & MILITARY CLOCK */}
        <div className="flex items-center gap-3">
          {/* Logo / Reticle Badge */}
          <div className="flex items-center gap-2">
            <div className={`p-1.5 rounded-xs border ${t.accentBorder} ${t.accentBg} ${t.accentText}`}>
              <ShieldAlert className="w-5 h-5 animate-pulse" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className={`font-mono text-sm sm:text-base font-black tracking-widest ${t.textPrimary}`}>
                  META MONITOR
                </span>
                <span className={`text-[10px] font-mono px-1.5 py-0.2 border rounded-xs font-bold ${t.badgeBg}`}>
                  PROTOTYPE DEV
                </span>
              </div>
              <span className={`text-[10px] font-mono tracking-wider hidden sm:block ${t.textMuted}`}>
                SITUATION DASH // EXTENSIBLE PWA
              </span>
            </div>
          </div>

          {/* DUAL MILITARY CLOCKS */}
          <div
            className={`hidden lg:flex items-center gap-3 px-3 py-1 border rounded-xs font-mono text-xs ${
              theme === 'dark' ? 'bg-black/60 border-zinc-800 text-zinc-300' : 'bg-slate-100 border-slate-300 text-slate-700'
            }`}
          >
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
              <span className="text-zinc-500 font-bold text-[10px]">UTC</span>
              <span className="font-bold text-cyan-400">{utcTime || '00:00:00 Z'}</span>
            </div>
            <span className="text-zinc-600">|</span>
            <div className="flex items-center gap-1.5">
              <span className="text-zinc-500 font-bold text-[10px]">LOC</span>
              <span className="font-semibold">{localTime || '00:00:00 LOC'}</span>
            </div>
          </div>
        </div>

        {/* CENTER SECTION: LAYOUT PRESET SELECTOR & QUICK ADD WIDGET */}
        <div className="flex items-center gap-2">
          {/* Preset Selector Dropdown */}
          <div className="relative">
            <button
              id="btn-layout-presets"
              onClick={() => {
                soundFx.playClick(900);
                setShowPresetsMenu(!showPresetsMenu);
                setShowAccentMenu(false);
              }}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-mono border rounded-xs transition-colors cursor-pointer ${
                theme === 'dark'
                  ? 'bg-zinc-900 border-zinc-800 text-zinc-200 hover:border-cyan-500'
                  : 'bg-white border-slate-300 text-slate-800 hover:border-cyan-600'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              <span className="font-semibold hidden sm:inline">
                {LAYOUT_PRESETS.find((p) => p.id === activePresetId)?.name || 'LAYOUT'}
              </span>
              <span className="sm:hidden font-semibold">PRESETS</span>
              <ChevronDown className="w-3 h-3 text-zinc-500" />
            </button>

            {showPresetsMenu && (
              <div
                className={`absolute left-0 mt-1 w-64 p-1.5 border rounded-xs shadow-xl z-50 font-mono text-xs ${
                  theme === 'dark' ? 'bg-zinc-950 border-zinc-800 text-zinc-200' : 'bg-white border-slate-300 text-slate-800'
                }`}
              >
                <div className="px-2 py-1 text-[10px] text-zinc-500 font-bold border-b border-zinc-800/80 mb-1">
                  TACTICAL LAYOUT PRESETS
                </div>
                {LAYOUT_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => {
                      loadPreset(preset.id);
                      setShowPresetsMenu(false);
                    }}
                    className={`w-full text-left px-2 py-1.5 rounded-xs transition-colors flex items-center justify-between cursor-pointer ${
                      activePresetId === preset.id
                        ? `${t.accentBg} ${t.accentText} font-bold`
                        : theme === 'dark'
                        ? 'hover:bg-zinc-900 text-zinc-300'
                        : 'hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <div>
                      <span className="block font-semibold">{preset.name}</span>
                      <span className="text-[10px] text-zinc-500 block truncate max-w-[180px]">{preset.description}</span>
                    </div>
                    <span className="text-[9px] px-1 py-0.5 border rounded-xs">{preset.badge}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ADD WIDGET BUTTON */}
          <button
            id="btn-add-widget-catalog"
            onClick={() => {
              soundFx.playClick(1200);
              setIsCatalogOpen(true);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-bold border rounded-xs transition-all cursor-pointer ${t.accentBg} ${t.accentText} ${t.accentBorder} hover:scale-105`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>ADD WIDGET</span>
            <span className="text-[10px] opacity-70 hidden md:inline">({widgets.length})</span>
          </button>
        </div>

        {/* RIGHT SECTION: HUD CONTROLS & THEME TOGGLES */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Extensibility & Coupler Roadmap Inspector */}
          <button
            id="btn-extensibility-inspector"
            onClick={() => {
              soundFx.playClick(1000);
              setIsExtensibilityOpen(true);
            }}
            title="Extensibility & Decoupled Event Bus Inspector"
            className={`p-1.5 border rounded-xs transition-colors cursor-pointer ${
              theme === 'dark'
                ? 'bg-zinc-900 border-zinc-800 text-cyan-400 hover:border-cyan-400 hover:bg-zinc-800'
                : 'bg-white border-slate-300 text-cyan-700 hover:border-cyan-600 hover:bg-slate-100'
            }`}
          >
            <Code className="w-4 h-4" />
          </button>

          {/* Scanlines Toggle */}
          <button
            id="btn-toggle-scanlines"
            onClick={() => setScanlines(!scanlines)}
            title={scanlines ? 'Disable CRT Scanlines' : 'Enable CRT Scanlines'}
            className={`p-1.5 border rounded-xs transition-colors cursor-pointer hidden md:flex ${
              scanlines
                ? 'bg-cyan-950 text-cyan-300 border-cyan-500/50'
                : 'text-zinc-500 border-zinc-800 bg-zinc-900/40'
            }`}
          >
            <Tv className="w-4 h-4" />
          </button>

          {/* Grid Overlay Toggle */}
          <button
            id="btn-toggle-grid"
            onClick={() => setGridOverlay(!gridOverlay)}
            title={gridOverlay ? 'Disable HUD Grid Overlay' : 'Enable HUD Grid Overlay'}
            className={`p-1.5 border rounded-xs transition-colors cursor-pointer hidden md:flex ${
              gridOverlay
                ? 'bg-cyan-950 text-cyan-300 border-cyan-500/50'
                : 'text-zinc-500 border-zinc-800 bg-zinc-900/40'
            }`}
          >
            <Grid className="w-4 h-4" />
          </button>

          {/* Cyber Accent Selector */}
          <div className="relative">
            <button
              id="btn-accent-selector"
              onClick={() => {
                soundFx.playClick(900);
                setShowAccentMenu(!showAccentMenu);
                setShowPresetsMenu(false);
              }}
              title="Cyber Neon Accent Palette"
              className={`p-1.5 border rounded-xs transition-colors flex items-center gap-1 cursor-pointer ${
                theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-300'
              }`}
            >
              <span
                className={`w-3.5 h-3.5 rounded-full ${
                  accent === 'cyan'
                    ? 'bg-cyan-400'
                    : accent === 'emerald'
                    ? 'bg-emerald-400'
                    : accent === 'amber'
                    ? 'bg-amber-400'
                    : accent === 'crimson'
                    ? 'bg-rose-400'
                    : 'bg-purple-400'
                }`}
              />
            </button>

            {showAccentMenu && (
              <div
                className={`absolute right-0 mt-1 w-44 p-1.5 border rounded-xs shadow-xl z-50 font-mono text-xs ${
                  theme === 'dark' ? 'bg-zinc-950 border-zinc-800 text-zinc-200' : 'bg-white border-slate-300 text-slate-800'
                }`}
              >
                <div className="px-2 py-1 text-[10px] text-zinc-500 font-bold border-b border-zinc-800 mb-1">
                  CYBER ACCENT PALETTE
                </div>
                {accents.map((acc) => (
                  <button
                    key={acc.id}
                    onClick={() => {
                      setAccent(acc.id);
                      setShowAccentMenu(false);
                    }}
                    className={`w-full text-left px-2 py-1.5 rounded-xs flex items-center gap-2 transition-colors cursor-pointer ${
                      accent === acc.id
                        ? 'bg-zinc-800 text-white font-bold'
                        : 'hover:bg-zinc-900 text-zinc-400'
                    }`}
                  >
                    <span className={`w-3 h-3 rounded-full ${acc.colorClass}`} />
                    <span>{acc.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Sound FX Audio Toggle */}
          <button
            id="btn-toggle-sound"
            onClick={() => setSoundEnabled(!soundEnabled)}
            title={soundEnabled ? 'Mute HUD Audio Feedback' : 'Enable HUD Audio Feedback'}
            className={`p-1.5 border rounded-xs transition-colors cursor-pointer ${
              soundEnabled
                ? 'bg-emerald-950 text-emerald-400 border-emerald-500/50'
                : 'text-zinc-500 border-zinc-800 bg-zinc-900/40'
            }`}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Lite / Dark Theme Toggle */}
          <button
            id="btn-toggle-theme"
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Switch to Lite HUD Mode' : 'Switch to Dark Cyber Mode'}
            className={`p-1.5 border rounded-xs transition-colors cursor-pointer ${
              theme === 'dark'
                ? 'bg-zinc-900 border-zinc-800 text-amber-400 hover:text-amber-300'
                : 'bg-white border-slate-300 text-cyan-700 hover:text-cyan-900'
            }`}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Reset Layout */}
          <button
            id="btn-reset-layout"
            onClick={resetAllWidgets}
            title="Reset Dashboard to Default Layout"
            className="p-1.5 border border-zinc-800 text-zinc-500 hover:text-rose-400 hover:bg-rose-950/30 rounded-xs transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
