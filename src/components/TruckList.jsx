import React, { useState } from "react";
import { Search, ChevronRight, AlertCircle, Clock, CheckCircle2, ShieldAlert } from "lucide-react";
import { formatMiles, formatTimestamp } from "../data/fleetData";

export function TruckList({ trucks, selectedTruckId, onSelectTruck, activeFilter }) {
  const [searchQuery, setSearchQuery] = useState("");

  // Filter trucks based on search and active filter
  const filteredTrucks = trucks.filter(truck => {
    // Search match
    const q = searchQuery.toLowerCase();
    const matchesSearch = 
      truck.unitNumber.toLowerCase().includes(q) ||
      truck.vin.toLowerCase().includes(q) ||
      truck.makeModel.toLowerCase().includes(q) ||
      (truck.driver && truck.driver.toLowerCase().includes(q));

    if (!matchesSearch) return false;

    // Status filter match
    if (activeFilter === "all") return true;

    const hasOverdue = truck.tasks.some(t => (t.nextDueMileage - truck.odometer) < 0);
    const hasDueSoon = truck.tasks.some(t => {
      const rem = t.nextDueMileage - truck.odometer;
      return rem >= 0 && rem <= 500;
    });

    if (activeFilter === "overdue") return hasOverdue;
    if (activeFilter === "due_soon") return hasDueSoon;
    if (activeFilter === "good") return !hasOverdue && !hasDueSoon;

    return true;
  });

  return (
    <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-4 flex flex-col h-full shadow-lg">
      
      {/* Header & Search */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
        <div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Fleet Roster</h3>
          <p className="text-xs text-slate-400">
            {filteredTrucks.length} of {trucks.length} Units Visible
          </p>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative mt-3 mb-3">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Filter by Unit #, VIN, driver..."
          className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500 hover:text-slate-300"
          >
            ×
          </button>
        )}
      </div>

      {/* Trucks Scrollable List */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1 -mr-1 max-h-[580px] sm:max-h-[640px]">
        {filteredTrucks.length === 0 ? (
          <div className="text-center py-10 px-4 text-slate-500 text-xs">
            No trucks match the current filter criteria.
          </div>
        ) : (
          filteredTrucks.map(truck => {
            const isSelected = truck.id === selectedTruckId;
            
            // Check status of tasks for this truck
            let overdueCount = 0;
            let dueSoonCount = 0;
            
            truck.tasks.forEach(t => {
              const rem = t.nextDueMileage - truck.odometer;
              if (rem < 0) overdueCount++;
              else if (rem <= 500) dueSoonCount++;
            });

            return (
              <div
                key={truck.id}
                onClick={() => onSelectTruck(truck.id)}
                className={`group cursor-pointer rounded-xl p-3 border transition-all text-left relative overflow-hidden ${
                  isSelected
                    ? "bg-slate-850/90 border-sky-500/70 ring-1 ring-sky-500/30 shadow-md shadow-sky-500/10"
                    : "bg-slate-950/60 border-slate-850 hover:bg-slate-850/60 hover:border-slate-700"
                }`}
              >
                {/* Active selection accent line */}
                {isSelected && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-sky-400 to-blue-600" />
                )}

                <div className="flex items-start justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center space-x-2">
                      <span className="font-extrabold text-sm text-white font-mono tracking-tight group-hover:text-sky-300 transition">
                        {truck.unitNumber}
                      </span>
                      
                      {/* Overdue/Due Badges */}
                      {overdueCount > 0 ? (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">
                          <AlertCircle className="w-3 h-3" />
                          {overdueCount} Overdue
                        </span>
                      ) : dueSoonCount > 0 ? (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          <Clock className="w-3 h-3" />
                          {dueSoonCount} Due Soon
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-500/15 text-emerald-400">
                          <CheckCircle2 className="w-3 h-3" />
                          OK
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-300 font-medium truncate max-w-[190px]">
                      {truck.makeModel}
                    </p>
                    
                    <p className="text-[11px] text-slate-400 truncate max-w-[190px]">
                      {truck.driver || "Unassigned"} • {truck.terminal}
                    </p>
                  </div>

                  <div className="text-right flex flex-col items-end">
                    <span className="text-xs font-mono font-bold text-slate-100">
                      {formatMiles(truck.odometer)} <span className="text-[10px] font-normal text-slate-400">mi</span>
                    </span>
                    <span className="text-[10px] text-slate-400 mt-1">
                      {formatTimestamp(truck.lastUpdated)}
                    </span>
                  </div>
                </div>

                {/* Micro progress status indicators */}
                <div className="mt-2 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="font-mono text-[10px] text-slate-400 truncate">
                    VIN: {truck.vin ? `...${truck.vin.slice(-6)}` : "N/A"}
                  </span>
                  <span className="text-slate-400 group-hover:text-sky-400 transition flex items-center text-[10px]">
                    Manage <ChevronRight className="w-3 h-3 ml-0.5" />
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
}
