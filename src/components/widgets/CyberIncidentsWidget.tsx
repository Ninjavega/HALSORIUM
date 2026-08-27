import React, { useState, useEffect } from 'react';
import { WidgetInstance } from '../../types/widget';
import { WidgetFrame } from './WidgetFrame';
import { useDashboard } from '../../context/DashboardContext';
import { getThemeClasses } from '../../utils/themeStyles';
import { eventBus } from '../../services/eventBus';
import { soundFx } from '../../services/soundFx';
import { 
  Terminal, 
  ShieldAlert, 
  Cpu, 
  Code, 
  Activity, 
  Bug, 
  Flame, 
  Radio,
  Lock
} from 'lucide-react';

interface CveAlert {
  cve: string;
  target: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  cvss: number;
  status: 'ACTIVE_EXPLOIT' | 'PATCH_RELEASED' | 'POC_OBSERVED';
  time: string;
}

const CVE_LIST: CveAlert[] = [
  { cve: 'CVE-2026-9921', target: 'Industrial SCADA Modbus Gateway RCE', severity: 'CRITICAL', cvss: 9.8, status: 'ACTIVE_EXPLOIT', time: '14m ago' },
  { cve: 'CVE-2026-8742', target: 'Core BGP Routing Table Cache Poisoning', severity: 'CRITICAL', cvss: 9.6, status: 'ACTIVE_EXPLOIT', time: '42m ago' },
  { cve: 'CVE-2026-4409', target: 'OpenSSH Crypto Session Memory Leak', severity: 'HIGH', cvss: 8.1, status: 'PATCH_RELEASED', time: '2h ago' },
  { cve: 'CVE-2026-1184', target: 'Kubernetes Ingress Controller Buffer Overflow', severity: 'HIGH', cvss: 7.9, status: 'POC_OBSERVED', time: '4h ago' },
];

