import React from "react";
import { CheckSquare, AlertTriangle, Clock, CheckCircle2, Gauge, Wrench, Calendar, Info } from "lucide-react";
import { getTaskStatus, formatMiles } from "../data/fleetData";

export function TaskCard({ task, truckOdometer, onLogCompleted, onEditTask }) {
  const currentOdo = Number(truckOdometer) || 0;
  const lastServiced = Number(task.lastServicedMileage) || 0;
  const interval = Number(task.intervalMiles) || 1;
  const nextDue = Number(task.nextDueMileage) || (lastServiced + interval);

  // Exact math:
  // Remaining miles = next_due - current_mileage
  const remainingMiles = nextDue - currentOdo;
  const statusInfo = getTaskStatus(remainingMiles);

  // Wear / Elapsed miles towards next interval
  const elapsedMiles = Math.max(0, currentOdo - lastServiced);
  const wearPercent = Math.min(100, Math.max(0, Math.round((elapsedMiles / interval) * 100)));
  const isOverdue = remainingMiles < 0;
  const overdueMiles = Math.abs(remainingMiles);

  return (
    <div className={`rounded-xl border transition-all p-5 relative overflow-hidden bg-slate-900/90 ${statusInfo.borderGlow} hover:border-slate-600`}>
      
      {/* Top Bar: Title, Category & Status Badge */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 flex-wrap gap-y-1">
            <h4 className="text-base font-bold text-white group-hover:text-sky-300">
              {task.title}
            </h4>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700/60 font-medium">
              Every {formatMiles(interval)} mi
            </span>
            {task.category && (
              <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-md bg-sky-950/60 text-sky-400 border border-sky-800/40">
                {task.category}
              </span>
            )}
          </div>
          {task.notes && (
            <p className="text-xs text-slate-400 line-clamp-2 mt-0.5">
              {task.notes}
            </p>
          )}
        </div>

        {/* Status Badge (Exact user specification) */}
        <div className="flex items-center space-x-2 self-start">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide shadow-sm ${statusInfo.badgeClass}`}>
            <span className={`w-2 h-2 rounded-full ${statusInfo.dotClass} ${isOverdue ? "animate-ping" : ""}`} />
            {statusInfo.label}
          </span>
        </div>
      </div>

      {/* Mileage Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 my-4 p-3 rounded-lg bg-slate-950/70 border border-slate-800/70 text-xs font-mono">
        <div>
          <span className="text-[10px] text-slate-400 block font-sans">Last Serviced</span>
          <span className="text-slate-200 font-bold">{formatMiles(lastServiced)} mi</span>
        </div>
        <div>
          <span className="text-[10px] text-slate-400 block font-sans">Current Odometer</span>
          <span className="text-sky-400 font-bold">{formatMiles(currentOdo)} mi</span>
        </div>
        <div>
          <span className="text-[10px] text-slate-400 block font-sans">Next Due At</span>
          <span className="text-slate-200 font-bold">{formatMiles(nextDue)} mi</span>
        </div>
        <div>
          <span className="text-[10px] text-slate-400 block font-sans">Remaining Miles</span>
          <span className={`font-bold ${statusInfo.textColor}`}>
            {isOverdue ? `-${formatMiles(overdueMiles)} mi` : `${formatMiles(remainingMiles)} mi`}
          </span>
        </div>
      </div>

      {/* Wear & Interval Progress Bar */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center space-x-1.5 text-slate-400">
            <Gauge className="w-3.5 h-3.5 text-slate-400" />
            <span>Interval Wear:</span>
            <span className="font-mono text-slate-300 font-medium">
              {formatMiles(elapsedMiles)} / {formatMiles(interval)} mi ({wearPercent}%)
            </span>
          </div>
          
          <div className="font-mono text-xs font-bold">
            {isOverdue ? (
              <span className="text-rose-400 font-bold">
                Exceeded by {formatMiles(overdueMiles)} mi!
              </span>
            ) : remainingMiles <= 500 ? (
              <span className="text-amber-400">
                {formatMiles(remainingMiles)} mi until due
              </span>
            ) : (
              <span className="text-emerald-400">
                {formatMiles(remainingMiles)} mi remaining
              </span>
            )}
          </div>
        </div>

        {/* Progress Track */}
        <div className="w-full h-3 rounded-full bg-slate-950 p-0.5 border border-slate-800 overflow-hidden relative">
          {isOverdue ? (
            <div 
              className="h-full rounded-full stripe-red transition-all duration-500"
              style={{ width: "100%" }}
            />
          ) : remainingMiles <= 500 ? (
            <div 
              className="h-full rounded-full stripe-amber transition-all duration-500"
              style={{ width: `${wearPercent}%` }}
            />
          ) : (
            <div 
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500"
              style={{ width: `${wearPercent}%` }}
            />
          )}
        </div>
      </div>

      {/* Action Footer */}
      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
        <div className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span>Interval cycle: {formatMiles(interval)} mi</span>
        </div>

        {/* Log Completed Button */}
        <button
          onClick={() => onLogCompleted(task)}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-bold transition shadow-sm active:scale-95 ${
            isOverdue
              ? "bg-rose-600 hover:bg-rose-500 text-white shadow-rose-900/30"
              : remainingMiles <= 500
              ? "bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold shadow-amber-900/30"
              : "bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700"
          }`}
        >
          <CheckSquare className="w-4 h-4" />
          <span>Log Completed</span>
        </button>
      </div>

    </div>
  );
}
