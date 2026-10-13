import React from "react";
import { Truck, AlertTriangle, Clock, CheckCircle2, ShieldAlert } from "lucide-react";
import { formatMiles } from "../data/fleetData";

export function DashboardSummary({ trucks, activeFilter, onFilterChange }) {
  const totalTrucks = trucks.length;
  
  let totalTasks = 0;
  let totalOverdue = 0;
  let totalDueSoon = 0;
  let totalHealthy = 0;
  let totalMiles = 0;

  trucks.forEach(truck => {
    totalMiles += Number(truck.odometer) || 0;
    (truck.tasks || []).forEach(task => {
      totalTasks++;
      const remaining = Number(task.nextDueMileage) - Number(truck.odometer);
      if (remaining < 0) {
        totalOverdue++;
      } else if (remaining <= 500) {
        totalDueSoon++;
      } else {
        totalHealthy++;
      }
    });
  });

  const complianceRate = totalTasks > 0 ? Math.round(((totalTasks - totalOverdue) / totalTasks) * 100) : 100;

  return (
    <div className="space-y-4">
      
      {/* Overdue Alert Banner if any task is overdue */}
      {totalOverdue > 0 && (
        <div className="p-4 rounded-2xl border border-red-500/30 bg-red-500/10 dark:bg-rose-950/30 flex items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-red-500/20 text-red-600 dark:text-rose-400 flex items-center justify-center flex-shrink-0">
              <ShieldAlert className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-red-700 dark:text-rose-300">
                Action Required: {totalOverdue} Service {totalOverdue === 1 ? "Task" : "Tasks"} Overdue
              </h4>
              <p className="text-[11px] text-red-600/90 dark:text-rose-200/70 mt-0.5">
                Vehicles have exceeded their maintenance interval. Schedule shop service to prevent breakdown.
              </p>
            </div>
          </div>
          <button
            onClick={() => onFilterChange("overdue")}
            className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition shadow-sm flex-shrink-0"
          >
            Show overdue
          </button>
        </div>
      )}

      {/* Summary KPI Pills Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        
        {/* Total Trucks */}
        <div 
          onClick={() => onFilterChange("all")}
          className={`cursor-pointer rounded-2xl border p-4 transition-all ${
            activeFilter === "all"
              ? "border-foreground bg-card ring-1 ring-foreground/20 shadow-subtle"
              : "border-border bg-card/60 hover:border-border hover:bg-card"
          }`}
        >
          <div className="flex items-center justify-between text-muted-foreground text-xs font-medium">
            <span>Fleet Trucks</span>
            <Truck className="w-3.5 h-3.5" />
          </div>
          <div className="mt-2 text-2xl font-black tracking-tight text-foreground font-mono">
            {totalTrucks}
          </div>
          <div className="text-[10px] text-muted-foreground mt-0.5 font-mono">
            {formatMiles(totalMiles)} total mi
          </div>
        </div>

        {/* Overdue Tasks */}
        <div 
          onClick={() => onFilterChange("overdue")}
          className={`cursor-pointer rounded-2xl border p-4 transition-all ${
            activeFilter === "overdue"
              ? "border-red-500 bg-red-500/10 ring-1 ring-red-500/20 shadow-subtle"
              : "border-border bg-card/60 hover:border-red-500/30 hover:bg-card"
          }`}
        >
          <div className="flex items-center justify-between text-muted-foreground text-xs font-medium">
            <span>Overdue Tasks</span>
            <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
          </div>
          <div className={`mt-2 text-2xl font-black tracking-tight font-mono ${totalOverdue > 0 ? "text-red-600 dark:text-rose-400" : "text-foreground"}`}>
            {totalOverdue}
          </div>
          <div className="text-[10px] text-red-600 dark:text-rose-400 mt-0.5 font-medium">
            &lt; 0 mi remaining
          </div>
        </div>

        {/* Due Soon */}
        <div 
          onClick={() => onFilterChange("due_soon")}
          className={`cursor-pointer rounded-2xl border p-4 transition-all ${
            activeFilter === "due_soon"
              ? "border-amber-500 bg-amber-500/10 ring-1 ring-amber-500/20 shadow-subtle"
              : "border-border bg-card/60 hover:border-amber-500/30 hover:bg-card"
          }`}
        >
          <div className="flex items-center justify-between text-muted-foreground text-xs font-medium">
            <span>Upcoming Due</span>
            <Clock className="w-3.5 h-3.5 text-amber-500" />
          </div>
          <div className="mt-2 text-2xl font-black tracking-tight text-amber-600 dark:text-amber-400 font-mono">
            {totalDueSoon}
          </div>
          <div className="text-[10px] text-amber-600 dark:text-amber-400 mt-0.5 font-medium">
            0 to 500 mi remaining
          </div>
        </div>

        {/* Healthy */}
        <div 
          onClick={() => onFilterChange("good")}
          className={`cursor-pointer rounded-2xl border p-4 transition-all ${
            activeFilter === "good"
              ? "border-emerald-500 bg-emerald-500/10 ring-1 ring-emerald-500/20 shadow-subtle"
              : "border-border bg-card/60 hover:border-emerald-500/30 hover:bg-card"
          }`}
        >
          <div className="flex items-center justify-between text-muted-foreground text-xs font-medium">
            <span>Healthy Status</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
          </div>
          <div className="mt-2 text-2xl font-black tracking-tight text-emerald-600 dark:text-emerald-400 font-mono">
            {totalHealthy}
          </div>
          <div className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-0.5 font-medium">
            &gt; 500 mi ({complianceRate}% fleet OK)
          </div>
        </div>

      </div>

      {/* Filter Tabs matching sample app */}
      <div className="flex items-center justify-between flex-wrap gap-2 pt-1">
        <div className="flex items-center space-x-1 p-1 rounded-xl bg-muted/60 text-xs">
          <button
            onClick={() => onFilterChange("all")}
            className={`px-3 py-1.5 rounded-lg font-bold transition ${
              activeFilter === "all"
                ? "bg-card text-foreground shadow-subtle"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            All trucks ({totalTrucks})
          </button>

          <button
            onClick={() => onFilterChange("overdue")}
            className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1 ${
              activeFilter === "overdue"
                ? "bg-card text-red-600 dark:text-rose-400 shadow-subtle"
                : "text-muted-foreground hover:text-red-600"
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
            Overdue ({trucks.filter(t => (t.tasks || []).some(k => (k.nextDueMileage - t.odometer) < 0)).length})
          </button>

          <button
            onClick={() => onFilterChange("due_soon")}
            className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1 ${
              activeFilter === "due_soon"
                ? "bg-card text-amber-600 dark:text-amber-400 shadow-subtle"
                : "text-muted-foreground hover:text-amber-600"
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            Due soon ({trucks.filter(t => (t.tasks || []).some(k => {
              const r = k.nextDueMileage - t.odometer;
              return r >= 0 && r <= 500;
            })).length})
          </button>

          <button
            onClick={() => onFilterChange("good")}
            className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1 ${
              activeFilter === "good"
                ? "bg-card text-emerald-600 dark:text-emerald-400 shadow-subtle"
                : "text-muted-foreground hover:text-emerald-600"
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Healthy
          </button>
        </div>

        <div className="text-xs text-muted-foreground font-mono">
          Fleet Health: <span className="font-bold text-foreground">{complianceRate}%</span>
        </div>
      </div>

    </div>
  );
}