export const CyberIncidentsWidget: React.FC<{ instance: WidgetInstance; index: number }> = ({ instance, index }) => {
  const { theme, accent } = useDashboard();
  const t = getThemeClasses(theme, accent);

  const [activeTab, setActiveTab] = useState<string>(instance.activeTab || 'LIVE_VECTORS');
  const [hexLogs, setHexLogs] = useState<string[]>([]);
  const [attacksPerSec, setAttacksPerSec] = useState<number>(1420);

  // Hex stream generator
  useEffect(() => {
    const interval = setInterval(() => {
      const hex = Array.from({ length: 8 }, () => Math.floor(Math.random() * 256).toString(16).padStart(2, '0')).join(' ');
      const ascii = '..' + String.fromCharCode(65 + Math.floor(Math.random() * 26)) + '..' + String.fromCharCode(48 + Math.floor(Math.random() * 10));
      const log = `0x${Math.floor(Math.random() * 0xffff).toString(16).padStart(4, '0')} : ${hex} | ${ascii}`;
      setHexLogs((prev) => [log, ...prev.slice(0, 25)]);
      setAttacksPerSec(1350 + Math.floor(Math.random() * 200));
    }, 400);
    return () => clearInterval(interval);
  }, []);

  const handleSimulateAttack = () => {
    soundFx.playAlert();
    eventBus.publish('CYBER_INCIDENT_DETECTED', {
      severity: 'critical',
      title: 'DDoS Vector Amplification Spike (1.2 Tbps)',
      sourceWidgetId: instance.instanceId,
      payload: { vector: 'DNS_ANY_REFLECT', bandwidthGbps: 1240 },
    });
  };

  return (
    <WidgetFrame instance={instance} activeTab={activeTab} onTabChange={setActiveTab} index={index}>
      <div className="flex-1 flex flex-col min-h-0 p-3 space-y-3 font-mono text-xs overflow-y-auto">
        {/* SOC HEADER METRIC */}
        <div className={`p-2.5 border rounded-xs flex items-center justify-between ${theme === 'dark' ? 'bg-zinc-950 border-zinc-800' : 'bg-slate-50 border-slate-200'}`}>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
            <div>
              <span className="font-bold text-zinc-200 text-xs">GLOBAL ATTACK VELOCITY</span>
              <span className="text-[10px] text-zinc-500 block">SOC HONEYPOT & SFLOW TELEMETRY</span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-sm font-black text-rose-400">{attacksPerSec.toLocaleString()} / SEC</span>
            <span className="text-[9px] text-emerald-400 block">MITIGATION: 99.4%</span>
          </div>
        </div>

        {/* TAB 1: LIVE VECTORS */}
        {activeTab === 'LIVE_VECTORS' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[10px] text-zinc-400">
              <span>PRIMARY EXPLOIT & DDOS VECTORS</span>
              <button onClick={handleSimulateAttack} className="text-cyan-400 hover:underline cursor-pointer">
                SIMULATE SPIKE
              </button>
            </div>

            <div className="space-y-1.5 text-[11px]">
              <div className="p-2 border border-zinc-800 bg-black/40 rounded-xs flex items-center justify-between">
                <div>
                  <span className="text-zinc-200 font-semibold">NTP / DNS AMPLIFICATION</span>
                  <span className="text-[10px] text-zinc-500 block">Volumetric reflection against Tier-1 transit</span>
                </div>
                <span className="text-rose-400 font-bold">42%</span>
              </div>
              <div className="p-2 border border-zinc-800 bg-black/40 rounded-xs flex items-center justify-between">
                <div>
                  <span className="text-zinc-200 font-semibold">BGP ROUTE HIJACKING PROBES</span>
                  <span className="text-[10px] text-zinc-500 block">AS-Path spoofing across autonomous systems</span>
                </div>
                <span className="text-amber-400 font-bold">28%</span>
              </div>
              <div className="p-2 border border-zinc-800 bg-black/40 rounded-xs flex items-center justify-between">
                <div>
                  <span className="text-zinc-200 font-semibold">SCADA / PLC PROTOCOL INJECTION</span>
                  <span className="text-[10px] text-zinc-500 block">Siemens S7 / Modbus port 502 scanning</span>
                </div>
                <span className="text-cyan-400 font-bold">18%</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: CVE ALERTS */}
        {activeTab === 'CVE_ALERTS' && (
          <div className="space-y-1.5">
            {CVE_LIST.map((cve) => (
              <div
                key={cve.cve}
                className={`p-2 border rounded-xs font-mono flex items-center justify-between ${
                  theme === 'dark' ? 'bg-zinc-950/60 border-zinc-800' : 'bg-white border-slate-200'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Bug className={`w-3.5 h-3.5 ${cve.severity === 'CRITICAL' ? 'text-rose-500' : 'text-amber-500'}`} />
                  <div>
                    <span className="font-bold text-zinc-100 block">{cve.cve}</span>
                    <span className="text-[10px] text-zinc-400">{cve.target}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[9px] px-1.5 py-0.5 border rounded-xs font-bold text-rose-300 bg-rose-950/60 border-rose-500/40">
                    CVSS {cve.cvss}
                  </span>
                  <span className="text-[9px] text-zinc-500 block mt-0.5">{cve.time}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 3: HEX STREAM */}
        {activeTab === 'HEX_STREAM' && (
          <div className="flex-1 bg-black p-2 rounded-xs border border-zinc-800 font-mono text-[9px] text-emerald-400 overflow-y-auto max-h-48 leading-relaxed space-y-0.5">
            {hexLogs.map((log, i) => (
              <div key={i} className="font-mono hover:text-cyan-300">
                {log}
              </div>
            ))}
          </div>
        )}

        {/* TAB 4: PORT MONITOR */}
        {activeTab === 'PORT_MONITOR' && (
          <div className="space-y-1.5 text-[11px]">
            <div className="p-2 border border-zinc-800 bg-black/40 rounded-xs flex justify-between">
              <span>PORT 22 (SSH)</span>
              <span className="text-emerald-400">BLOCKED 42,100 IP/HR</span>
            </div>
            <div className="p-2 border border-zinc-800 bg-black/40 rounded-xs flex justify-between">
              <span>PORT 502 (MODBUS)</span>
              <span className="text-rose-400">ISOLATED ENCLAVE</span>
            </div>
            <div className="p-2 border border-zinc-800 bg-black/40 rounded-xs flex justify-between">
              <span>PORT 443 (HTTPS)</span>
              <span className="text-cyan-400">WAF FILTERING ACTIVE</span>
            </div>
          </div>
        )}
      </div>
    </WidgetFrame>
  );
};
