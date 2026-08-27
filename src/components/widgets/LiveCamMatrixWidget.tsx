import React, { useState, useEffect } from 'react';
import { WidgetInstance } from '../../types/widget';
import { WidgetFrame } from './WidgetFrame';
import { useDashboard } from '../../context/DashboardContext';
import { getThemeClasses } from '../../utils/themeStyles';
import { eventBus } from '../../services/eventBus';
import { soundFx } from '../../services/soundFx';
import { 
  Video, 
  VideoOff, 
  RefreshCw, 
  Crosshair, 
  Maximize2, 
  Compass, 
  ZoomIn, 
  ZoomOut, 
  Sliders, 
  Wifi, 
  Activity,
  Layers,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface CamFeed {
  id: string;
  name: string;
  location: string;
  status: 'ONLINE' | 'OFFLINE_SIGNAL' | 'ENCRYPTED' | 'STANDBY';
  fps: number;
  bitrate: string;
  resolution: string;
  ptzSupported: boolean;
  type: 'cctv' | 'space' | 'port' | 'traffic';
}

const CAM_FEEDS: CamFeed[] = [
  {
    id: 'CAM-01',
    name: 'BOSPORUS STRAIT (NORTH MOUTH)',
    location: 'Istanbul Maritime Choke',
    status: 'ONLINE',
    fps: 30,
    bitrate: '4.8 Mbps',
    resolution: '1920x1080 @ 60Hz',
    ptzSupported: true,
    type: 'port',
  },
  {
    id: 'CAM-02',
    name: 'ISS EARTH OBSERVATION (HDEV)',
    location: 'Low Earth Orbit (418km)',
    status: 'ONLINE',
    fps: 60,
    bitrate: '12.4 Mbps',
    resolution: '3840x2160 UHD',
    ptzSupported: false,
    type: 'space',
  },
  {
    id: 'CAM-03',
    name: 'PANAMA CANAL MIRAFLORES LOCKS',
    location: 'Pacific Entrance Corridor',
    status: 'OFFLINE_SIGNAL',
    fps: 0,
    bitrate: '0.0 Kbps',
    resolution: '1280x720 (NO_CARRIER)',
    ptzSupported: true,
    type: 'port',
  },
  {
    id: 'CAM-04',
    name: 'TOKYO SHIBUYA TACTICAL APEX',
    location: 'Metropolitan Crossing Grid',
    status: 'ONLINE',
    fps: 25,
    bitrate: '3.2 Mbps',
    resolution: '1920x1080',
    ptzSupported: true,
    type: 'traffic',
  },
  {
    id: 'CAM-05',
    name: 'GIBRALTAR STRAIT DEFENSE POST',
    location: 'Mediterranean Western Gate',
    status: 'ENCRYPTED',
    fps: 15,
    bitrate: '2.1 Mbps',
    resolution: '1080p MIL-SPEC',
    ptzSupported: true,
    type: 'cctv',
  },
];

export const LiveCamMatrixWidget: React.FC<{ instance: WidgetInstance; index: number }> = ({ instance, index }) => {
  const { theme, accent } = useDashboard();
  const t = getThemeClasses(theme, accent);

  const [activeTab, setActiveTab] = useState<string>(instance.activeTab || 'MATRIX_VIEW');
  const [selectedCam, setSelectedCam] = useState<CamFeed>(CAM_FEEDS[0]);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [recTime, setRecTime] = useState<string>('00:14:32:08');

  // Timecode generator
  useEffect(() => {
    const timer = setInterval(() => {
      const d = new Date();
      const h = String(d.getUTCHours()).padStart(2, '0');
      const m = String(d.getUTCMinutes()).padStart(2, '0');
      const s = String(d.getUTCSeconds()).padStart(2, '0');
      const ms = String(Math.floor(d.getUTCMilliseconds() / 10)).padStart(2, '0');
      setRecTime(`${h}:${m}:${s}:${ms}`);
    }, 100);
    return () => clearInterval(timer);
  }, []);

  const handleSelectCam = (cam: CamFeed) => {
    setSelectedCam(cam);
    soundFx.playClick(1100);
    eventBus.publish('CAM_CHANNEL_SWITCH', {
      title: `Switched surveillance feed to ${cam.name}`,
      sourceWidgetId: instance.instanceId,
      payload: { camId: cam.id, status: cam.status },
    });
  };

  const handlePan = (dx: number, dy: number) => {
    setPanOffset((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
    soundFx.playClick(1300);
  };

  return (
    <WidgetFrame instance={instance} activeTab={activeTab} onTabChange={setActiveTab} index={index}>
      <div className="flex-1 flex flex-col min-h-0 relative">
        {/* Channel Selector Header */}
        <div
          className={`flex items-center justify-between px-3 py-1.5 border-b text-[10px] font-mono gap-1 overflow-x-auto ${
            theme === 'dark' ? 'bg-zinc-950/80 border-zinc-800' : 'bg-slate-50 border-slate-200'
          }`}
        >
          <div className="flex items-center gap-1">
            {CAM_FEEDS.map((cam) => {
              const isSelected = selectedCam.id === cam.id;
              const isOffline = cam.status === 'OFFLINE_SIGNAL';
              return (
                <button
                  key={cam.id}
                  onClick={() => handleSelectCam(cam)}
                  className={`px-2 py-0.5 border rounded-xs whitespace-nowrap transition-colors cursor-pointer ${
                    isSelected
                      ? `${t.accentBg} ${t.accentText} ${t.accentBorder} font-bold`
                      : isOffline
                      ? 'border-zinc-800 text-zinc-500 hover:text-zinc-300'
                      : 'border-zinc-800 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {cam.id}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2 text-zinc-400 shrink-0">
            <span className="text-rose-500 font-bold flex items-center gap-1 animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" /> REC
            </span>
            <span className="font-mono text-zinc-300">{recTime}</span>
          </div>
        </div>

        {/* FEED VIEW */}
        {activeTab === 'MATRIX_VIEW' || activeTab === 'SINGLE_FEED' ? (
          <div className="flex-1 relative bg-black flex flex-col overflow-hidden min-h-[200px]">
            {/* CRT TV / Scanline Effect */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.4)_50%)] [background-size:100%_4px] pointer-events-none z-20" />

            {/* Video Canvas Simulation */}
            <div className="flex-1 relative flex items-center justify-center overflow-hidden bg-zinc-950">
              {selectedCam.status === 'OFFLINE_SIGNAL' ? (
                /* SMPTE Color Bars / Offline Signal Pattern */
                <div className="w-full h-full flex flex-col items-center justify-center relative">
                  <div className="w-full h-2/3 flex">
                    <div className="flex-1 bg-slate-200" />
                    <div className="flex-1 bg-yellow-400" />
                    <div className="flex-1 bg-cyan-400" />
                    <div className="flex-1 bg-emerald-500" />
                    <div className="flex-1 bg-fuchsia-500" />
                    <div className="flex-1 bg-rose-600" />
                    <div className="flex-1 bg-blue-700" />
                  </div>
                  <div className="w-full h-1/3 flex">
                    <div className="flex-1 bg-blue-900" />
                    <div className="flex-1 bg-black" />
                    <div className="flex-1 bg-fuchsia-900" />
                    <div className="flex-1 bg-zinc-800" />
                    <div className="flex-1 bg-cyan-900" />
                    <div className="flex-1 bg-zinc-900" />
                  </div>

                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 font-mono text-center p-4">
                    <VideoOff className="w-8 h-8 text-rose-500 mb-2 animate-bounce" />
                    <span className="text-rose-400 font-bold text-sm tracking-widest">[ NO VIDEO CARRIER ]</span>
                    <span className="text-zinc-400 text-xs mt-1">SIGNAL DECOUPLING DETECTED • RTSP TIMEOUT</span>
                    <span className="text-[10px] text-cyan-400 mt-2 px-2 py-0.5 border border-cyan-500/40 rounded-xs">
                      READY FOR WEBRTC / HLS STREAM INGESTION
                    </span>
                  </div>
                </div>
              ) : selectedCam.status === 'ENCRYPTED' ? (
                /* Encrypted feed */
                <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-950 font-mono p-4 text-center">
                  <div className="w-12 h-12 rounded-full border border-amber-500/50 flex items-center justify-center text-amber-400 mb-3 animate-spin">
                    <Sliders className="w-6 h-6" />
                  </div>
                  <span className="text-amber-400 font-bold text-xs">AES-256 GCM SECURED MIL-COMM STREAM</span>
                  <span className="text-zinc-500 text-[10px] mt-1">AUTHENTICATION KEY REQUIRED FOR HARDWARE DECRYPTION</span>
                </div>
              ) : (
                /* Active Simulated Live CCTV Stream */
                <div
                  className="w-full h-full relative flex items-center justify-center"
                  style={{
                    transform: `scale(${zoomLevel}) translate(${panOffset.x}px, ${panOffset.y}px)`,
                    transition: 'transform 0.15s ease-out',
                  }}
                >
                  {/* Visual scene placeholder */}
                  <div className="w-full h-full bg-gradient-to-b from-slate-900 via-zinc-900 to-black relative flex items-center justify-center">
                    {/* Simulated horizon & grid */}
                    <div className="absolute inset-x-0 top-1/2 h-0.5 bg-cyan-500/20 border-b border-cyan-400/40" />
                    <div className="absolute inset-y-0 left-1/2 w-0.5 bg-cyan-500/20 border-r border-cyan-400/40" />

                    {/* HUD reticle overlay */}
                    <div className="w-48 h-48 rounded-full border border-dashed border-cyan-500/40 flex items-center justify-center relative">
                      <div className="w-24 h-24 border border-cyan-400/30 flex items-center justify-center">
                        <Crosshair className="w-6 h-6 text-cyan-400/60 animate-spin" style={{ animationDuration: '10s' }} />
                      </div>
                      <span className="absolute -top-3 text-[9px] font-mono text-cyan-400 bg-black/80 px-1 border border-cyan-500/30">
                        AZ: 184.2°
                      </span>
                    </div>

                    {/* Motion detector bounding box */}
                    <div className="absolute top-1/4 right-1/4 w-28 h-20 border-2 border-emerald-400/80 bg-emerald-500/10 rounded-xs flex flex-col justify-between p-1 font-mono text-[8px] text-emerald-300">
                      <span>VESSEL_TGT #09</span>
                      <span className="self-end">CONF: 98.4%</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Live HUD Telemetry Overlay on stream */}
              <div className="absolute top-2 left-2 pointer-events-none z-30 font-mono text-[10px] space-y-0.5 text-zinc-300 bg-black/60 p-1.5 rounded-xs border border-zinc-800/80">
                <div className="text-cyan-400 font-bold">{selectedCam.name}</div>
                <div className="text-zinc-400">{selectedCam.location}</div>
                <div className="flex gap-2 text-[9px] text-zinc-400">
                  <span>FPS: {selectedCam.fps}</span>
                  <span>BITRATE: {selectedCam.bitrate}</span>
                  <span>RES: {selectedCam.resolution}</span>
                </div>
              </div>

              {/* PTZ Quick Controls Overlay */}
              {selectedCam.ptzSupported && selectedCam.status === 'ONLINE' && (
                <div className="absolute bottom-2 right-2 z-30 flex items-center gap-1 bg-black/80 p-1 rounded-xs border border-zinc-800 font-mono text-[10px]">
                  <button
                    onClick={() => handlePan(-10, 0)}
                    title="Pan Left"
                    className="p-1 hover:bg-zinc-800 text-zinc-300 hover:text-cyan-400 rounded-xs cursor-pointer"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handlePan(10, 0)}
                    title="Pan Right"
                    className="p-1 hover:bg-zinc-800 text-zinc-300 hover:text-cyan-400 rounded-xs cursor-pointer"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      setZoomLevel((z) => Math.min(2.5, z + 0.25));
                      soundFx.playClick(1400);
                    }}
                    title="Zoom In"
                    className="p-1 hover:bg-zinc-800 text-zinc-300 hover:text-cyan-400 rounded-xs cursor-pointer"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      setZoomLevel((z) => Math.max(1, z - 0.25));
                      soundFx.playClick(1000);
                    }}
                    title="Zoom Out"
                    className="p-1 hover:bg-zinc-800 text-zinc-300 hover:text-cyan-400 rounded-xs cursor-pointer"
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      setZoomLevel(1);
                      setPanOffset({ x: 0, y: 0 });
                      soundFx.playDock();
                    }}
                    title="Reset PTZ"
                    className="px-1 py-0.5 text-[9px] hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100 rounded-xs cursor-pointer"
                  >
                    RST
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Stream Config / Extensibility Tab */
          <div className="flex-1 overflow-auto p-3 font-mono text-xs space-y-2">
            <div className="p-2 border border-cyan-500/30 bg-cyan-950/20 text-cyan-300 rounded-xs">
              <span className="font-bold">STREAM INGESTION & RTSP/WEBRTC GATEWAY</span>
              <p className="text-[10px] text-zinc-400 mt-1">
                Configure your media server (MediaMTX, WebRTC SFU, go2rtc, or HLS endpoints) for live low-latency camera rendering.
              </p>
            </div>
            <div className="space-y-1 text-[11px]">
              {CAM_FEEDS.map((c) => (
                <div key={c.id} className="p-2 border border-zinc-800 bg-black/40 rounded-xs flex items-center justify-between">
                  <div>
                    <span className="font-bold text-zinc-200">{c.id}: {c.name}</span>
                    <span className="text-[10px] text-zinc-500 block">PROTOCOL: RTSP/WebRTC • URL: rtsps://live.wm.internal/{c.id.toLowerCase()}</span>
                  </div>
                  <span className={`text-[9px] px-1.5 py-0.5 border rounded-xs ${c.status === 'ONLINE' ? 'text-emerald-400 border-emerald-500/50' : 'text-zinc-500 border-zinc-800'}`}>
                    {c.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </WidgetFrame>
  );
};
