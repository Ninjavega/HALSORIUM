import React, { useState, useEffect } from 'react';
import { WidgetInstance } from '../../types/widget';
import { WidgetFrame } from './WidgetFrame';
import { useDashboard } from '../../context/DashboardContext';
import { getThemeClasses } from '../../utils/themeStyles';
import { eventBus } from '../../services/eventBus';
import { soundFx } from '../../services/soundFx';
import { FileText, Save, Hash, Plus, Trash2 } from 'lucide-react';

interface Sitrep {
  id: string;
  time: string;
  hash: string;
  content: string;
}

export const IntelNotesWidget: React.FC<{ instance: WidgetInstance; index: number }> = ({ instance, index }) => {
  const { theme, accent } = useDashboard();
  const t = getThemeClasses(theme, accent);
  const [activeTab, setActiveTab] = useState<string>(instance.activeTab || 'ACTIVE_SITREP');

  const [notes, setNotes] = useState<string>(() => {
    try {
      return localStorage.getItem('worldmonitor_active_sitrep') || 
`// TACTICAL SITREP DRAFT - OPERATIONAL LOG
- Baltic GNSS interference confirmed between 0400Z and 0800Z.
- Naval convoy Bravo cleared through Strait of Hormuz.
- Cyber honeypots reporting increased Modbus probe frequency.`;
    } catch {
      return '';
    }
  });

  const [savedLogs, setSavedLogs] = useState<Sitrep[]>([
    {
      id: 'log-01',
      time: '2026-08-26 18:20 UTC',
      hash: 'sha256-a94f1c',
      content: 'Indo-Pacific ADIZ surveillance patrol completed 18 sorties.',
    },
  ]);

  const handleSave = () => {
    try {
      localStorage.setItem('worldmonitor_active_sitrep', notes);
    } catch {}

    const newLog: Sitrep = {
      id: `log-${Date.now()}`,
      time: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
      hash: `sha256-${Math.random().toString(36).substring(2, 8)}`,
      content: notes.substring(0, 80) + '...',
    };

    setSavedLogs((prev) => [newLog, ...prev]);
    soundFx.playDock();
    eventBus.publish('SITREP_SAVED_LOCAL', {
      title: 'Tactical sitrep archived to local storage',
      sourceWidgetId: instance.instanceId,
      payload: { hash: newLog.hash },
    });
  };

  return (
    <WidgetFrame instance={instance} activeTab={activeTab} onTabChange={setActiveTab} index={index}>
      <div className="flex-1 flex flex-col min-h-0 p-3 space-y-2 font-mono text-xs overflow-y-auto">
        {activeTab === 'ACTIVE_SITREP' ? (
          <>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="ENTER SITUATION LOG..."
              className={`flex-1 min-h-[140px] p-2 border rounded-xs font-mono text-xs outline-none resize-none leading-relaxed ${t.bgInput}`}
            />
            <div className="flex items-center justify-between pt-1">
              <span className="text-[10px] text-zinc-500">AUTO-SAVED TO LOCAL PWA STORAGE</span>
              <button
                onClick={handleSave}
                className={`px-3 py-1 text-xs font-bold border rounded-xs flex items-center gap-1.5 cursor-pointer ${t.accentBg} ${t.accentText} ${t.accentBorder}`}
              >
                <Save className="w-3.5 h-3.5" /> ARCHIVE SITREP
              </button>
            </div>
          </>
        ) : (
          <div className="space-y-1.5">
            {savedLogs.map((log) => (
              <div key={log.id} className="p-2 border border-zinc-800 bg-black/40 rounded-xs">
                <div className="flex justify-between text-[10px] text-zinc-500 mb-1">
                  <span>{log.time}</span>
                  <span className="text-cyan-400">{log.hash}</span>
                </div>
                <p className="text-zinc-300 text-xs">{log.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </WidgetFrame>
  );
};
