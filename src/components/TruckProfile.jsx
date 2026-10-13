import React, { useState } from "react";
import { 
  Gauge, 
  RefreshCw, 
  Plus, 
  Wrench, 
  History, 
  Sliders, 
  Copy, 
  Check, 
  MapPin, 
  User, 
  Calendar, 
  Truck, 
  Radio, 
  AlertTriangle,
  FileCheck
} from "lucide-react";
import { TaskCard } from "./TaskCard";
import { ServiceHistoryTable } from "./ServiceHistoryTable";
import { formatMiles, formatTimestamp } from "../data/fleetData";

export function TruckProfile({ 
  truck, 
  onSyncOdometerClick, 
  onLogCompletedClick, 
  onAddTaskClick,
  onQuickSimulateMiles,
  onExportTruckCSV 
}) {
  const [activeTab, setActiveTab] = useState("tasks"); // "tasks" | "history" | "specs"
  const [copiedVin, setCopiedVin] = useState(false);
  const [inlineOdo, setInlineOdo] = useState("");
  const [isEditingInlineOdo, setIsEditingInlineOdo] = useState(false);

  if (!truck) {
    return (
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-12 text-center text-slate-400">
        <Truck className="w-12 h-12 mx-auto text-slate-600 mb-3" />
        <h3 className="text-base font-bold text-white">No Truck Selected</h3>
        <p className="text-xs text-slate-400 mt-1">Select a truck from the roster to view maintenance status.</p>
      </div>
    );
  }

  const handleCopyVin = () => {
    navigator.clipboard.writeText(truck.vin);
    setCopiedVin(true);
    setTimeout(() => setCopiedVin(false), 2000);
  };

  const handleInlineOdoSubmit = (e) => {
    e.preventDefault();
    const val = Number(inlineOdo);
    if (val > 0) {
      onQuickSimulateMiles(val - truck.odometer);
      setIsEditingInlineOdo(false);
      setInlineOdo("");
    }
  };

  // Status aggregation for this specific truck
  let overdueCount = 0;
  let dueSoonCount = 0;
  let goodCount = 0;

  truck.tasks.forEach(t => {
    const rem = t.nextDueMileage - truck.odometer;
    if (rem < 0) overdueCount++;
    else if (rem <= 500) dueSoonCount++;
    else goodCount++;
  });

  return (
    <div className="space-y-6">
      
      {/* Truck Profile Header Card */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 sm:p-6 shadow-xl relative overflow-hidden">
        
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-48 h-48 rounded-full bg-sky-500/5 blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          
          {/* Left: Unit Number, Make/Model, VIN, Specs */}
          <div className="space-y-2">
            <div className="flex items-center space-x-3 flex-wrap gap-y-2">
              <span className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight">
                {truck.unitNumber}
              </span>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-sky-500/15 text-sky-400 border border-sky-500/30">
                {truck.makeModel}
              </span>
              <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700/60">
                {truck.terminal}
              </span>
            </div>

            {/* VIN & Driver details */}
            <div className="flex items-center space-x-4 text-xs text-slate-400 flex-wrap gap-y-1">
              <div className="flex items-center space-x-1.5 font-mono">
                <span className="text-slate-500 font-sans">VIN:</span>
                <span className="text-slate-300 font-medium">{truck.vin}</span>
                <button
                  onClick={handleCopyVin}
                  className="text-slate-500 hover:text-sky-400 transition ml-1"
                  title="Copy VIN"
                >
                  {copiedVin ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              <span>•</span>

              <div className="flex items-center space-x-1">
                <User className="w-3.5 h-3.5 text-slate-500" />
                <span className="text-slate-300">{truck.driver || "Unassigned"}</span>
                {truck.driverPhone && <span className="text-slate-500">({truck.driverPhone})</span>}
              </div>

              <span>•</span>

              <div className="flex items-center space-x-1">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                <span>Last Synced: <strong className="text-slate-300 font-normal">{formatTimestamp(truck.lastUpdated)}</strong></span>
              </div>
            </div>
          </div>

          {/* Right: Current Odometer Card & Sync Action */}
          <div className="flex items-center space-x-3 flex-wrap sm:flex-nowrap">
            
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex-1 sm:flex-initial min-w-[210px]">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span className="flex items-center gap-1 font-medium">
                  <Gauge className="w-3.5 h-3.5 text-sky-400" />
                  Current Odometer
                </span>
                <span className="text-[10px] text-emerald-400 font-medium">Live Telematics</span>
              </div>

              <div className="flex items-baseline space-x-2">
                <span className="text-2xl font-black text-sky-400 font-mono tracking-tight">
                  {formatMiles(truck.odometer)}
                </span>
                <span className="text-xs font-mono text-slate-400 font-medium">miles</span>
              </div>
            </div>

            {/* Sync Odometer Button */}
            <button
              onClick={() => onSyncOdometerClick(truck)}
              className="flex items-center space-x-2 px-4 py-3 rounded-xl bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-sky-950/50 transition active:scale-95"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Sync Odometer</span>
            </button>

          </div>

        </div>

        {/* Real-time Telematics quick advance chips */}
        <div className="mt-4 pt-3 border-t border-slate-800/70 flex items-center justify-between flex-wrap gap-2 text-xs">
          <div className="flex items-center space-x-2 text-slate-400">
            <Radio className="w-3.5 h-3.5 text-sky-400 animate-pulse" />
            <span>Simulate Mileage Shift:</span>
            <div className="flex items-center space-x-1.5">
              <button
                onClick={() => onQuickSimulateMiles(100)}
                className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-sky-300 font-mono text-xs transition"
              >
                +100 mi
              </button>
              <button
                onClick={() => onQuickSimulateMiles(250)}
                className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-sky-300 font-mono text-xs transition"
              >
                +250 mi
              </button>
              <button
                onClick={() => onQuickSimulateMiles(500)}
                className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-amber-300 font-mono text-xs transition"
              >
                +500 mi
              </button>
              <button
                onClick={() => onQuickSimulateMiles(1200)}
                className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-rose-300 font-mono text-xs transition"
              >
                +1,200 mi
              </button>
            </div>
          </div>

          {/* Quick status summary */}
          <div className="flex items-center space-x-2 text-xs">
            {overdueCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-400 font-bold border border-rose-500/30">
                {overdueCount} Overdue
              </span>
            )}
            {dueSoonCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 font-bold border border-amber-500/30">
                {dueSoonCount} Due Soon
              </span>
            )}
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 font-medium">
              {goodCount} Normal
            </span>
          </div>
        </div>

      </div>

      {/* Tabs Switcher & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        
        <div className="flex items-center space-x-2">
          
          <button
            onClick={() => setActiveTab("tasks")}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === "tasks"
                ? "bg-sky-600 text-white shadow-md shadow-sky-950/40"
                : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
            }`}
          >
            <Wrench className="w-3.5 h-3.5" />
            <span>Maintenance Tasks ({truck.tasks.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("history")}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === "history"
                ? "bg-sky-600 text-white shadow-md shadow-sky-950/40"
                : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Service History ({truck.serviceLogs.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("specs")}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === "specs"
                ? "bg-sky-600 text-white shadow-md shadow-sky-950/40"
                : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Specs & Diagnostics</span>
          </button>

        </div>

        {/* Tab-specific actions */}
        {activeTab === "tasks" && (
          <button
            onClick={() => onAddTaskClick(truck)}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-slate-850 hover:bg-slate-800 text-sky-400 border border-sky-500/30 transition self-start sm:self-auto"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Maintenance Task</span>
          </button>
        )}

      </div>

      {/* Tab 1: Maintenance Tasks View */}
      {activeTab === "tasks" && (
        <div className="space-y-4">
          {truck.tasks.length === 0 ? (
            <div className="bg-slate-900/60 rounded-xl border border-dashed border-slate-800 p-8 text-center text-slate-400 text-xs">
              No maintenance tasks assigned to this truck yet. Click "Add Maintenance Task" to define intervals.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {truck.tasks.map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  truckOdometer={truck.odometer}
                  onLogCompleted={onLogCompletedClick}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Service History View */}
      {activeTab === "history" && (
        <ServiceHistoryTable
          logs={truck.serviceLogs || []}
          truckUnit={truck.unitNumber}
          onExportTruckLogs={onExportTruckCSV}
        />
      )}

      {/* Tab 3: Specs & Telematics Diagnostics */}
      {activeTab === "specs" && (
        <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                Vehicle Telematics & Powertrain Specifications
              </h4>
              <p className="text-xs text-slate-400">Unit identification and engineering specs for mechanics</p>
            </div>
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              ELD Connected
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-slate-400 text-[11px] block">Powertrain Engine</span>
              <span className="text-white font-bold text-sm block">{truck.engine || "Detroit DD15 Turbo Diesel"}</span>
              <span className="text-slate-500 text-[10px]">EPA 2024 Greenhouse Gas Compliant</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-slate-400 text-[11px] block">Transmission</span>
              <span className="text-white font-bold text-sm block">{truck.transmission || "Automated Manual 12-Speed"}</span>
              <span className="text-slate-500 text-[10px]">Electronic Clutch Actuator</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-slate-400 text-[11px] block">Assigned Logistics Terminal</span>
              <span className="text-white font-bold text-sm block">{truck.terminal}</span>
              <span className="text-slate-500 text-[10px]">Home Depot / Amazon Freight Lanes</span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono p-4 rounded-xl bg-slate-950/60 border border-slate-800">
            <div>
              <span className="text-slate-500 text-[10px] block font-sans">Gross Vehicle Weight (GVWR)</span>
              <span className="text-slate-200 font-bold">80,000 lbs (Class 8)</span>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] block font-sans">Tire Configuration</span>
              <span className="text-slate-200 font-bold">295/75R22.5 Low Pro</span>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] block font-sans">DOT Annual Inspection</span>
              <span className="text-emerald-400 font-bold">Valid through Dec 2026</span>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] block font-sans">Telematics Firmware</span>
              <span className="text-sky-400 font-bold">v4.8.1-OTA</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
