import React, { useState, useEffect } from 'react';
import { WidgetInstance } from '../../types/widget';
import { WidgetFrame } from './WidgetFrame';
import { useDashboard } from '../../context/DashboardContext';
import { getThemeClasses } from '../../utils/themeStyles';
import { eventBus } from '../../services/eventBus';
import { soundFx } from '../../services/soundFx';
import { 
  Radio, 
  Search, 
  Filter, 
  ExternalLink, 
  AlertCircle, 
  RefreshCw, 
  Code,
  Shield,
  Zap,
  Globe2
} from 'lucide-react';

interface IntelItem {
  id: string;
  title: string;
  source: string;
  category: 'DEFENSE' | 'GEOPOLITICS' | 'CYBER' | 'MARITIME' | 'TECH';
  urgency: 'BREAKING' | 'HIGH' | 'ROUTINE';
  time: string;
  summary: string;
  region: string;
}

const INITIAL_FEEDS: IntelItem[] = [
  {
    id: 'intel-01',
    title: 'Anomalous GPS & GNSS Jamming Vector Reported Across Baltic Flight Corridors',
    source: 'OSINT Aviation Wire',
    category: 'DEFENSE',
    urgency: 'BREAKING',
    time: '2m ago',
    summary: 'Multiple commercial airliner navigation systems report spoofed positional telemetry near Gotland and Gulf of Finland.',
    region: 'Eastern Europe',
  },
  {
    id: 'intel-02',
    title: 'Subsea Telecommunication Cable Acoustic Array Registers Pressure Variance',
    source: 'Maritime Infrastructure Watch',
    category: 'MARITIME',
    urgency: 'HIGH',
    time: '8m ago',
    summary: 'Red Sea subsea optical fiber maintenance vessel dispatched following optical signal attenuation alarm.',
    region: 'Middle East',
  },
  {
    id: 'intel-03',
    title: 'Zero-Day Vulnerability Disclosed in Enterprise Industrial SCADA Gateway Controllers',
    source: 'Cyber Threat Intel Net',
    category: 'CYBER',
    urgency: 'HIGH',
    time: '19m ago',
    summary: 'Advisory CVE-2026-9402 published. Critical patch recommendation issued for energy and grid management nodes.',
    region: 'Global',
  },
  {
    id: 'intel-04',
    title: 'High-Speed Naval Exercise Patrol Conducts Live Interdiction Drills in Taiwan Strait',
    source: 'Indo-Pacific OSINT Desk',
    category: 'GEOPOLITICS',
    urgency: 'ROUTINE',
    time: '34m ago',
    summary: 'Coast guard cutters and destroyer flotilla conclude 48-hour continuous surveillance patrol.',
    region: 'Indo-Pacific',
  },
  {
    id: 'intel-05',
    title: 'Rare Earth Strategic Reserve Stockpile Quotas Adjusted for Semiconductor Fabrication',
    source: 'Global Supply Chain Monitor',
    category: 'TECH',
    urgency: 'ROUTINE',
    time: '1h ago',
    summary: 'Gallium and Germanium export licenses experience revised processing protocol updates.',
    region: 'Global',
  },
  {
    id: 'intel-06',
    title: 'Seismic Telemetry Sensor Net Logs M6.2 Shallow Tremor in Kuril Islands Trench',
    source: 'USGS Geological Net',
    category: 'DEFENSE',
    urgency: 'ROUTINE',
    time: '1h 20m ago',
    summary: 'Depth calculated at 28km. Local tsunami evaluation confirmed no Pacific-wide basin threat.',
    region: 'Pacific Rim',
  },
];

