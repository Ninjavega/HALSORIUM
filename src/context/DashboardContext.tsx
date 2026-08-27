import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { 
  ThemeMode, 
  AccentColor, 
  DefconLevel, 
  WidgetInstance, 
  WidgetDefinition,
  LayoutPreset,
  TacticalEvent 
} from '../types/widget';
import { WIDGET_REGISTRY, LAYOUT_PRESETS } from '../services/widgetRegistry';
import { eventBus } from '../services/eventBus';
import { soundFx } from '../services/soundFx';

interface DashboardContextType {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  accent: AccentColor;
  setAccent: (accent: AccentColor) => void;
  defcon: DefconLevel;
  setDefcon: (defcon: DefconLevel) => void;
  scanlines: boolean;
  setScanlines: (val: boolean) => void;
  gridOverlay: boolean;
  setGridOverlay: (val: boolean) => void;
  soundEnabled: boolean;
  setSoundEnabled: (val: boolean) => void;
  widgets: WidgetInstance[];
  activePresetId: string;
  loadPreset: (presetId: string) => void;
  addWidget: (widgetTypeId: string) => void;
  removeWidget: (instanceId: string) => void;
  updateWidget: (instanceId: string, updates: Partial<WidgetInstance>) => void;
  reorderWidgets: (startIndex: number, endIndex: number) => void;
  minimizeWidget: (instanceId: string) => void;
  maximizeWidget: (instanceId: string) => void;
  resetAllWidgets: () => void;
  isCatalogOpen: boolean;
  setIsCatalogOpen: (val: boolean) => void;
  isExtensibilityOpen: boolean;
  setIsExtensibilityOpen: (val: boolean) => void;
  inspectedWidgetCoupler: WidgetDefinition | null;
  setInspectedWidgetCoupler: (def: WidgetDefinition | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  recentEvents: TacticalEvent[];
  dispatchUserEvent: (title: string, severity?: TacticalEvent['severity'], payload?: Record<string, any>) => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

const STORAGE_KEY_STATE = 'worldmonitor_dash_v1_state';
const STORAGE_KEY_WIDGETS = 'worldmonitor_dash_v1_widgets';

export const DashboardProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY_STATE}_theme`);
      return (saved === 'light' || saved === 'dark') ? saved : 'dark';
    } catch {
      return 'dark';
    }
  });

  const [accent, setAccentState] = useState<AccentColor>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY_STATE}_accent`);
      return (saved as AccentColor) || 'cyan';
    } catch {
      return 'cyan';
    }
  });

  const [defcon, setDefconState] = useState<DefconLevel>(3);
  const [scanlines, setScanlinesState] = useState<boolean>(true);
  const [gridOverlay, setGridOverlayState] = useState<boolean>(true);
  const [soundEnabled, setSoundEnabledState] = useState<boolean>(true);
  const [activePresetId, setActivePresetId] = useState<string>('world_command');
  
  const [isCatalogOpen, setIsCatalogOpen] = useState<boolean>(false);
  const [isExtensibilityOpen, setIsExtensibilityOpen] = useState<boolean>(false);
  const [inspectedWidgetCoupler, setInspectedWidgetCoupler] = useState<WidgetDefinition | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [recentEvents, setRecentEvents] = useState<TacticalEvent[]>(() => eventBus.getHistory(30));

  // Initialize widgets from preset
  const generateWidgetsFromPreset = useCallback((preset: LayoutPreset): WidgetInstance[] => {
    return preset.widgets.map((w, index) => {
      const def = WIDGET_REGISTRY.find((d) => d.id === w.widgetTypeId);
      return {
        instanceId: `inst-${w.widgetTypeId}-${Date.now()}-${index}`,
        widgetTypeId: w.widgetTypeId,
        customTitle: def?.title,
        position: { x: 0, y: 0 },
        size: { w: 100, h: w.height || 380 },
        colSpan: w.colSpan || 4,
        minimized: false,
        maximized: false,
        activeTab: w.activeTab || def?.capabilities.tabs?.[0] || 'DEFAULT',
        zIndex: index + 1,
        isLocked: false,
        isPinned: false,
      };
    });
  }, []);

  const [widgets, setWidgets] = useState<WidgetInstance[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_WIDGETS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to load stored widgets, using default layout preset', e);
    }
    const defaultPreset = LAYOUT_PRESETS[0];
    return generateWidgetsFromPreset(defaultPreset);
  });

  // Keep recent events synchronized with eventBus
  useEffect(() => {
    const unsub = eventBus.subscribe('*', (evt) => {
      setRecentEvents((prev) => [evt, ...prev].slice(0, 40));
    });
    return unsub;
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_WIDGETS, JSON.stringify(widgets));
    } catch {
      // ignore
    }
  }, [widgets]);

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
    try {
      localStorage.setItem(`${STORAGE_KEY_STATE}_theme`, newTheme);
    } catch {
      // ignore
    }
    soundFx.playClick(1400);
    eventBus.publish('THEME_CHANGED', {
      title: `Theme set to ${newTheme.toUpperCase()}`,
      payload: { theme: newTheme },
    });
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const setAccent = (newAccent: AccentColor) => {
    setAccentState(newAccent);
    try {
      localStorage.setItem(`${STORAGE_KEY_STATE}_accent`, newAccent);
    } catch {
      // ignore
    }
    soundFx.playBlip(1200);
    eventBus.publish('ACCENT_CHANGED', {
      title: `Cyber accent shifted to ${newAccent.toUpperCase()}`,
      payload: { accent: newAccent },
    });
  };

  const setDefcon = (newDefcon: DefconLevel) => {
    setDefconState(newDefcon);
    if (newDefcon <= 2) {
      soundFx.playAlert();
    } else {
      soundFx.playClick(900);
    }
    eventBus.publish('DEFCON_LEVEL_CHANGED', {
      severity: newDefcon <= 2 ? 'critical' : newDefcon === 3 ? 'high' : 'medium',
      title: `DEFCON ${newDefcon} POSTURE ENGAGED`,
      payload: { defcon: newDefcon, timestamp: new Date().toISOString() },
    });
  };

  const setScanlines = (val: boolean) => {
    setScanlinesState(val);
    soundFx.playClick(800);
  };

  const setGridOverlay = (val: boolean) => {
    setGridOverlayState(val);
    soundFx.playClick(800);
  };

  const setSoundEnabled = (val: boolean) => {
    setSoundEnabledState(val);
    soundFx.setEnabled(val);
    if (val) soundFx.playBlip(1000);
  };

  const loadPreset = (presetId: string) => {
    const preset = LAYOUT_PRESETS.find((p) => p.id === presetId);
    if (preset) {
      setActivePresetId(presetId);
      const newWidgets = generateWidgetsFromPreset(preset);
      setWidgets(newWidgets);
      soundFx.playSweep();
      eventBus.publish('LAYOUT_PRESET_LOADED', {
        title: `Loaded Preset: ${preset.name}`,
        payload: { presetId, widgetCount: newWidgets.length },
      });
    }
  };

  const addWidget = (widgetTypeId: string) => {
    const def = WIDGET_REGISTRY.find((w) => w.id === widgetTypeId);
    if (!def) return;

    const newInstance: WidgetInstance = {
      instanceId: `inst-${widgetTypeId}-${Date.now()}`,
      widgetTypeId,
      customTitle: def.title,
      position: { x: 0, y: 0 },
      size: { w: 100, h: def.defaultSize.h },
      colSpan: def.defaultSize.w,
      minimized: false,
      maximized: false,
      activeTab: def.capabilities.tabs?.[0] || 'DEFAULT',
      zIndex: widgets.length + 1,
      isLocked: false,
      isPinned: false,
    };

    setWidgets((prev) => [newInstance, ...prev]);
    soundFx.playDock();
    eventBus.publish('WIDGET_ADDED', {
      title: `Widget [${def.title}] added to dashboard`,
      payload: { widgetTypeId, instanceId: newInstance.instanceId },
    });
  };

  const removeWidget = (instanceId: string) => {
    const target = widgets.find((w) => w.instanceId === instanceId);
    setWidgets((prev) => prev.filter((w) => w.instanceId !== instanceId));
    soundFx.playClick(600);
    eventBus.publish('WIDGET_REMOVED', {
      title: `Widget instance removed from dash`,
      payload: { instanceId, type: target?.widgetTypeId },
    });
  };

  const updateWidget = (instanceId: string, updates: Partial<WidgetInstance>) => {
    setWidgets((prev) =>
      prev.map((w) => (w.instanceId === instanceId ? { ...w, ...updates } : w))
    );
  };

  const reorderWidgets = (startIndex: number, endIndex: number) => {
    setWidgets((prev) => {
      const result = Array.from(prev);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      return result;
    });
    soundFx.playBlip(750);
  };

  const minimizeWidget = (instanceId: string) => {
    setWidgets((prev) =>
      prev.map((w) =>
        w.instanceId === instanceId ? { ...w, minimized: !w.minimized, maximized: false } : w
      )
    );
    soundFx.playClick(900);
  };

  const maximizeWidget = (instanceId: string) => {
    setWidgets((prev) =>
      prev.map((w) =>
        w.instanceId === instanceId ? { ...w, maximized: !w.maximized, minimized: false } : w
      )
    );
    soundFx.playSweep();
  };

  const resetAllWidgets = () => {
    const defaultPreset = LAYOUT_PRESETS[0];
    setActivePresetId(defaultPreset.id);
    const newWidgets = generateWidgetsFromPreset(defaultPreset);
    setWidgets(newWidgets);
    soundFx.playSweep();
    eventBus.publish('DASHBOARD_RESET', {
      title: 'Dashboard layout restored to default Global Command HQ',
      payload: {},
    });
  };

  const dispatchUserEvent = (
    title: string,
    severity: TacticalEvent['severity'] = 'info',
    payload: Record<string, any> = {}
  ) => {
    eventBus.publish('USER_ACTION', {
      title,
      severity,
      payload,
    });
  };

  return (
    <DashboardContext.Provider
      value={{
        theme,
        setTheme,
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
        widgets,
        activePresetId,
        loadPreset,
        addWidget,
        removeWidget,
        updateWidget,
        reorderWidgets,
        minimizeWidget,
        maximizeWidget,
        resetAllWidgets,
        isCatalogOpen,
        setIsCatalogOpen,
        isExtensibilityOpen,
        setIsExtensibilityOpen,
        inspectedWidgetCoupler,
        setInspectedWidgetCoupler,
        searchQuery,
        setSearchQuery,
        recentEvents,
        dispatchUserEvent,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = (): DashboardContextType => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};
