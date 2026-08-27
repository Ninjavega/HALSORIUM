import React from 'react';
import { WidgetDefinition } from '../../types/widget';
import { useDashboard } from '../../context/DashboardContext';
import { soundFx } from '../../services/soundFx';
import { Cable, Layers } from 'lucide-react';

interface DataCouplerBadgeProps {
  widgetDef: WidgetDefinition;
}

export const DataCouplerBadge: React.FC<DataCouplerBadgeProps> = ({ widgetDef }) => {
  const { setInspectedWidgetCoupler, setIsExtensibilityOpen, theme } = useDashboard();

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    soundFx.playClick(1100);
    setInspectedWidgetCoupler(widgetDef);
    setIsExtensibilityOpen(true);
  };

  const protocol = widgetDef.dataCoupler.targetProtocol;

  return (
    <button
      id={`coupler-badge-${widgetDef.id}`}
      onClick={handleClick}
      title={`Extensible Data Coupler: [${protocol}] - Click to inspect schema & event hooks`}
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-[10px] font-mono tracking-wider border rounded-xs transition-all cursor-pointer ${
        theme === 'dark'
          ? 'bg-zinc-950 text-cyan-400/90 border-cyan-500/30 hover:border-cyan-400 hover:bg-cyan-950/40'
          : 'bg-slate-100 text-cyan-800 border-cyan-400/50 hover:border-cyan-600 hover:bg-cyan-50'
      }`}
    >
      <Cable className="w-2.5 h-2.5 animate-pulse" />
      <span className="font-semibold">{protocol}</span>
      <span className="opacity-60 hidden sm:inline">COUPLER</span>
    </button>
  );
};
