import { ThemeMode, AccentColor } from '../types/widget';

export interface ThemeClasses {
  bgMain: string;
  bgPanel: string;
  bgPanelHeader: string;
  bgPanelFooter: string;
  bgInput: string;
  borderMain: string;
  borderSubtle: string;
  borderHighlight: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  accentText: string;
  accentBg: string;
  accentBorder: string;
  accentGlow: string;
  badgeBg: string;
  gridClass: string;
}

export function getThemeClasses(theme: ThemeMode, accent: AccentColor): ThemeClasses {
  const isDark = theme === 'dark';

  // Accent color mappings
  const accentMaps: Record<
    AccentColor,
    { text: string; bg: string; border: string; glow: string; badge: string }
  > = {
    cyan: {
      text: isDark ? 'text-cyan-400' : 'text-cyan-600',
      bg: isDark ? 'bg-cyan-500/10' : 'bg-cyan-100',
      border: isDark ? 'border-cyan-500/40' : 'border-cyan-500/60',
      glow: isDark ? 'shadow-[0_0_15px_rgba(6,182,212,0.25)]' : 'shadow-[0_0_10px_rgba(6,182,212,0.15)]',
      badge: isDark ? 'bg-cyan-950/80 text-cyan-300 border-cyan-500/40' : 'bg-cyan-50 text-cyan-800 border-cyan-300',
    },
    emerald: {
      text: isDark ? 'text-emerald-400' : 'text-emerald-700',
      bg: isDark ? 'bg-emerald-500/10' : 'bg-emerald-100',
      border: isDark ? 'border-emerald-500/40' : 'border-emerald-500/60',
      glow: isDark ? 'shadow-[0_0_15px_rgba(16,185,129,0.25)]' : 'shadow-[0_0_10px_rgba(16,185,129,0.15)]',
      badge: isDark ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40' : 'bg-emerald-50 text-emerald-800 border-emerald-300',
    },
    amber: {
      text: isDark ? 'text-amber-400' : 'text-amber-700',
      bg: isDark ? 'bg-amber-500/10' : 'bg-amber-100',
      border: isDark ? 'border-amber-500/40' : 'border-amber-500/60',
      glow: isDark ? 'shadow-[0_0_15px_rgba(245,158,11,0.25)]' : 'shadow-[0_0_10px_rgba(245,158,11,0.15)]',
      badge: isDark ? 'bg-amber-950/80 text-amber-300 border-amber-500/40' : 'bg-amber-50 text-amber-800 border-amber-300',
    },
    crimson: {
      text: isDark ? 'text-rose-400' : 'text-rose-700',
      bg: isDark ? 'bg-rose-500/10' : 'bg-rose-100',
      border: isDark ? 'border-rose-500/40' : 'border-rose-500/60',
      glow: isDark ? 'shadow-[0_0_15px_rgba(244,63,94,0.25)]' : 'shadow-[0_0_10px_rgba(244,63,94,0.15)]',
      badge: isDark ? 'bg-rose-950/80 text-rose-300 border-rose-500/40' : 'bg-rose-50 text-rose-800 border-rose-300',
    },
    violet: {
      text: isDark ? 'text-purple-400' : 'text-purple-700',
      bg: isDark ? 'bg-purple-500/10' : 'bg-purple-100',
      border: isDark ? 'border-purple-500/40' : 'border-purple-500/60',
      glow: isDark ? 'shadow-[0_0_15px_rgba(168,85,247,0.25)]' : 'shadow-[0_0_10px_rgba(168,85,247,0.15)]',
      badge: isDark ? 'bg-purple-950/80 text-purple-300 border-purple-500/40' : 'bg-purple-50 text-purple-800 border-purple-300',
    },
  };

  const selectedAccent = accentMaps[accent];

  if (isDark) {
    return {
      bgMain: 'bg-zinc-950',
      bgPanel: 'bg-zinc-900/90 backdrop-blur-md',
      bgPanelHeader: 'bg-zinc-950/90 border-b border-zinc-800/80',
      bgPanelFooter: 'bg-zinc-950/80 border-t border-zinc-800/60',
      bgInput: 'bg-zinc-950 border border-zinc-800 text-zinc-200 focus:border-cyan-500',
      borderMain: 'border-zinc-800/80',
      borderSubtle: 'border-zinc-800/50',
      borderHighlight: selectedAccent.border,
      textPrimary: 'text-zinc-100',
      textSecondary: 'text-zinc-400',
      textMuted: 'text-zinc-500',
      accentText: selectedAccent.text,
      accentBg: selectedAccent.bg,
      accentBorder: selectedAccent.border,
      accentGlow: selectedAccent.glow,
      badgeBg: selectedAccent.badge,
      gridClass: 'hud-grid-dark',
    };
  }

  // Lite Mode
  return {
    bgMain: 'bg-slate-100',
    bgPanel: 'bg-white/95 backdrop-blur-md shadow-sm',
    bgPanelHeader: 'bg-slate-50/95 border-b border-slate-200',
    bgPanelFooter: 'bg-slate-50/90 border-t border-slate-200',
    bgInput: 'bg-white border border-slate-300 text-slate-900 focus:border-cyan-600',
    borderMain: 'border-slate-300',
    borderSubtle: 'border-slate-200',
    borderHighlight: selectedAccent.border,
    textPrimary: 'text-slate-900',
    textSecondary: 'text-slate-600',
    textMuted: 'text-slate-400',
    accentText: selectedAccent.text,
    accentBg: selectedAccent.bg,
    accentBorder: selectedAccent.border,
    accentGlow: selectedAccent.glow,
    badgeBg: selectedAccent.badge,
    gridClass: 'hud-grid-light',
  };
}
