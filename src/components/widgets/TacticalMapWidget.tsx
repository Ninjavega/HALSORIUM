import React, { useState, useEffect } from 'react';
import { WidgetInstance } from '../../types/widget';
import { WidgetFrame } from './WidgetFrame';
import { useDashboard } from '../../context/DashboardContext';
import { getThemeClasses } from '../../utils/themeStyles';
import { eventBus } from '../../services/eventBus';
import { soundFx } from '../../services/soundFx';
import { 
  Crosshair, 
  Layers, 
  MapPin, 
  Radio, 
  ShieldAlert, 
  Anchor, 
  Eye, 
  Maximize2,
  ZoomIn,
  ZoomOut,
  RotateCcw
} from 'lucide-react';

interface Hotspot {
  id: string;
  name: string;
  lat: number;
  lng: number;
  threat: 'CRITICAL' | 'HIGH' | 'ELEVATED' | 'MODERATE';
  category: 'chokepoint' | 'conflict' | 'maritime' | 'nuclear' | 'cyber';
  description: string;
  activity: string;
}

const HOTSPOTS: Hotspot[] = [
  { id: 'hs-1', name: 'Strait of Hormuz', lat: 26.56, lng: 56.25, threat: 'HIGH', category: 'chokepoint', description: 'Heavy crude oil transit. High speed patrol vessel patrol detected.', activity: 'GPS Spoofer active' },
  { id: 'hs-2', name: 'Taiwan Strait', lat: 24.2, lng: 119.5, threat: 'ELEVATED', category: 'conflict', description: 'ADIZ airspace patrol activity. Joint strike drills ongoing.', activity: '18 sorties in 24h' },
  { id: 'hs-3', name: 'Bab el-Mandeb (Red Sea)', lat: 12.58, lng: 43.33, threat: 'CRITICAL', category: 'maritime', description: 'Commercial cargo escort transit corridor. ASBM threat zone.', activity: 'Convoy Alpha-4 escorted' },
  { id: 'hs-4', name: 'Suwalki Gap', lat: 54.3, lng: 23.3, threat: 'HIGH', category: 'conflict', description: 'NATO Eastern Flank logistics choke point. Electronic warfare radar active.', activity: 'EW jamming logged' },
  { id: 'hs-5', name: 'Malacca Strait', lat: 1.43, lng: 102.8, threat: 'MODERATE', category: 'chokepoint', description: 'Major Indo-Pacific container trade lane. 94k vessels/year.', activity: 'AIS Traffic Nominal' },
  { id: 'hs-6', name: 'Barents Sea / Kola Peninsula', lat: 69.3, lng: 33.1, threat: 'HIGH', category: 'nuclear', description: 'Strategic submarine base deployment area. Ice patrol active.', activity: 'Delta-IV class patrol' },
  { id: 'hs-7', name: 'Panama Canal', lat: 9.08, lng: -79.68, threat: 'MODERATE', category: 'chokepoint', description: 'Drought transit restriction and slot auctions. High wait queue.', activity: '32 daily transits' },
  { id: 'hs-8', name: 'Korean DMZ', lat: 38.3, lng: 127.1, threat: 'HIGH', category: 'conflict', description: 'Frontline border radar & artillery readiness posture.', activity: 'DEFCON 3 Alert' },
];

