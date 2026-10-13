import React, { useState } from "react";
import { ShieldCheck, Search, Calendar, UserCheck, Wrench, Download, CheckCircle } from "lucide-react";
import { formatMiles } from "../data/fleetData";

export function ServiceHistoryTable({ logs, truckUnit, onExportTruckLogs }) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredLogs = logs.filter(log => {
    const q = searchTerm.toLowerCase();
    return (
      log.taskTitle.toLowerCase().includes(q) ||
      (log.technician && log.technician.toLowerCase().includes(q)) ||
      (log.workOrder && log.workOrder.toLowerCase().includes(q)) ||
      (log.notes && log.notes.toLowerCase().includes(q)) ||
      (log.completedDate && log.completedDate.includes(q))
    );
  });

  return (
    <div className="space-y-4">
      {/* Top Filter & Audit Stamp */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-card p-4 rounded-2xl border border-border">
        <div>
          <div className="flex items-center space-x-2">
            <h4 className="text-xs font-black uppercase tracking-wider text-foreground">
              Immutable Service History
            </h4>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 border border-emerald-500/20">
              <ShieldCheck className="w-3 h-3" />
              Audit Logged
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Maintenance completion records for Unit {truckUnit}.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {/* Search bar */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-muted-foreground absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search history..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-background border border-border rounded-xl pl-8 pr-3 py-1.5 text-xs text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Export button */}
          <button
            onClick={onExportTruckLogs}
            className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-bold rounded-xl border border-border bg-background hover:bg-muted text-foreground transition"
            title="Download CSV log for Unit"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>
      </div>

      {/* Log Entries */}
      {filteredLogs.length === 0 ? (
        <div className="text-center py-12 rounded-2xl border border-dashed border-border bg-card/40 p-6">
          <Wrench className="w-8 h-8 text-muted-foreground mx-auto mb-2 opacity-50" />
          <p className="text-xs text-foreground font-bold">No maintenance history recorded yet.</p>
          <p className="text-[11px] text-muted-foreground mt-1">
            Completed service tasks logged using "Log completed" will permanently display here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredLogs.map((log, idx) => (
            <div
              key={log.id || idx}
              className="rounded-2xl border border-border bg-card p-4 shadow-subtle hover:shadow-card transition-all space-y-3"
            >
              {/* Row 1: Task Title, Work Order, Completed Mileage */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2 flex-wrap">
                    <span className="text-sm font-black text-foreground flex items-center gap-1.5">
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                      {log.taskTitle}
                    </span>
                    {log.workOrder && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-muted text-muted-foreground font-semibold">
                        {log.workOrder}
                      </span>
                    )}
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                      Verified
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-3 text-xs text-muted-foreground flex-wrap gap-y-1">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                      {log.completedDate}
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <UserCheck className="w-3.5 h-3.5 text-muted-foreground" />
                      {log.technician}
                    </span>
                  </div>
                </div>

                {/* Completed Odometer Badge */}
                <div className="text-left sm:text-right self-start">
                  <div className="inline-block px-3 py-1 rounded-xl bg-muted border border-border text-xs font-mono">
                    <span className="text-[10px] text-muted-foreground block font-sans">Completed at</span>
                    <span className="text-foreground font-black text-sm">
                      {formatMiles(log.completedMileage)} mi
                    </span>
                  </div>
                </div>
              </div>

              {/* Row 2: Technician Notes */}
              {log.notes && (
                <div className="p-3 rounded-xl bg-muted/60 border border-border text-xs text-foreground">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-0.5">
                    Service Notes:
                  </span>
                  <p className="leading-relaxed">{log.notes}</p>
                </div>
              )}

              {/* Row 3: Audit metadata timestamp */}
              <div className="pt-2 border-t border-border flex items-center justify-between text-[10px] text-muted-foreground font-mono">
                <span>Record #{String(log.id).replace(/[^a-zA-Z0-9]/g, "").slice(0, 10)}</span>
                <span>Timestamp: {log.timestamp ? new Date(log.timestamp).toLocaleDateString() : "Logged"}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
