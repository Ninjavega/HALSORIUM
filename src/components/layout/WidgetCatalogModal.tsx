import React, { useState } from 'react';
import { useDashboard } from '../../context/DashboardContext';
import { getThemeClasses } from '../../utils/themeStyles';
import { WIDGET_REGISTRY } from '../../services/widgetRegistry';
import { WidgetCategory, WidgetDefinition } from '../../types/widget';
import { soundFx } from '../../services/soundFx';
import { 
  X, 
  Search, 
  Plus, 
  Check, 
  Globe, 
  Radio, 
  ShieldAlert, 
  Video, 
  Terminal, 
  Activity, 
  Orbit, 
  TrendingUp, 
  Cpu, 
  FileText, 
  CloudRain,
  Cable
} from 'lucide-react';

const ICON_MAP: Record<string, any> = {
  Globe,
  Radio,
  ShieldAlert,
  Video,
  Terminal,
  Activity,
  Orbit,
  TrendingUp,
  RadioReceiver: Radio,
  Cpu,
  FileText,
  CloudRain,
};

export const WidgetCatalogModal: React.FC = () => {
  const {
    isCatalogOpen,
    setIsCatalogOpen,
    theme,
    accent,
    widgets,
    addWidget,
    setInspectedWidgetCoupler,
    setIsExtensibilityOpen,
  } = useDashboard();

  const t = getThemeClasses(theme, accent);
  const [search, setSearch] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  if (!isCatalogOpen) return null;

  const categories = [
    { id: 'ALL', label: 'ALL WIDGETS' },
    { id: 'intel', label: 'INTEL & OSINT' },
    { id: 'geospatial', label: 'GEOSPATIAL' },
    { id: 'surveillance', label: 'SURVEILLANCE' },
    { id: 'cyber', label: 'CYBER WARFARE' },
    { id: 'telemetry', label: 'TELEMETRY' },
    { id: 'finance', label: 'FINANCE & ASSETS' },
    { id: 'operations', label: 'COMMAND & OPS' },
  ];

  const filteredWidgets = WIDGET_REGISTRY.filter((w) => {
    const matchCategory = selectedCategory === 'ALL' || w.category === selectedCategory;
    const query = search.toLowerCase();
    const matchSearch =
      !query ||
      w.title.toLowerCase().includes(query) ||
      w.subtitle.toLowerCase().includes(query) ||
      w.tags.some((tag) => tag.toLowerCase().includes(query)) ||
      w.description.toLowerCase().includes(query);
    return matchCategory && matchSearch;
  });

  const handleAdd = (wDef: WidgetDefinition) => {
    addWidget(wDef.id);
    soundFx.playDock();
  };

  const handleInspect = (wDef: WidgetDefinition, e: React.MouseEvent) => {
    e.stopPropagation();
    soundFx.playClick(1000);
    setInspectedWidgetCoupler(wDef);
    setIsExtensibilityOpen(true);
  };

  return (
    <div
      id="modal-widget-catalog"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={() => setIsCatalogOpen(false)}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`w-full max-w-4xl max-h-[85vh] border rounded-xs shadow-2xl flex flex-col overflow-hidden font-mono ${t.bgPanel} ${t.borderHighlight}`}
      >
        {/* Header */}
        <div className={`flex items-center justify-between px-4 py-3 border-b ${t.bgPanelHeader}`}>
          <div className="flex items-center gap-2">
            <Plus className="w-4 h-4 text-cyan-400" />
            <div>
              <h3 className={`text-sm font-bold tracking-wider ${t.textPrimary}`}>
                TACTICAL WIDGET CATALOG // WINDOW REGISTRY
              </h3>
              <p className={`text-[10px] ${t.textMuted}`}>
                ADD DECOUPLED TILES TO YOUR HUD DASHBOARD (COUPLER COMPLIANT)
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsCatalogOpen(false)}
            className="p-1 rounded-xs text-zinc-400 hover:text-rose-400 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search & Category Filter Bar */}
        <div className="p-3 border-b border-zinc-800/80 space-y-2">
          <div className="relative">
            <Search className="w-4 h-4 text-zinc-500 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="SEARCH CATALOG BY KEYWORD, PROTOCOL OR TAG..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`w-full pl-9 pr-3 py-2 rounded-xs border text-xs outline-none ${t.bgInput}`}
            />
          </div>

          {/* Category Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px]">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  soundFx.playClick(1000);
                  setSelectedCategory(cat.id);
                }}
                className={`px-2.5 py-1 rounded-xs whitespace-nowrap border transition-colors cursor-pointer ${
                  selectedCategory === cat.id
                    ? `${t.accentBg} ${t.accentText} ${t.accentBorder} font-bold`
                    : theme === 'dark'
                    ? 'border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
                    : 'border-slate-300 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Widget Grid */}
        <div className="flex-1 overflow-y-auto p-4 grid grid-cols-1 md:grid-cols-2 gap-3">
          {filteredWidgets.map((wDef) => {
            const Icon = ICON_MAP[wDef.iconName] || Activity;
            const alreadyAddedCount = widgets.filter((w) => w.widgetTypeId === wDef.id).length;

            return (
              <div
                key={wDef.id}
                className={`p-3 border rounded-xs flex flex-col justify-between transition-all ${
                  theme === 'dark'
                    ? 'bg-zinc-950/70 border-zinc-800 hover:border-zinc-700'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className={`p-1.5 rounded-xs ${t.accentBg} ${t.accentText}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className={`text-xs font-bold ${t.textPrimary}`}>{wDef.title}</h4>
                        <span className={`text-[10px] ${t.textMuted}`}>{wDef.subtitle}</span>
                      </div>
                    </div>

                    <button
                      onClick={(e) => handleInspect(wDef, e)}
                      title="Inspect Coupler Schema"
                      className="px-1.5 py-0.5 text-[9px] border border-cyan-500/40 text-cyan-400 bg-cyan-950/30 rounded-xs flex items-center gap-1 hover:bg-cyan-900/50 cursor-pointer"
                    >
                      <Cable className="w-2.5 h-2.5" />
                      <span>{wDef.dataCoupler.targetProtocol}</span>
                    </button>
                  </div>

                  <p className={`text-[11px] leading-relaxed my-2 ${t.textSecondary}`}>
                    {wDef.description}
                  </p>

                  <div className="flex flex-wrap gap-1 mt-2">
                    {wDef.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-1.5 py-0.2 text-[9px] bg-zinc-900 border border-zinc-800 text-zinc-400 rounded-xs"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 mt-3 border-t border-zinc-800/60">
                  <span className="text-[10px] text-zinc-500">
                    DEFAULT: {wDef.defaultSize.w} COLS • {wDef.defaultSize.h}PX
                  </span>

                  <button
                    onClick={() => handleAdd(wDef)}
                    className={`px-3 py-1 text-xs font-bold border rounded-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                      alreadyAddedCount > 0
                        ? 'bg-zinc-800 text-zinc-200 border-zinc-700 hover:border-cyan-500'
                        : `${t.accentBg} ${t.accentText} ${t.accentBorder} hover:scale-105`
                    }`}
                  >
                    <Plus className="w-3 h-3" />
                    <span>ADD TO DASH</span>
                    {alreadyAddedCount > 0 && <span className="opacity-60">({alreadyAddedCount})</span>}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
