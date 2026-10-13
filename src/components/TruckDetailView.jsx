import React, { useState } from "react";
import { 
  ArrowLeft, 
  Gauge, 
  CheckSquare, 
  History, 
  Plus, 
  Wrench, 
  Clock, 
  Radio, 
  Calendar, 
  User, 
  Download,
  ShieldCheck,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { getTaskStatus, formatMiles, formatTimestamp } from "../data/fleetData";
import { ServiceHistoryTable } from "./ServiceHistoryTable";

export function TruckDetailView({ 
  truck, 
  onBackToFleet, 
  onUpdateMileage, 
  onLogCompleted, 
  onAddTask,
  onQuickSimulateMiles,
  onExportTruckLogs
}) {
  const [activeTab, setActiveTab] = useState("status"); // "status" | "history"

  if (!truck) return null;

  return (
    <div className="space-y-6">
      
      {/* Back to Fleet navigation link matching fleet-fix-fast */}
      <div>
        <button
          onClick={onBackToFleet}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground transition group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>Fleet</span>
        </button>
      </div>

      {/* Truck Header Card */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-subtle space-y-4">
        
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
              Unit {truck.unitNumber}
            </p>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground mt-1">
              {truck.makeModel}
            </h2>
            <p className="text-xs text-muted-foreground font-mono mt-1">
              VIN: {truck.vin} · {truck.driver ? `Driver: ${truck.driver} · ` : ""}{formatTimestamp(truck.lastUpdated)}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-3xl font-black tracking-tight text-foreground font-mono">
                {formatMiles(truck.odometer)}{" "}
                <span className="text-sm font-semibold text-muted-foreground font-sans">mi</span>
              </div>
              <p className="text-[11px] text-muted-foreground">Current Odometer</p>
            </div>

            <button
              onClick={() => onUpdateMileage(truck)}
              className="py-2.5 px-4 rounded-xl bg-primary text-primary-foreground font-bold text-xs hover:opacity-90 transition active:scale-95 flex items-center gap-1.5 shadow-sm"
            >
              <Gauge className="w-3.5 h-3.5" />
              <span>Update mileage</span>
            </button>
          </div>
        </div>

        {/* Real-time Telematics quick advance chips */}
        <div className="pt-3 border-t border-border flex items-center justify-between flex-wrap gap-2 text-xs">
          <div className="flex items-center space-x-2 text-muted-foreground">
            <Radio className="w-3.5 h-3.5 text-sky-500 animate-pulse" />
            <span className="text-xs font-medium">Simulate trip miles:</span>
            <div className="flex items-center space-x-1.5">
              <button
                onClick={() => onQuickSimulateMiles(100)}
                className="px-2 py-0.5 rounded-lg border border-border bg-background hover:bg-muted font-mono text-xs transition"
              >
                +100 mi
              </button>
              <button
                onClick={() => onQuickSimulateMiles(250)}
                className="px-2 py-0.5 rounded-lg border border-border bg-background hover:bg-muted font-mono text-xs transition"
              >
                +250 mi
              </button>
              <button
                onClick={() => onQuickSimulateMiles(500)}
                className="px-2 py-0.5 rounded-lg border border-border bg-background hover:bg-muted font-mono text-xs transition"
              >
                +500 mi
              </button>
              <button
                onClick={() => onQuickSimulateMiles(1200)}
                className="px-2 py-0.5 rounded-lg border border-border bg-background hover:bg-muted font-mono text-xs transition"
              >
                +1.2k mi
              </button>
            </div>
          </div>

          <div className="text-xs text-muted-foreground font-mono">
            {truck.terminal}
          </div>
        </div>

      </div>

      {/* Tabs Bar: Status vs History */}
      <div className="flex items-center justify-between border-b border-border pb-2">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActiveTab("status")}
            className={`py-2 px-4 rounded-xl font-bold text-xs transition flex items-center gap-1.5 ${
              activeTab === "status"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground bg-transparent"
            }`}
          >
            <Wrench className="w-3.5 h-3.5" />
            <span>Status ({truck.tasks?.length || 0})</span>
          </button>

          <button
            onClick={() => setActiveTab("history")}
            className={`py-2 px-4 rounded-xl font-bold text-xs transition flex items-center gap-1.5 ${
              activeTab === "history"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground bg-transparent"
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>History ({truck.serviceLogs?.length || 0})</span>
          </button>
        </div>

        {activeTab === "status" && (
          <button
            onClick={() => onAddTask(truck)}
            className="py-1.5 px-3 rounded-lg border border-border bg-background hover:bg-muted text-foreground font-semibold text-xs transition flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add task</span>
          </button>
        )}
      </div>

      {/* Tab 1: Status (Tasks List matching fleet-fix-fast) */}
      {activeTab === "status" && (
        <div className="space-y-4">
          {(truck.tasks || []).length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border p-12 text-center text-muted-foreground text-xs">
              No service tasks configured for this truck. Click "+ Add task" to define intervals.
            </div>
          ) : (
            truck.tasks.map(task => {
              const currentOdo = Number(truck.odometer) || 0;
              const lastServiced = Number(task.lastServicedMileage) || 0;
              const interval = Number(task.intervalMiles) || 1;
              const nextDue = Number(task.nextDueMileage) || (lastServiced + interval);

              // Real-time remaining miles
              const remainingMiles = nextDue - currentOdo;
              const statusInfo = getTaskStatus(remainingMiles);

              // Wear calculation
              const elapsedMiles = Math.max(0, currentOdo - lastServiced);
              const wearPercent = Math.min(100, Math.max(0, Math.round((elapsedMiles / interval) * 100)));
              const isOverdue = remainingMiles < 0;
              const overdueMiles = Math.abs(remainingMiles);

              return (
                <div
                  key={task.id}
                  className="rounded-2xl border border-border bg-card p-5 shadow-subtle hover:shadow-card transition-all space-y-4"
                >
                  {/* Task Header: Title & Badges */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-base font-black text-foreground">
                          {task.title}
                        </h4>
                        <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-muted text-muted-foreground font-medium">
                          Every {formatMiles(interval)} mi
                        </span>
                      </div>
                      {task.notes && (
                        <p className="text-xs text-muted-foreground">
                          {task.notes}
                        </p>
                      )}
                    </div>

                    {/* Status Pill Badge (Exact user specification) */}
                    <div>
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${statusInfo.badgeClass}`}>
                        <span className={`w-2 h-2 rounded-full ${statusInfo.dotClass} ${isOverdue ? "animate-ping" : ""}`} />
                        {statusInfo.label}
                      </span>
                    </div>
                  </div>

                  {/* Dynamic Status line matching fleet-fix-fast */}
                  <div className="text-xs font-medium">
                    {isOverdue ? (
                      <span className="text-red-600 dark:text-rose-400 font-bold">
                        OVERDUE by {formatMiles(overdueMiles)} mi · was due at {formatMiles(nextDue)} mi
                      </span>
                    ) : remainingMiles <= 500 ? (
                      <span className="text-amber-600 dark:text-amber-400 font-bold">
                        {formatMiles(remainingMiles)} mi left · due at {formatMiles(nextDue)} mi
                      </span>
                    ) : (
                      <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                        {formatMiles(remainingMiles)} mi left · due at {formatMiles(nextDue)} mi
                      </span>
                    )}
                  </div>

                  {/* Wear Progress Bar */}
                  <div className="space-y-1.5">
                    <div className="w-full h-2.5 rounded-full bg-muted overflow-hidden relative">
                      {isOverdue ? (
                        <div 
                          className="h-full rounded-full stripe-red"
                          style={{ width: "100%" }}
                        />
                      ) : remainingMiles <= 500 ? (
                        <div 
                          className="h-full rounded-full stripe-amber"
                          style={{ width: `${wearPercent}%` }}
                        />
                      ) : (
                        <div 
                          className="h-full rounded-full bg-emerald-500"
                          style={{ width: `${wearPercent}%` }}
                        />
                      )}
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-muted-foreground font-mono">
                      <span>Last: {formatMiles(lastServiced)} mi</span>
                      <span>Wear: {wearPercent}%</span>
                      <span>Next: {formatMiles(nextDue)} mi</span>
                    </div>
                  </div>

                  {/* Action Row: Log Completed Button */}
                  <div className="pt-2 border-t border-border flex items-center justify-end">
                    <button
                      onClick={() => onLogCompleted(task)}
                      className="py-2 px-4 rounded-xl border border-border bg-background hover:bg-muted font-bold text-xs text-foreground transition active:scale-95 flex items-center gap-1.5 shadow-sm"
                    >
                      <CheckSquare className="w-3.5 h-3.5 text-muted-foreground" />
                      <span>Log completed</span>
                    </button>
                  </div>

                </div>
              );
            })
          )}
        </div>
      )}

      {/* Tab 2: History (Service Log history) */}
      {activeTab === "history" && (
        <ServiceHistoryTable
          logs={truck.serviceLogs || []}
          truckUnit={truck.unitNumber}
          onExportTruckLogs={onExportTruckLogs}
        />
      )}

    </div>
  );
}
