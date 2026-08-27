import React, { useState } from 'react';
import { useDashboard } from '../../context/DashboardContext';
import { getThemeClasses } from '../../utils/themeStyles';
import { WIDGET_REGISTRY } from '../../services/widgetRegistry';
import { soundFx } from '../../services/soundFx';
import { 
  X, 
  Code, 
  Layers, 
  Activity, 
  Cable, 
  Terminal, 
  Play, 
  Check, 
  Copy, 
  Database,
  Radio,
  ExternalLink
} from 'lucide-react';

export const ExtensibilityModal: React.FC = () => {
  const {
    isExtensibilityOpen,
    setIsExtensibilityOpen,
    theme,
    accent,
    inspectedWidgetCoupler,
    setInspectedWidgetCoupler,
    recentEvents,
    dispatchUserEvent,
  } = useDashboard();

  const t = getThemeClasses(theme, accent);
  const [activeTab, setActiveTab] = useState<'COUPLER_SPEC' | 'EVENT_BUS' | 'PWA_ROADMAP'>('COUPLER_SPEC');
  const [selectedWidgetId, setSelectedWidgetId] = useState<string>(
    inspectedWidgetCoupler?.id || WIDGET_REGISTRY[0].id
  );
  const [customEventTitle, setCustomEventTitle] = useState<string>('M6.8 Simulated Seismic Waveform Alert');
  const [copied, setCopied] = useState<boolean>(false);

  if (!isExtensibilityOpen) return null;

  const currentDef = WIDGET_REGISTRY.find((w) => w.id === selectedWidgetId) || WIDGET_REGISTRY[0];

  const handleCopyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    soundFx.playClick(1400);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFireTestEvent = () => {
    soundFx.playAlert();
    dispatchUserEvent(customEventTitle, 'high', {
      source: 'Extensibility_Tester_Console',
      targetWidget: currentDef.id,
      timestamp: new Date().toISOString(),
    });
  };

  return (
    <div
      id="modal-extensibility-inspector"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={() => setIsExtensibilityOpen(false)}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`w-full max-w-4xl max-h-[88vh] border rounded-xs shadow-2xl flex flex-col overflow-hidden font-mono ${t.bgPanel} ${t.borderHighlight}`}
      >
        {/* Header */}
        <div className={`flex items-center justify-between px-4 py-3 border-b ${t.bgPanelHeader}`}>
          <div className="flex items-center gap-2">
            <div className={`p-1.5 rounded-xs ${t.accentBg} ${t.accentText}`}>
              <Code className="w-4 h-4" />
            </div>
            <div>
              <h3 className={`text-sm font-bold tracking-wider ${t.textPrimary}`}>
                EXTENSIBLE PWA & COUPLER ROADMAP ARCHITECTURE
              </h3>
              <p className={`text-[10px] ${t.textMuted}`}>
                DEVELOPMENT STUB LAYER // EVENT BUS & DATA HOOK SPECIFICATIONS
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsExtensibilityOpen(false)}
            className="p-1 rounded-xs text-zinc-400 hover:text-rose-400 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Strip */}
        <div className="flex items-center border-b border-zinc-800 px-4 pt-2 gap-2 text-xs">
          <button
            onClick={() => {
              setActiveTab('COUPLER_SPEC');
              soundFx.playClick(1000);
            }}
            className={`px-3 py-1.5 border-b-2 font-bold cursor-pointer ${
              activeTab === 'COUPLER_SPEC'
                ? `border-cyan-400 text-cyan-400`
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            DATA COUPLER SPEC
          </button>
          <button
            onClick={() => {
              setActiveTab('EVENT_BUS');
              soundFx.playClick(1000);
            }}
            className={`px-3 py-1.5 border-b-2 font-bold cursor-pointer ${
              activeTab === 'EVENT_BUS'
                ? `border-cyan-400 text-cyan-400`
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            EVENT BUS CONSOLE
          </button>
          <button
            onClick={() => {
              setActiveTab('PWA_ROADMAP');
              soundFx.playClick(1000);
            }}
            className={`px-3 py-1.5 border-b-2 font-bold cursor-pointer ${
              activeTab === 'PWA_ROADMAP'
                ? `border-cyan-400 text-cyan-400`
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            BRANCHING & FORK ROADMAP
          </button>
        </div>

        {/* CONTENT TABS */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
          {activeTab === 'COUPLER_SPEC' && (
            <div className="space-y-4">
              {/* Widget Selector */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-zinc-400 text-[11px]">SELECT WINDOW COUPLER:</span>
                <select
                  value={selectedWidgetId}
                  onChange={(e) => {
                    setSelectedWidgetId(e.target.value);
                    soundFx.playClick(900);
                  }}
                  className={`px-2 py-1 rounded-xs border text-xs outline-none ${t.bgInput}`}
                >
                  {WIDGET_REGISTRY.map((w) => (
                    <option key={w.id} value={w.id}>
                      {w.title} [{w.dataCoupler.targetProtocol}]
                    </option>
                  ))}
                </select>
              </div>

              {/* Coupler Card Info */}
              <div className="p-3 border border-cyan-500/30 bg-cyan-950/20 rounded-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-cyan-300 flex items-center gap-1.5">
                    <Cable className="w-4 h-4" /> PROTOCOL: {currentDef.dataCoupler.targetProtocol}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 border border-cyan-400/40 text-cyan-300 rounded-xs">
                    COUPLER ID: {currentDef.dataCoupler.couplerId}
                  </span>
                </div>
                <p className="text-zinc-300 text-[11px] leading-relaxed">{currentDef.dataCoupler.notes}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[10px] pt-1">
                  <div className="p-2 border border-zinc-800 bg-black/50 rounded-xs">
                    <span className="text-amber-400 font-bold block mb-1">EVENT SUBSCRIPTIONS:</span>
                    <ul className="list-disc list-inside text-zinc-400 space-y-0.5">
                      {currentDef.dataCoupler.eventSubscriptions.map((sub) => (
                        <li key={sub}><code>{sub}</code></li>
                      ))}
                    </ul>
                  </div>
                  <div className="p-2 border border-zinc-800 bg-black/50 rounded-xs">
                    <span className="text-emerald-400 font-bold block mb-1">EVENT EMISSIONS:</span>
                    <ul className="list-disc list-inside text-zinc-400 space-y-0.5">
                      {currentDef.dataCoupler.eventEmissions.map((em) => (
                        <li key={em}><code>{em}</code></li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* JSON Payload Schema Spec */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400 font-bold text-[11px]">SAMPLE DATA COUPLER JSON PAYLOAD</span>
                  <button
                    onClick={() => handleCopyCode(JSON.stringify(currentDef.dataCoupler.samplePayloadSchema, null, 2))}
                    className="px-2 py-0.5 border border-zinc-700 bg-zinc-900 text-zinc-300 hover:text-cyan-400 text-[10px] rounded-xs flex items-center gap-1 cursor-pointer"
                  >
                    {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copied ? 'COPIED' : 'COPY JSON'}</span>
                  </button>
                </div>

                <pre className="p-3 bg-black text-emerald-400 border border-zinc-800 rounded-xs overflow-x-auto text-[10px] max-h-60">
{JSON.stringify(currentDef.dataCoupler.samplePayloadSchema, null, 2)}
                </pre>
              </div>
            </div>
          )}

          {activeTab === 'EVENT_BUS' && (
            <div className="space-y-4">
              {/* Event Dispatch Tester */}
              <div className="p-3 border border-zinc-800 bg-zinc-950/60 rounded-xs space-y-2">
                <span className="font-bold text-cyan-400 block text-xs">DISPATCH TEST TACTICAL EVENT</span>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customEventTitle}
                    onChange={(e) => setCustomEventTitle(e.target.value)}
                    className={`flex-1 px-2 py-1 border rounded-xs text-xs outline-none ${t.bgInput}`}
                    placeholder="Enter test event title..."
                  />
                  <button
                    onClick={handleFireTestEvent}
                    className={`px-3 py-1 text-xs font-bold border rounded-xs flex items-center gap-1.5 cursor-pointer ${t.accentBg} ${t.accentText} ${t.accentBorder}`}
                  >
                    <Play className="w-3 h-3" /> EMIT EVENT
                  </button>
                </div>
              </div>

              {/* Live Event Stream */}
              <div className="space-y-1.5">
                <span className="text-zinc-400 font-bold text-xs">DECOUPLED EVENT STREAM LOGS ({recentEvents.length})</span>
                <div className="bg-black border border-zinc-800 rounded-xs p-2 max-h-72 overflow-y-auto space-y-1 text-[10px]">
                  {recentEvents.map((evt) => (
                    <div
                      key={evt.id}
                      className="p-1.5 border border-zinc-900 bg-zinc-950 rounded-xs flex items-start justify-between gap-2 font-mono hover:border-zinc-700"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-1 rounded-xs font-bold ${
                              evt.severity === 'critical'
                                ? 'bg-rose-950 text-rose-300'
                                : evt.severity === 'high'
                                ? 'bg-amber-950 text-amber-300'
                                : 'bg-cyan-950 text-cyan-300'
                            }`}
                          >
                            {evt.channel}
                          </span>
                          <span className="text-zinc-200 font-semibold">{evt.title}</span>
                        </div>
                        {evt.payload && Object.keys(evt.payload).length > 0 && (
                          <pre className="text-[9px] text-zinc-500 mt-1">
                            {JSON.stringify(evt.payload)}
                          </pre>
                        )}
                      </div>
                      <span className="text-zinc-500 text-[8px] shrink-0">
                        {new Date(evt.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'PWA_ROADMAP' && (
            <div className="space-y-3 font-mono text-xs leading-relaxed">
              <div className="p-3 border border-emerald-500/30 bg-emerald-950/20 rounded-xs text-emerald-300 space-y-1">
                <span className="font-bold block text-sm">ARCHITECTURAL DESIGN FOR FUTURE WORLD MONITOR FORK</span>
                <p className="text-[11px] text-zinc-300">
                  This prototype establishes completely decoupled UI/UX containers, windows, tabs, and layout registries. When real development begins on your fork:
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px]">
                <div className="p-3 border border-zinc-800 bg-black/40 rounded-xs space-y-1.5">
                  <span className="text-cyan-400 font-bold block flex items-center gap-1.5">
                    <Database className="w-3.5 h-3.5" /> 1. SERVICES & BACKEND COUPLING
                  </span>
                  <p className="text-zinc-400">
                    Replace the placeholder couplers in <code>src/services/widgetRegistry.ts</code> with your Express endpoints, WebSocket feeds, or Redis caching layers without breaking tile positioning.
                  </p>
                </div>

                <div className="p-3 border border-zinc-800 bg-black/40 rounded-xs space-y-1.5">
                  <span className="text-cyan-400 font-bold block flex items-center gap-1.5">
                    <Radio className="w-3.5 h-3.5" /> 2. EVENT-DRIVEN BUS INTEGRATION
                  </span>
                  <p className="text-zinc-400">
                    Use <code>src/services/eventBus.ts</code> to bind incoming server-sent events (SSE) or WebSockets directly to widget channels like <code>GEO_TARGET_LOCKED</code> or <code>DEFCON_LEVEL_CHANGED</code>.
                  </p>
                </div>

                <div className="p-3 border border-zinc-800 bg-black/40 rounded-xs space-y-1.5">
                  <span className="text-cyan-400 font-bold block flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5" /> 3. LIVE CAM & RSS STREAM INGESTION
                  </span>
                  <p className="text-zinc-400">
                    The <code>LiveCamMatrixWidget</code> and <code>RssIntelWireWidget</code> already provide full UI overlays, shaders, and filter states ready for HLS video player or XML RSS parsers.
                  </p>
                </div>

                <div className="p-3 border border-zinc-800 bg-black/40 rounded-xs space-y-1.5">
                  <span className="text-cyan-400 font-bold block flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5" /> 4. PWA OFFLINE PERSISTENCE
                  </span>
                  <p className="text-zinc-400">
                    Local state automatically persists widget positions, custom titles, and active tabs in localStorage and is structured for simple ServiceWorker / IndexedDB synchronization.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
