import React from "react";
import { ArrowRight, Gauge, Clock, AlertCircle, CheckCircle2, Calendar } from "lucide-react";
import { formatMiles, formatTimestamp } from "../data/fleetData";

export function TruckCardHome({ truck, onOpenTruck, onUpdateMileage }) {
  // Aggregate tasks status for this truck
  let overdueCount = 0;
  let dueSoonCount = 0;
  let healthyCount = 0;

  (truck.tasks || []).forEach(task => {
    const rem = Number(task.nextDueMileage) - Number(truck.odometer);
    if (rem < 0) overdueCount++;
    else if (rem <= 500) dueSoonCount++;
    else healthyCount++;
  });

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-subtle hover:shadow-card transition-all duration-200 flex flex-col justify-between">
      
      {/* Top Header: Make/Model & Status Badges */}
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-black tracking-tight text-foreground hover:text-sky-600 transition cursor-pointer" onClick={() => onOpenTruck(truck.id)}>
              {truck.makeModel}
            </h3>
            <p className="text-xs text-muted-foreground font-mono mt-0.5">
              Unit {truck.unitNumber} {truck.vin ? `· VIN: ...${truck.vin.slice(-6)}` : ""}
            </p>
          </div>

          {/* Status Badge Pills matching fleet-fix-fast */}
          <div className="flex items-center gap-1.5 flex-wrap justify-end">
            {overdueCount > 0 && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-red-500/10 text-red-600 dark:bg-rose-500/20 dark:text-rose-400 border border-red-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                {overdueCount} OVERDUE
              </span>
            )}
            {dueSoonCount > 0 && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-300 border border-amber-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                {dueSoonCount} DUE SOON
              </span>
            )}
            {overdueCount === 0 && dueSoonCount === 0 && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                HEALTHY
              </span>
            )}
          </div>
        </div>

        {/* Big Mileage Reading */}
        <div className="pt-1">
          <div className="text-3xl font-black tracking-tight text-foreground font-mono">
            {formatMiles(truck.odometer)}{" "}
            <span className="text-sm font-semibold text-muted-foreground font-sans">mi</span>
          </div>

          {/* Check-in and Last Updated Subtitle */}
          <div className="flex items-center space-x-2 text-xs text-muted-foreground mt-1">
            <span className="flex items-center gap-1 font-medium text-foreground/80">
              <Clock className="w-3.5 h-3.5 text-muted-foreground" />
              Next check-in in {truck.checkInDays || 7} day(s)
            </span>
            <span>·</span>
            <span>{formatTimestamp(truck.lastUpdated)}</span>
          </div>
        </div>

        {/* Task Summary Breakdown Pill */}
        <div className="p-2.5 rounded-xl bg-muted/60 text-xs flex items-center justify-between text-muted-foreground">
          <span>Maintenance Status:</span>
          <span className="font-medium text-foreground">
            {overdueCount > 0 ? (
              <span className="text-red-600 dark:text-rose-400 font-bold">{overdueCount} task(s) overdue</span>
            ) : dueSoonCount > 0 ? (
              <span className="text-amber-600 dark:text-amber-400 font-bold">{dueSoonCount} task(s) due soon</span>
            ) : (
              <span className="text-emerald-600 dark:text-emerald-400 font-medium">All tasks up to date</span>
            )}
          </span>
        </div>
      </div>

      {/* Action Buttons Row */}
      <div className="mt-5 pt-3 border-t border-border flex items-center gap-2">
        <button
          onClick={() => onUpdateMileage(truck)}
          className="flex-1 py-2 px-3 rounded-xl border border-border bg-background hover:bg-muted font-bold text-xs text-foreground transition active:scale-98 flex items-center justify-center gap-1.5"
        >
          <Gauge className="w-3.5 h-3.5 text-muted-foreground" />
          <span>Update mileage</span>
        </button>

        <button
          onClick={() => onOpenTruck(truck.id)}
          className="flex-1 py-2 px-3 rounded-xl bg-primary text-primary-foreground hover:opacity-90 font-bold text-xs transition active:scale-98 flex items-center justify-center gap-1.5"
        >
          <span>Open truck</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

    </div>
  );
}
