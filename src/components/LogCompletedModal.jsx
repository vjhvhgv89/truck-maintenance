import React, { useState } from "react";
import { X, CheckCircle2, Wrench, Calendar, FileText, UserCheck, AlertCircle, Sparkles } from "lucide-react";
import { formatMiles } from "../data/fleetData";

export function LogCompletedModal({ isOpen, onClose, task, truck, onSubmitLog }) {
  if (!isOpen || !task || !truck) return null;

  const [completedMileage, setCompletedMileage] = useState(truck.odometer);
  const [completedDate, setCompletedDate] = useState(new Date().toISOString().split("T")[0]);
  const [technician, setTechnician] = useState("Fleet Technician");
  const [workOrder, setWorkOrder] = useState(`WO-${Math.floor(10000 + Math.random() * 90000)}`);
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  const mileageNum = Number(completedMileage) || 0;
  const newLastServiced = mileageNum;
  const newNextDue = mileageNum + Number(task.intervalMiles);
  const effectiveOdo = Math.max(truck.odometer, mileageNum);
  const newRemaining = newNextDue - effectiveOdo;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!mileageNum || mileageNum <= 0) {
      setError("Please enter a valid completed mileage reading.");
      return;
    }
    if (!completedDate) {
      setError("Please select the completion date.");
      return;
    }

    onSubmitLog({
      taskId: task.id,
      taskTitle: task.title,
      completedMileage: mileageNum,
      completedDate,
      technician: technician.trim() || "Fleet Technician",
      workOrder: workOrder.trim() || "N/A",
      notes: notes.trim() || `Completed routine maintenance: ${task.title}.`
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="w-full max-w-lg bg-card border border-border rounded-2xl shadow-elevated overflow-hidden text-foreground"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header matching fleet-fix-fast modal */}
        <div className="p-5 border-b border-border flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-muted text-foreground flex items-center justify-center">
              <Wrench className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <h3 className="text-base font-black tracking-tight text-foreground">
                Log {task.title}
              </h3>
              <p className="text-xs text-muted-foreground font-mono">
                Unit {truck.unitNumber} · {truck.makeModel}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-600 dark:text-rose-400 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Primary Input: Completed Mileage */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground flex items-center justify-between">
              <span>Completed at Mileage (mi) *</span>
              <span className="text-[11px] text-muted-foreground font-mono font-normal">
                Current Odometer: {formatMiles(truck.odometer)} mi
              </span>
            </label>
            <div className="relative">
              <input
                type="number"
                min="1"
                step="1"
                required
                value={completedMileage}
                onChange={(e) => {
                  setCompletedMileage(e.target.value);
                  setError("");
                }}
                className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-base font-mono font-black text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-mono text-muted-foreground font-bold">
                MILES
              </span>
            </div>
          </div>

          {/* Real-time Math Recalculation Preview Card */}
          <div className="p-3.5 rounded-xl bg-muted/60 border border-border space-y-2 text-xs">
            <div className="text-[11px] font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
              <span>Updated Interval Target:</span>
            </div>
            <div className="grid grid-cols-3 gap-2 font-mono">
              <div>
                <span className="text-[10px] text-muted-foreground block font-sans">Last Serviced</span>
                <span className="text-foreground font-bold">{formatMiles(newLastServiced)} mi</span>
              </div>
              <div>
                <span className="text-[10px] text-muted-foreground block font-sans">Interval</span>
                <span className="text-muted-foreground font-bold">+{formatMiles(task.intervalMiles)} mi</span>
              </div>
              <div>
                <span className="text-[10px] text-muted-foreground block font-sans">Next Due At</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">{formatMiles(newNextDue)} mi</span>
              </div>
            </div>
            <div className="text-[11px] text-muted-foreground pt-1 border-t border-border flex items-center justify-between">
              <span>Remaining miles after update:</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-mono font-bold">
                +{formatMiles(newRemaining)} mi (HEALTHY)
              </span>
            </div>
          </div>

          {/* Row: Date & Work Order */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                Date Completed *
              </label>
              <input
                type="date"
                required
                value={completedDate}
                onChange={(e) => setCompletedDate(e.target.value)}
                className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            
            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground flex items-center gap-1">
                <FileText className="w-3.5 h-3.5 text-muted-foreground" />
                Work Order #
              </label>
              <input
                type="text"
                value={workOrder}
                onChange={(e) => setWorkOrder(e.target.value)}
                className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary font-mono"
              />
            </div>
          </div>

          {/* Technician / Shop */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-foreground flex items-center gap-1">
              <UserCheck className="w-3.5 h-3.5 text-muted-foreground" />
              Technician / Shop Name
            </label>
            <input
              type="text"
              placeholder="e.g. Master Diesel Tech / Fleet Yard"
              value={technician}
              onChange={(e) => setTechnician(e.target.value)}
              className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Notes */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-foreground">
              Technician Notes / Inspection Details
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Replaced filters, torqued drain plug, inspected belts..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-border flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold rounded-xl border border-border bg-background hover:bg-muted text-foreground transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center space-x-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-primary text-primary-foreground hover:opacity-90 transition shadow-sm active:scale-95"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Record completion</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