export const RssIntelWireWidget: React.FC<{ instance: WidgetInstance; index: number }> = ({ instance, index }) => {
  const { theme, accent, searchQuery: globalSearch } = useDashboard();
  const t = getThemeClasses(theme, accent);

  const [activeTab, setActiveTab] = useState<string>(instance.activeTab || 'ALL_DISPATCHES');
  const [filterText, setFilterText] = useState<string>('');
  const [feedItems, setFeedItems] = useState<IntelItem[]>(INITIAL_FEEDS);
  const [selectedItem, setSelectedItem] = useState<IntelItem | null>(INITIAL_FEEDS[0]);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // Subscribe to breaking news trigger simulation or other dispatches
  useEffect(() => {
    const unsub = eventBus.subscribe('TRIGGER_BREAKING_NEWS', (evt) => {
      const newItem: IntelItem = {
        id: `intel-${Date.now()}`,
        title: evt.payload.title || 'CRITICAL STRATEGIC ALERT TRANSMITTED',
        source: evt.payload.source || 'Central Command OSINT',
        category: evt.payload.category || 'DEFENSE',
        urgency: 'BREAKING',
        time: 'Just now',
        summary: evt.payload.summary || 'Immediate situation dispatch received over encrypted wire.',
        region: evt.payload.region || 'Global',
      };
      setFeedItems((prev) => [newItem, ...prev]);
    });
    return unsub;
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    soundFx.playClick(1000);
    setTimeout(() => {
      setIsRefreshing(false);
      soundFx.playBlip(1200);
      eventBus.publish('REFRESH_ALL_FEEDS', {
        title: 'RSS Intel Wire poll completed',
        sourceWidgetId: instance.instanceId,
        payload: { feedCount: feedItems.length },
      });
    }, 600);
  };

  const handleSelectDispatch = (item: IntelItem) => {
    setSelectedItem(item);
    soundFx.playClick(1100);
    eventBus.publish('DISPATCH_SELECTED', {
      severity: item.urgency === 'BREAKING' ? 'critical' : item.urgency === 'HIGH' ? 'high' : 'info',
      title: `Dispatch Selected: ${item.title.substring(0, 45)}...`,
      sourceWidgetId: instance.instanceId,
      payload: item,
    });
  };

  // Filter items by active tab and search text
  const filteredItems = feedItems.filter((item) => {
    const query = (filterText || globalSearch).toLowerCase();
    const matchesSearch =
      !query ||
      item.title.toLowerCase().includes(query) ||
      item.source.toLowerCase().includes(query) ||
      item.summary.toLowerCase().includes(query) ||
      item.region.toLowerCase().includes(query);

    if (!matchesSearch) return false;

    if (activeTab === 'ALL_DISPATCHES') return true;
    if (activeTab === 'GEOPOLITICS' && item.category === 'GEOPOLITICS') return true;
    if (activeTab === 'CYBER_THREATS' && item.category === 'CYBER') return true;
    if (activeTab === 'DEFENSE' && (item.category === 'DEFENSE' || item.category === 'MARITIME')) return true;

    return true;
  });

  return (
    <WidgetFrame instance={instance} activeTab={activeTab} onTabChange={setActiveTab} index={index}>
      <div className="flex-1 flex flex-col min-h-0">
        {/* Search & Refresh Subbar */}
        <div
          className={`flex items-center justify-between px-3 py-1.5 border-b text-[10px] font-mono gap-2 ${
            theme === 'dark' ? 'bg-zinc-950/80 border-zinc-800' : 'bg-slate-50 border-slate-200'
          }`}
        >
          <div className="flex items-center gap-1.5 flex-1 max-w-xs">
            <Search className="w-3 h-3 text-zinc-500" />
            <input
              type="text"
              placeholder="FILTER WIRE (KEYWORDS / REGION)..."
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              className={`w-full px-1.5 py-0.5 rounded-xs border text-[10px] outline-none ${t.bgInput}`}
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-zinc-500 hidden sm:inline">{filteredItems.length} WIRE ITEMS</span>
            <button
              onClick={handleRefresh}
              title="Poll RSS Feed Endpoints"
              className={`p-1 rounded-xs border text-zinc-400 hover:text-cyan-400 cursor-pointer ${
                theme === 'dark' ? 'border-zinc-800 bg-zinc-900' : 'border-slate-300 bg-white'
              }`}
            >
              <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin text-cyan-400' : ''}`} />
            </button>
          </div>
        </div>

        {/* FEED CONTENT OR RAW COUPLER SCHEMA TAB */}
        {activeTab === 'RAW_COUPLER' ? (
          <div className="flex-1 overflow-auto p-3 font-mono text-[11px] space-y-2">
            <div className="p-2 border border-cyan-500/30 bg-cyan-950/20 text-cyan-300 rounded-xs">
              <span className="font-bold block flex items-center gap-1.5">
                <Code className="w-3.5 h-3.5" /> RSS / ATOM EXTENSIBLE COUPLING SPEC
              </span>
              <p className="text-[10px] text-zinc-400 mt-1">
                In upcoming development stages, plug your RSS aggregator backend or WebSocket event gateway directly into this window ID (<code className="text-cyan-300">#rss_intel_wire</code>).
              </p>
            </div>
            <pre className="p-3 bg-black text-emerald-400 rounded-xs border border-zinc-800 overflow-x-auto text-[10px]">
{JSON.stringify(
  {
    couplerType: 'RSS/Atom_Ingestion_Engine',
    endpoint: 'https://api.worldmonitor.prototype/v1/feeds',
    eventBridge: {
      onNewItem: 'eventBus.publish("BREAKING_NEWS_TRIGGERED", payload)',
      onFilter: 'eventBus.subscribe("DISPATCH_FILTER_CHANGE")',
    },
    schema: {
      id: 'string (UUID)',
      title: 'string (Header)',
      source: 'string (Originating Agency)',
      category: ['DEFENSE', 'GEOPOLITICS', 'CYBER', 'MARITIME', 'TECH'],
      urgency: ['BREAKING', 'HIGH', 'ROUTINE'],
      timestamp: 'ISO-8601 UTC',
      summary: 'string (Markdown / Plaintext)',
    },
  },
  null,
  2
)}
            </pre>
          </div>
        ) : (
          <div className="flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden divide-y md:divide-y-0 md:divide-x divide-zinc-800">
            {/* Feed Items List */}
            <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
              {filteredItems.map((item) => {
                const isSelected = selectedItem?.id === item.id;
                const isBreaking = item.urgency === 'BREAKING';
                const isHigh = item.urgency === 'HIGH';

                return (
                  <div
                    key={item.id}
                    onClick={() => handleSelectDispatch(item)}
                    className={`p-2 border rounded-xs transition-all cursor-pointer font-mono ${
                      isSelected
                        ? `${t.accentBg} ${t.accentBorder}`
                        : theme === 'dark'
                        ? 'border-zinc-800/80 bg-zinc-950/40 hover:bg-zinc-900/60'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1 text-[9px] mb-1">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`px-1.5 py-0.2 rounded-xs font-bold ${
                            isBreaking
                              ? 'bg-rose-950 text-rose-300 border border-rose-500 animate-pulse'
                              : isHigh
                              ? 'bg-amber-950 text-amber-300 border border-amber-500/50'
                              : 'bg-zinc-800 text-zinc-300'
                          }`}
                        >
                          {item.urgency}
                        </span>
                        <span className="text-zinc-500">{item.category}</span>
                      </div>
                      <span className="text-zinc-500">{item.time}</span>
                    </div>

                    <h4 className={`text-[11px] font-semibold leading-snug line-clamp-2 ${isSelected ? t.accentText : t.textPrimary}`}>
                      {item.title}
                    </h4>

                    <div className="flex items-center justify-between text-[9px] text-zinc-500 mt-1">
                      <span className="truncate max-w-[140px]">{item.source}</span>
                      <span>{item.region}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Selected Dispatch Preview Card (If on larger window) */}
            {selectedItem && (
              <div className="w-full md:w-56 p-3 flex flex-col justify-between overflow-y-auto bg-black/30 font-mono text-[11px]">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[10px] text-zinc-500 border-b border-zinc-800 pb-1">
                    <span>WIRE DETAIL</span>
                    <span className="text-cyan-400 font-bold">{selectedItem.id}</span>
                  </div>

                  <h3 className="font-bold text-zinc-100 text-xs leading-tight">{selectedItem.title}</h3>

                  <div className="space-y-1 text-[10px] text-zinc-400">
                    <p><strong className="text-zinc-300">SOURCE:</strong> {selectedItem.source}</p>
                    <p><strong className="text-zinc-300">REGION:</strong> {selectedItem.region}</p>
                    <p><strong className="text-zinc-300">STATUS:</strong> {selectedItem.urgency}</p>
                  </div>

                  <div className="p-2 border border-zinc-800 bg-zinc-950 rounded-xs text-[10px] text-zinc-300 leading-relaxed">
                    {selectedItem.summary}
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => {
                      soundFx.playClick(900);
                      eventBus.publish('TRIGGER_BREAKING_NEWS', {
                        title: selectedItem.title,
                        payload: {
                          source: selectedItem.source,
                          category: selectedItem.category,
                          summary: selectedItem.summary,
                          region: selectedItem.region,
                        },
                      });
                    }}
                    className={`w-full py-1 text-[10px] font-bold border rounded-xs flex items-center justify-center gap-1 transition-colors cursor-pointer ${t.accentBg} ${t.accentText} ${t.accentBorder}`}
                  >
                    <Zap className="w-3 h-3" /> BROADCAST EVENT
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </WidgetFrame>
  );
};
