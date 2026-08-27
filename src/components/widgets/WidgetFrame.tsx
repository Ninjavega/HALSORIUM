import React, { useState, useRef, ReactNode } from 'react';
import { WidgetInstance, WidgetDefinition } from '../../types/widget';
import { useDashboard } from '../../context/DashboardContext';
import { getThemeClasses } from '../../utils/themeStyles';
import { WIDGET_REGISTRY } from '../../services/widgetRegistry';
import { soundFx } from '../../services/soundFx';
import { ReticleFrame } from '../common/ReticleFrame';
import { DataCouplerBadge } from '../common/DataCouplerBadge';
import { 
  Minimize2, 
  Maximize2, 
  X, 
  Lock, 
  Unlock, 
  Columns, 
  GripVertical,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  Activity,
  Globe,
  Radio,
  ShieldAlert,
  Video,
  Terminal,
  Orbit,
  TrendingUp,
  Cpu,
  FileText,
  CloudRain
} from 'lucide-react';

interface WidgetFrameProps {
  instance: WidgetInstance;
  children: ReactNode;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  index: number;
}

// Icon mapper
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

export const WidgetFrame: React.FC<WidgetFrameProps> = ({
  instance,
  children,
  activeTab,
  onTabChange,
  index,
}) => {
  const {
    theme,
    accent,
    removeWidget,
    minimizeWidget,
    maximizeWidget,
    updateWidget,
    reorderWidgets,
  } = useDashboard();

  const t = getThemeClasses(theme, accent);
  const widgetDef = WIDGET_REGISTRY.find((w) => w.id === instance.widgetTypeId);
  
  const [showConfigBar, setShowConfigBar] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizingHeight, setIsResizingHeight] = useState(false);
  const frameRef = useRef<HTMLDivElement>(null);

  const IconComponent = widgetDef?.iconName ? (ICON_MAP[widgetDef.iconName] || Activity) : Activity;

  // Handle manual column span toggling for tile dashboard customization
  const cycleColSpan = (e: React.MouseEvent) => {
    e.stopPropagation();
    soundFx.playClick(950);
    const spans = [3, 4, 6, 8, 12];
    const current = instance.colSpan || 4;
    const nextIdx = (spans.indexOf(current) + 1) % spans.length;
    updateWidget(instance.instanceId, { colSpan: spans[nextIdx] });
  };

  // Height resize dragging handler
  const handleResizeMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizingHeight(true);
    soundFx.playClick(1000);

    const startY = e.clientY;
    const startHeight = instance.size.h || 380;

    const onMouseMove = (moveEvent: MouseEvent) => {
      const deltaY = moveEvent.clientY - startY;
      const newHeight = Math.max(220, Math.min(900, startHeight + deltaY));
      updateWidget(instance.instanceId, { size: { ...instance.size, h: newHeight } });
    };

    const onMouseUp = () => {
      setIsResizingHeight(false);
      soundFx.playDock();
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  const colSpanClass = () => {
    if (instance.maximized) return 'col-span-12';
    const span = instance.colSpan || 4;
    switch (span) {
      case 3:
        return 'col-span-12 md:col-span-6 xl:col-span-3';
      case 4:
        return 'col-span-12 md:col-span-6 xl:col-span-4';
      case 6:
        return 'col-span-12 xl:col-span-6';
      case 7:
        return 'col-span-12 xl:col-span-7';
      case 8:
        return 'col-span-12 xl:col-span-8';
      case 12:
        return 'col-span-12';
      default:
        return 'col-span-12 md:col-span-6 xl:col-span-4';
    }
  };

  const tabs = widgetDef?.capabilities.tabs || [];
  const currentTab = activeTab || instance.activeTab || tabs[0] || 'DEFAULT';

  return (
    <div
      ref={frameRef}
      id={`widget-window-${instance.instanceId}`}
      data-widget-type={instance.widgetTypeId}
      draggable={!instance.isLocked && !instance.maximized}
      onDragStart={(e) => {
        setIsDragging(true);
        e.dataTransfer.setData('text/plain', index.toString());
        soundFx.playClick(600);
      }}
      onDragEnd={() => setIsDragging(false)}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        const fromIndexStr = e.dataTransfer.getData('text/plain');
        if (fromIndexStr !== '') {
          const fromIndex = parseInt(fromIndexStr, 10);
          if (!isNaN(fromIndex) && fromIndex !== index) {
            reorderWidgets(fromIndex, index);
          }
        }
      }}
      className={`relative flex flex-col transition-all duration-150 ${colSpanClass()} ${
        isDragging ? 'opacity-40 scale-[0.98]' : 'opacity-100'
      } ${instance.maximized ? 'fixed inset-4 z-50 shadow-2xl' : 'z-10'}`}
      style={{
        height: instance.minimized ? 'auto' : instance.maximized ? 'calc(100vh - 32px)' : `${instance.size.h || 380}px`,
      }}
    >
      <ReticleFrame
        className={`flex-1 flex flex-col overflow-hidden rounded-xs ${t.bgPanel} ${
          instance.maximized ? 'border-2 ' + t.borderHighlight : t.borderMain
        }`}
        accentBorder={instance.maximized}
      >
        {/* HEADER BAR / HUD TITLE STRIP */}
        <div
          className={`flex items-center justify-between px-3 py-2 select-none cursor-move ${t.bgPanelHeader}`}
        >
          {/* Left: Drag grip & Widget Identification */}
          <div className="flex items-center gap-2 min-w-0">
            <div className="flex items-center text-zinc-500 hover:text-zinc-300">
              <GripVertical className="w-3.5 h-3.5" />
            </div>

            <div className={`p-1 rounded-xs ${t.accentBg} ${t.accentText}`}>
              <IconComponent className="w-3.5 h-3.5" />
            </div>

            <div className="flex flex-col truncate">
              <div className="flex items-center gap-2">
                <span className={`text-xs font-bold font-mono tracking-wider truncate ${t.textPrimary}`}>
                  {instance.customTitle || widgetDef?.title || 'TACTICAL WINDOW'}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse hidden sm:inline-block" />
              </div>
              <span className={`text-[10px] font-mono truncate hidden md:inline-block ${t.textMuted}`}>
                {widgetDef?.subtitle || `ID: ${instance.widgetTypeId}`}
              </span>
            </div>
          </div>

          {/* Center/Right: Data Coupler Tag + Window Controls */}
          <div className="flex items-center gap-1.5 shrink-0 ml-2">
            {widgetDef && <DataCouplerBadge widgetDef={widgetDef} />}

            {/* Column Span Customizer */}
            {!instance.maximized && !instance.minimized && (
              <button
                id={`btn-colspan-${instance.instanceId}`}
                onClick={cycleColSpan}
                title={`Width: ${instance.colSpan || 4} Cols (Click to cycle 3/4/6/8/12)`}
                className={`hidden lg:flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono border rounded-xs transition-colors cursor-pointer ${
                  theme === 'dark'
                    ? 'border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
                    : 'border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Columns className="w-2.5 h-2.5" />
                <span>{instance.colSpan || 4}c</span>
              </button>
            )}

            {/* Lock toggle */}
            <button
              id={`btn-lock-${instance.instanceId}`}
              onClick={(e) => {
                e.stopPropagation();
                soundFx.playClick(1000);
                updateWidget(instance.instanceId, { isLocked: !instance.isLocked });
              }}
              title={instance.isLocked ? 'Unlock widget position' : 'Lock widget position'}
              className={`p-1 rounded-xs transition-colors cursor-pointer ${
                instance.isLocked
                  ? 'text-amber-400 bg-amber-950/40'
                  : theme === 'dark'
                  ? 'text-zinc-500 hover:text-zinc-300'
                  : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              {instance.isLocked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3 opacity-60" />}
            </button>

            {/* Minimize / Collapse */}
            <button
              id={`btn-minimize-${instance.instanceId}`}
              onClick={(e) => {
                e.stopPropagation();
                minimizeWidget(instance.instanceId);
              }}
              title={instance.minimized ? 'Expand window' : 'Collapse window'}
              className={`p-1 rounded-xs transition-colors cursor-pointer ${
                theme === 'dark' ? 'text-zinc-400 hover:text-zinc-200' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {instance.minimized ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />}
            </button>

            {/* Maximize */}
            <button
              id={`btn-maximize-${instance.instanceId}`}
              onClick={(e) => {
                e.stopPropagation();
                maximizeWidget(instance.instanceId);
              }}
              title={instance.maximized ? 'Restore window size' : 'Maximize window'}
              className={`p-1 rounded-xs transition-colors cursor-pointer ${
                theme === 'dark' ? 'text-zinc-400 hover:text-zinc-200' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {instance.maximized ? <Minimize2 className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
            </button>

            {/* Close / Remove */}
            <button
              id={`btn-close-${instance.instanceId}`}
              onClick={(e) => {
                e.stopPropagation();
                removeWidget(instance.instanceId);
              }}
              title="Remove widget from dashboard"
              className="p-1 rounded-xs text-zinc-500 hover:text-rose-400 hover:bg-rose-950/30 transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* TAB STRIP (If defined in widget capabilities and not minimized) */}
        {!instance.minimized && tabs.length > 0 && (
          <div
            className={`flex items-center overflow-x-auto border-b px-2 py-1 gap-1 text-[11px] font-mono select-none ${
              theme === 'dark' ? 'bg-zinc-950/60 border-zinc-800/80' : 'bg-slate-100/80 border-slate-200'
            }`}
          >
            {tabs.map((tab) => {
              const isActive = currentTab === tab;
              return (
                <button
                  key={tab}
                  id={`tab-${instance.instanceId}-${tab}`}
                  onClick={() => {
                    soundFx.playClick(1200);
                    if (onTabChange) onTabChange(tab);
                    updateWidget(instance.instanceId, { activeTab: tab });
                  }}
                  className={`px-2.5 py-0.5 rounded-xs transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? `${t.accentBg} ${t.accentText} font-semibold border ${t.accentBorder}`
                      : theme === 'dark'
                      ? 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                >
                  {tab.replace(/_/g, ' ')}
                </button>
              );
            })}
          </div>
        )}

        {/* MAIN WINDOW CONTENT AREA */}
        {!instance.minimized && (
          <div className="flex-1 flex flex-col min-h-0 overflow-auto relative">
            {children}
          </div>
        )}

        {/* BOTTOM HUD FOOTER & RESIZE GRIP */}
        {!instance.minimized && !instance.maximized && (
          <div
            className={`flex items-center justify-between px-3 py-1 text-[9px] font-mono border-t select-none ${t.bgPanelFooter}`}
          >
            <div className="flex items-center gap-2 truncate">
              <span className={t.textMuted}>NODE: {instance.instanceId.split('-').slice(0, 2).join('-')}</span>
              <span className="opacity-40">|</span>
              <span className={t.accentText}>SIG: LIVE_NOMINAL</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-zinc-500 hidden sm:inline">{instance.size.h || 380}px</span>
              {/* Drag resize handle */}
              <div
                id={`handle-resize-${instance.instanceId}`}
                onMouseDown={handleResizeMouseDown}
                title="Drag vertically to resize height"
                className={`w-3.5 h-3.5 flex items-center justify-center cursor-ns-resize rounded-xs transition-colors ${
                  isResizingHeight ? 'bg-cyan-500 text-black' : 'text-zinc-500 hover:text-cyan-400'
                }`}
              >
                <div className="w-1.5 h-1.5 border-r-2 border-b-2 border-current" />
              </div>
            </div>
          </div>
        )}
      </ReticleFrame>
    </div>
  );
};
