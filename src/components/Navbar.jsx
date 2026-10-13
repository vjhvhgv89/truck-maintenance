import React from "react";
import { Truck, Plus, Download, RotateCcw, Sun, Moon, Radio } from "lucide-react";

export function Navbar({ 
  onAddTruck, 
  onExportCSV, 
  onResetData, 
  onSimulateTelematics, 
  activeTruck, 
  isDarkMode, 
  onToggleDarkMode,
  onNavigateHome
}) {
  return (
    <header className="border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-30">
      <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
        
        {/* Title branding matching fleet-fix-fast */}
        <div className="cursor-pointer" onClick={onNavigateHome}>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
            Fleet
          </p>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-foreground flex items-center gap-2">
            <span>Maintenance Tracker</span>
          </h1>
        </div>

        {/* Action Tools */}
        <div className="flex items-center space-x-2">
          
          {/* Quick Simulation Telematics for current truck */}
          {activeTruck && (
            <div className="hidden sm:flex items-center border border-border rounded-xl p-1 text-xs space-x-1 bg-background">
              <span className="px-1.5 text-muted-foreground flex items-center gap-1 font-medium text-[11px]">
                <Radio className="w-3 h-3 text-sky-500 animate-pulse" />
                Run:
              </span>
              <button
                onClick={() => onSimulateTelematics(100)}
                title="Advance 100 miles"
                className="px-1.5 py-0.5 hover:bg-muted text-sky-600 dark:text-sky-400 rounded font-mono font-medium text-xs transition"
              >
                +100m
              </button>
              <button
                onClick={() => onSimulateTelematics(500)}
                title="Advance 500 miles"
                className="px-1.5 py-0.5 hover:bg-muted text-amber-600 dark:text-amber-400 rounded font-mono font-medium text-xs transition"
              >
                +500m
              </button>
            </div>
          )}

          {/* Theme Switcher Toggle */}
          <button
            onClick={onToggleDarkMode}
            className="p-2 rounded-xl border border-border bg-background hover:bg-muted text-muted-foreground hover:text-foreground transition"
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Export Audit Log */}
          <button
            onClick={onExportCSV}
            className="hidden sm:flex items-center space-x-1.5 px-3 py-2 text-xs font-semibold rounded-xl border border-border bg-background hover:bg-muted text-foreground transition"
            title="Download CSV Maintenance Audit"
          >
            <Download className="w-3.5 h-3.5 text-muted-foreground" />
            <span>Export</span>
          </button>

          {/* Reset Data */}
          <button
            onClick={onResetData}
            className="p-2 text-xs rounded-xl border border-border bg-background hover:bg-muted text-muted-foreground hover:text-foreground transition"
            title="Reset dataset"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Add Truck Primary Action */}
          <button
            onClick={onAddTruck}
            className="flex items-center space-x-1 px-3.5 py-2 text-xs font-bold rounded-xl bg-primary text-primary-foreground hover:opacity-90 shadow-sm transition active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden xs:inline">Add truck</span>
          </button>

        </div>

      </div>
    </header>
  );
}
