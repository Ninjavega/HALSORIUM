export type ThemeMode = 'dark' | 'light';

export type AccentColor = 'cyan' | 'emerald' | 'amber' | 'crimson' | 'violet';

export type DefconLevel = 1 | 2 | 3 | 4 | 5;

export type WidgetCategory = 
  | 'intel'
  | 'geospatial'
  | 'surveillance'
  | 'cyber'
  | 'telemetry'
  | 'finance'
  | 'operations';

export type DataCouplerStatus = 'stub_ready' | 'simulated' | 'connected' | 'offline';

export interface DataCouplerSpec {
  couplerId: string;
  targetProtocol: 'RSS/Atom' | 'WebSocket' | 'REST_JSON' | 'RTSP/WebRTC' | 'MQTT' | 'Kafka_Stream';
  eventSubscriptions: string[];
  eventEmissions: string[];
  pollIntervalMs?: number;
  samplePayloadSchema: Record<string, any>;
  notes: string;
}

export interface WidgetDefinition {
  id: string;
  type: string;
  title: string;
  subtitle: string;
  iconName: string;
  category: WidgetCategory;
  defaultSize: { w: number; h: number }; // In grid units (e.g., columns x height in px or col/row span)
  minSize: { w: number; h: number };
  tags: string[];
  capabilities: {
    refreshable?: boolean;
    filterable?: boolean;
    audioFeedback?: boolean;
    expandable?: boolean;
    tabs?: string[];
  };
  dataCoupler: DataCouplerSpec;
  description: string;
}

export interface WidgetInstance {
  instanceId: string;
  widgetTypeId: string;
  customTitle?: string;
  position: { x: number; y: number }; // Pixel or coordinate offset in free layout or grid (x, y)
  size: { w: number; h: number }; // width, height in pixels
  colSpan?: number; // 1 to 12 in responsive tile grid mode
  minimized?: boolean;
  maximized?: boolean;
  activeTab?: string;
  isLocked?: boolean;
  isPinned?: boolean;
  zIndex: number;
  config?: Record<string, any>;
}

export interface LayoutPreset {
  id: string;
  name: string;
  badge: string;
  description: string;
  widgets: Array<{
    widgetTypeId: string;
    colSpan: number;
    height: number;
    activeTab?: string;
  }>;
}

export interface TacticalEvent {
  id: string;
  timestamp: string;
  channel: string;
  severity: 'low' | 'medium' | 'high' | 'critical' | 'info';
  sourceWidgetId?: string;
  title: string;
  payload: Record<string, any>;
}
