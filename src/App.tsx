/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { DashboardProvider, useDashboard } from './context/DashboardContext';
import { getThemeClasses } from './utils/themeStyles';
import { Header } from './components/layout/Header';
import { StatusBar } from './components/layout/StatusBar';
import { WidgetRenderer } from './components/widgets/WidgetRenderer';
import { WidgetCatalogModal } from './components/layout/WidgetCatalogModal';
import { ExtensibilityModal } from './components/layout/ExtensibilityModal';
import { Plus, ShieldAlert, Layers, RotateCcw } from 'lucide-react';
import { soundFx } from './services/soundFx';

const DashboardView: React.FC = () => {
  const {
    theme,
    accent,
    scanlines,
    gridOverlay,
    widgets,
    setIsCatalogOpen,
    resetAllWidgets,
  } = useDashboard();

  const t = getThemeClasses(theme, accent);

  return (
    <div
      id="dashboard-root"
      className={`min-h-screen flex flex-col relative transition-colors duration-200 ${t.bgMain} ${t.textPrimary} font-sans`}
    >
      {/* Background Grid Pattern Overlay */}
      {gridOverlay && (
        <div
          aria-hidden="true"
          className={`fixed inset-0 pointer-events-none z-0 ${
            theme === 'dark' ? 'hud-grid-dark opacity-60' : 'hud-grid-light opacity-80'
          }`}
        />
      )}

      {/* Futuristic CRT Scanlines Overlay */}
      {scanlines && (
        <div
          aria-hidden="true"
          className={`fixed inset-0 pointer-events-none z-30 ${
            theme === 'dark' ? 'hud-scanlines' : 'hud-scanlines-light'
          }`}
        />
      )}

      {/* Top HUD Header */}
      <Header />

      {/* MAIN DASHBOARD CANVAS / TILE GRID */}
      <main
        id="tactical-widgets-canvas"
        className="flex-1 p-3 sm:p-4 max-w-[1920px] w-full mx-auto relative z-10"
      >
        {widgets.length === 0 ? (
          /* Empty Dashboard State */
          <div className="flex flex-col items-center justify-center min-h-[500px] border border-dashed border-zinc-800 rounded-xs p-8 text-center font-mono space-y-4">
            <div className={`p-4 rounded-full ${t.accentBg} ${t.accentText}`}>
              <ShieldAlert className="w-10 h-10 animate-pulse" />
            </div>
            <div className="space-y-1">
              <h2 className="text-base font-bold tracking-widest text-zinc-100">
                TACTICAL HUD TILES CLEARED
              </h2>
              <p className="text-xs text-zinc-400 max-w-md">
                No active situation windows are currently mounted on your dashboard. Open the catalog to deploy widgets or restore the default Global Command layout.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => {
                  soundFx.playClick(1200);
                  setIsCatalogOpen(true);
                }}
                className={`px-4 py-2 text-xs font-bold border rounded-xs flex items-center gap-2 cursor-pointer ${t.accentBg} ${t.accentText} ${t.accentBorder} hover:scale-105`}
              >
                <Plus className="w-4 h-4" /> BROWSE WIDGET CATALOG
              </button>
              <button
                onClick={resetAllWidgets}
                className="px-4 py-2 text-xs font-bold border border-zinc-700 bg-zinc-900 text-zinc-300 hover:text-white rounded-xs flex items-center gap-2 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" /> RESTORE DEFAULT HQ LAYOUT
              </button>
            </div>
          </div>
        ) : (
          /* Responsive 12-Column Tile Grid */
          <div className="grid grid-cols-12 gap-3 items-start">
            {widgets.map((instance, index) => (
              <WidgetRenderer
                key={instance.instanceId}
                instance={instance}
                index={index}
              />
            ))}
          </div>
        )}
      </main>

      {/* Bottom Tactical Telemetry Status Bar */}
      <StatusBar />

      {/* Modals */}
      <WidgetCatalogModal />
      <ExtensibilityModal />
    </div>
  );
};

export default function App() {
  return (
    <DashboardProvider>
      <DashboardView />
    </DashboardProvider>
  );
}