export const TacticalMapWidget: React.FC<{ instance: WidgetInstance; index: number }> = ({ instance, index }) => {
  const { theme, accent } = useDashboard();
  const t = getThemeClasses(theme, accent);

  const [activeTab, setActiveTab] = useState<string>(instance.activeTab || 'LIVE_PROJECTION');
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(HOTSPOTS[0]);
  const [showRadarSweep, setShowRadarSweep] = useState<boolean>(true);
  const [showChokepoints, setShowChokepoints] = useState<boolean>(true);
  const [showSatPass, setShowSatPass] = useState<boolean>(true);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [coords, setCoords] = useState<{ x: number; y: number; lat: string; lng: string }>({
    x: 0,
    y: 0,
    lat: '26.56° N',
    lng: '56.25° E',
  });

  // Map coordinates to pixel offset for equirectangular projection
  const latLngToPercent = (lat: number, lng: number) => {
    // lat: 90 (top) to -90 (bottom) -> y: 0% to 100%
    const y = ((90 - lat) / 180) * 100;
    // lng: -180 (left) to 180 (right) -> x: 0% to 100%
    const x = ((lng + 180) / 360) * 100;
    return { x, y };
  };

  const handleHotspotClick = (hs: Hotspot) => {
    setSelectedHotspot(hs);
    soundFx.playBlip(1200);
    eventBus.publish('GEO_TARGET_LOCKED', {
      severity: hs.threat === 'CRITICAL' ? 'critical' : hs.threat === 'HIGH' ? 'high' : 'medium',
      title: `Tactical Lock: ${hs.name} [${hs.category.toUpperCase()}]`,
      sourceWidgetId: instance.instanceId,
      payload: { ...hs, timestamp: new Date().toISOString() },
    });
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    const lat = (90 - py * 180).toFixed(2);
    const lng = (px * 360 - 180).toFixed(2);
    setCoords({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      lat: `${Math.abs(Number(lat))}° ${Number(lat) >= 0 ? 'N' : 'S'}`,
      lng: `${Math.abs(Number(lng))}° ${Number(lng) >= 0 ? 'E' : 'W'}`,
    });
  };

  return (
    <WidgetFrame instance={instance} activeTab={activeTab} onTabChange={setActiveTab} index={index}>
      <div className="flex-1 flex flex-col min-h-0 relative">
        {/* HUD Sub-header: Filter toggles & active target */}
        <div
          className={`flex flex-wrap items-center justify-between px-3 py-1.5 border-b text-[10px] font-mono gap-2 ${
            theme === 'dark' ? 'bg-zinc-950/80 border-zinc-800' : 'bg-slate-50 border-slate-200'
          }`}
        >
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Crosshair className={`w-3 h-3 ${t.accentText}`} />
              <span className={t.textPrimary}>LOCK: {selectedHotspot ? selectedHotspot.name : 'GLOBAL SWEEP'}</span>
            </span>
            <span className="text-zinc-500 hidden sm:inline">[{coords.lat}, {coords.lng}]</span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => {
                setShowRadarSweep(!showRadarSweep);
                soundFx.playClick(900);
              }}
              className={`px-2 py-0.5 border rounded-xs transition-colors cursor-pointer ${
                showRadarSweep
                  ? `${t.accentBg} ${t.accentText} ${t.accentBorder}`
                  : 'text-zinc-500 border-zinc-800'
              }`}
            >
              RADAR SWEEP
            </button>
            <button
              onClick={() => {
                setShowChokepoints(!showChokepoints);
                soundFx.playClick(900);
              }}
              className={`px-2 py-0.5 border rounded-xs transition-colors cursor-pointer ${
                showChokepoints
                  ? 'bg-amber-950/40 text-amber-300 border-amber-500/40'
                  : 'text-zinc-500 border-zinc-800'
              }`}
            >
              CHOKEPOINTS
            </button>
            <button
              onClick={() => {
                setShowSatPass(!showSatPass);
                soundFx.playClick(900);
              }}
              className={`px-2 py-0.5 border rounded-xs transition-colors cursor-pointer ${
                showSatPass
                  ? 'bg-cyan-950/40 text-cyan-300 border-cyan-500/40'
                  : 'text-zinc-500 border-zinc-800'
              }`}
            >
              SAT PASS
            </button>
          </div>
        </div>

        {/* PROJECTION VIEWPORT */}
        {activeTab === 'LIVE_PROJECTION' && (
          <div className="flex-1 relative bg-black/95 overflow-hidden flex items-center justify-center min-h-[220px]">
            {/* Tactical Grid Overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none opacity-40" />

            {/* Simulated Radar Sweep */}
            {showRadarSweep && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden opacity-30">
                <div className="w-[800px] h-[800px] rounded-full border border-cyan-500/30 relative animate-radar">
                  <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-br from-cyan-500/30 to-transparent origin-bottom-left" />
                </div>
              </div>
            )}

            {/* SVG Tactical Vector Map */}
            <svg
              viewBox="0 0 1000 500"
              className="w-full h-full object-contain cursor-crosshair relative z-10"
              onMouseMove={handleMouseMove}
              style={{ transform: `scale(${zoomLevel})`, transition: 'transform 0.2s ease-out' }}
            >
              {/* Latitude & Longitude grid lines */}
              <g stroke="rgba(71, 85, 105, 0.25)" strokeWidth="0.5" strokeDasharray="3 3">
                <line x1="0" y1="125" x2="1000" y2="125" />
                <line x1="0" y1="250" x2="1000" y2="250" />
                <line x1="0" y1="375" x2="1000" y2="375" />
                <line x1="250" y1="0" x2="250" y2="500" />
                <line x1="500" y1="0" x2="500" y2="500" />
                <line x1="750" y1="0" x2="750" y2="500" />
                {/* Equator & Prime meridian */}
                <line x1="0" y1="250" x2="1000" y2="250" stroke="rgba(6, 182, 212, 0.4)" strokeWidth="1" />
                <line x1="500" y1="0" x2="500" y2="500" stroke="rgba(6, 182, 212, 0.4)" strokeWidth="1" />
              </g>

              {/* Simplified stylized continents vector */}
              <g fill="rgba(30, 41, 59, 0.5)" stroke="rgba(100, 116, 139, 0.6)" strokeWidth="1">
                {/* North America */}
                <path d="M 120 70 L 220 60 L 280 90 L 290 150 L 250 200 L 210 240 L 170 200 L 130 180 L 100 130 Z" />
                {/* South America */}
                <path d="M 270 260 L 340 280 L 350 350 L 310 440 L 280 430 L 260 330 Z" />
                {/* Europe */}
                <path d="M 460 70 L 550 70 L 570 120 L 530 160 L 470 160 L 450 110 Z" />
                {/* Africa */}
                <path d="M 460 170 L 560 170 L 600 240 L 570 360 L 520 400 L 470 330 L 440 230 Z" />
                {/* Asia / Eurasia */}
                <path d="M 570 60 L 850 60 L 920 120 L 860 220 L 780 260 L 680 240 L 600 160 Z" />
                {/* Australia */}
                <path d="M 780 320 L 880 320 L 890 390 L 800 410 L 770 360 Z" />
                {/* Greenland & Arctic */}
                <path d="M 330 30 L 410 30 L 390 70 L 320 60 Z" />
                {/* Antarctica */}
                <path d="M 100 480 L 900 480 L 850 495 L 150 495 Z" opacity="0.4" />
              </g>

              {/* Satellite Orbital Pass Arc */}
              {showSatPass && (
                <g>
                  <path
                    d="M 100 420 Q 500 80 900 380"
                    fill="none"
                    stroke="rgba(56, 189, 248, 0.6)"
                    strokeWidth="1.5"
                    strokeDasharray="6 4"
                  />
                  {/* Sat marker */}
                  <circle cx="560" cy="185" r="4" fill="#38bdf8">
                    <animate attributeName="r" values="3;6;3" dur="2s" repeatCount="indefinite" />
                  </circle>
                  <text x="570" y="180" fill="#38bdf8" fontSize="10" fontFamily="JetBrains Mono" fontWeight="bold">
                    SAT-USA-326 [REC]
                  </text>
                </g>
              )}

              {/* Maritime Chokepoint Lines */}
              {showChokepoints && (
                <g stroke="rgba(245, 158, 11, 0.5)" strokeWidth="1" strokeDasharray="2 2">
                  <line x1="630" y1="210" x2="680" y2="280" />
                  <line x1="560" y1="230" x2="630" y2="210" />
                </g>
              )}

              {/* Hotspot Markers */}
              {HOTSPOTS.map((hs) => {
                const { x, y } = latLngToPercent(hs.lat, hs.lng);
                const isSelected = selectedHotspot?.id === hs.id;
                const color =
                  hs.threat === 'CRITICAL'
                    ? '#f43f5e'
                    : hs.threat === 'HIGH'
                    ? '#fb923c'
                    : hs.threat === 'ELEVATED'
                    ? '#eab308'
                    : '#38bdf8';

                return (
                  <g
                    key={hs.id}
                    transform={`translate(${x * 10}, ${y * 5})`}
                    className="cursor-pointer transition-all hover:scale-125"
                    onClick={() => handleHotspotClick(hs)}
                  >
                    {/* Pulsing ring */}
                    <circle cx="0" cy="0" r={isSelected ? 10 : 6} fill="none" stroke={color} strokeWidth="1.5">
                      <animate attributeName="r" values="4;12;4" dur="2s" repeatCount="indefinite" />
                      <animate attributeName="opacity" values="1;0.2;1" dur="2s" repeatCount="indefinite" />
                    </circle>
                    <circle cx="0" cy="0" r={isSelected ? 4 : 2.5} fill={color} />
                    {isSelected && (
                      <g>
                        <rect x="-35" y="-22" width="70" height="14" fill="rgba(0,0,0,0.85)" stroke={color} strokeWidth="0.8" rx="2" />
                        <text x="0" y="-12" fill={color} fontSize="8" fontFamily="JetBrains Mono" textAnchor="middle" fontWeight="bold">
                          {hs.name.substring(0, 12)}
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}
            </svg>

            {/* Bottom HUD Lock Card overlay */}
            {selectedHotspot && (
              <div
                className={`absolute bottom-2 left-2 right-2 p-2.5 rounded-xs border text-[11px] font-mono backdrop-blur-md z-20 flex flex-wrap items-center justify-between gap-2 ${
                  theme === 'dark' ? 'bg-zinc-950/90 border-cyan-500/40 text-zinc-200' : 'bg-white/95 border-cyan-600/50 text-slate-800 shadow-md'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                  <div>
                    <span className="font-bold text-cyan-400">{selectedHotspot.name}</span>
                    <span className="text-zinc-500 ml-2">({selectedHotspot.lat}°N, {selectedHotspot.lng}°E)</span>
                    <p className="text-[10px] text-zinc-400 truncate max-w-md">{selectedHotspot.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-[10px]">
                  <span
                    className={`px-2 py-0.5 border rounded-xs font-bold ${
                      selectedHotspot.threat === 'CRITICAL'
                        ? 'bg-rose-950/80 text-rose-300 border-rose-500'
                        : selectedHotspot.threat === 'HIGH'
                        ? 'bg-amber-950/80 text-amber-300 border-amber-500'
                        : 'bg-cyan-950/80 text-cyan-300 border-cyan-500'
                    }`}
                  >
                    THREAT: {selectedHotspot.threat}
                  </span>
                  <span className="text-zinc-400 hidden md:inline">{selectedHotspot.activity}</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: HOTSPOTS DIRECTORY LIST */}
        {activeTab === 'HOTSPOTS' && (
          <div className="flex-1 overflow-auto p-3 space-y-2">
            {HOTSPOTS.map((hs) => (
              <div
                key={hs.id}
                onClick={() => handleHotspotClick(hs)}
                className={`p-2.5 border rounded-xs transition-all cursor-pointer flex items-center justify-between font-mono text-xs ${
                  selectedHotspot?.id === hs.id
                    ? `${t.accentBg} ${t.accentBorder} ${t.accentText}`
                    : theme === 'dark'
                    ? 'border-zinc-800 bg-zinc-950/60 hover:bg-zinc-800/40 text-zinc-300'
                    : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <ShieldAlert
                    className={`w-4 h-4 ${
                      hs.threat === 'CRITICAL' ? 'text-rose-500' : hs.threat === 'HIGH' ? 'text-amber-500' : 'text-cyan-500'
                    }`}
                  />
                  <div>
                    <span className="font-semibold block">{hs.name}</span>
                    <span className="text-[10px] text-zinc-500">{hs.category.toUpperCase()} • Lat {hs.lat}°, Lng {hs.lng}°</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] px-1.5 py-0.5 border rounded-xs font-bold">{hs.threat}</span>
                  <span className="text-[10px] text-zinc-500 block">{hs.activity}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 3: CHOKEPOINTS & STRAITS */}
        {activeTab === 'CHOKEPOINTS' && (
          <div className="flex-1 overflow-auto p-3 space-y-3 font-mono text-xs">
            <div className={`p-3 border rounded-xs ${theme === 'dark' ? 'bg-zinc-950 border-zinc-800' : 'bg-slate-50 border-slate-200'}`}>
              <h4 className="font-bold text-amber-400 mb-1 flex items-center gap-1.5">
                <Anchor className="w-3.5 h-3.5" /> STRATEGIC MARITIME TRANSIT PASSAGES
              </h4>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                Global economic trade routes depend on critical maritime narrows. Real-time AIS positioning, depth acoustic sensors, and naval patrol telemetry are queued for live stream coupling.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px]">
              <div className="p-2 border border-zinc-800 bg-black/40 rounded-xs">
                <span className="text-cyan-400 font-bold block">STRAIT OF HORMUZ</span>
                <span className="text-zinc-400">21M bpd oil transit (21% global supply). High electronic warfare interference.</span>
              </div>
              <div className="p-2 border border-zinc-800 bg-black/40 rounded-xs">
                <span className="text-cyan-400 font-bold block">MALACCA STRAIT</span>
                <span className="text-zinc-400">Primary route connecting Indian & Pacific Oceans. Over 90,000 vessels annually.</span>
              </div>
              <div className="p-2 border border-zinc-800 bg-black/40 rounded-xs">
                <span className="text-cyan-400 font-bold block">BAB EL-MANDEB</span>
                <span className="text-zinc-400">Southern gate to Red Sea & Suez Canal. Heightened commercial escort requirements.</span>
              </div>
              <div className="p-2 border border-zinc-800 bg-black/40 rounded-xs">
                <span className="text-cyan-400 font-bold block">PANAMA CANAL</span>
                <span className="text-zinc-400">Freshwater reservoir lock system. Capacity monitored under seasonal precipitation index.</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: SAT PASS */}
        {activeTab === 'SAT_PASS' && (
          <div className="flex-1 overflow-auto p-3 font-mono text-xs space-y-2">
            <div className="p-2 border border-cyan-500/30 bg-cyan-950/20 text-cyan-300 rounded-xs flex items-center justify-between">
              <span>ACTIVE SATELLITE CONSTELLATION TRACK: 3,840 BIRDS</span>
              <span className="animate-pulse text-emerald-400">● LIVE EPHEMERIS</span>
            </div>
            <div className="space-y-1.5">
              <div className="p-2 border border-zinc-800 bg-black/40 rounded-xs flex items-center justify-between text-[11px]">
                <span>USA-326 (OPTICAL RECON)</span>
                <span className="text-cyan-400">ALT: 512km • AZ: 142.4° • EL: 68.2°</span>
              </div>
              <div className="p-2 border border-zinc-800 bg-black/40 rounded-xs flex items-center justify-between text-[11px]">
                <span>COSMOS-2558 (INSPECTOR)</span>
                <span className="text-amber-400">ALT: 450km • CO-ORBITAL VECTOR</span>
              </div>
              <div className="p-2 border border-zinc-800 bg-black/40 rounded-xs flex items-center justify-between text-[11px]">
                <span>ISS (ZARYA)</span>
                <span className="text-emerald-400">ALT: 418km • GROUND SPEED: 7.66 km/s</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </WidgetFrame>
  );
};
