import React, { useState } from "react";
import { X, Gauge, RefreshCw, AlertCircle, ArrowRight, Camera, CheckCircle2, Upload } from "lucide-react";
import { formatMiles } from "../data/fleetData";

export function OdometerSyncModal({ isOpen, onClose, truck, onSyncOdometer }) {
  if (!isOpen || !truck) return null;

  const [newOdometer, setNewOdometer] = useState(truck.odometer);
  const [photoVerified, setPhotoVerified] = useState(true);
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  const newOdoNum = Number(newOdometer) || 0;
  const milesDiff = newOdoNum - Number(truck.odometer);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newOdoNum <= 0) {
      setError("Odometer reading must be greater than zero.");
      return;
    }
    if (newOdoNum < truck.odometer) {
      if (!window.confirm(`Warning: The new reading (${formatMiles(newOdoNum)} mi) is lower than current odometer (${formatMiles(truck.odometer)} mi). Confirm odometer rollback / correction?`)) {
        return;
      }
    }

    onSyncOdometer(truck.id, newOdoNum, { photoVerified, notes });
    onClose();
  };

  const addMiles = (amount) => {
    setNewOdometer(prev => Number(prev) + amount);
    setError("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="w-full max-w-md bg-card border border-border rounded-2xl shadow-elevated overflow-hidden text-foreground"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="p-5 border-b border-border flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-muted text-foreground flex items-center justify-center">
              <Gauge className="w-5 h-5 text-sky-600 dark:text-sky-400" />
            </div>
            <div>
              <h3 className="text-base font-black tracking-tight text-foreground">
                Update mileage
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

          {/* Current vs New Comparison */}
          <div className="p-3.5 rounded-xl bg-muted/60 border border-border flex items-center justify-between text-xs font-mono">
            <div>
              <span className="text-[10px] text-muted-foreground block font-sans">Current Reading</span>
              <span className="text-sm font-bold text-foreground">
                {formatMiles(truck.odometer)} mi
              </span>
            </div>
            <ArrowRight className="w-4 h-4 text-muted-foreground" />
            <div className="text-right">
              <span className="text-[10px] text-muted-foreground block font-sans">New Reading</span>
              <span className="text-sm font-black text-sky-600 dark:text-sky-400">
                {formatMiles(newOdoNum)} mi
              </span>
            </div>
          </div>

          {/* Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground">
              New Odometer Mileage (mi) *
            </label>
            <div className="relative">
              <input
                type="number"
                min="0"
                step="1"
                required
                value={newOdometer}
                onChange={(e) => {
                  setNewOdometer(e.target.value);
                  setError("");
                }}
                className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-lg font-mono font-black text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-mono text-muted-foreground font-bold">
                MILES
              </span>
            </div>
          </div>

          {/* Quick Increment Chips */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Quick add:</span>
            <button
              type="button"
              onClick={() => addMiles(50)}
              className="px-2.5 py-1 text-xs rounded-lg border border-border bg-background hover:bg-muted font-mono transition"
            >
              +50 mi
            </button>
            <button
              type="button"
              onClick={() => addMiles(250)}
              className="px-2.5 py-1 text-xs rounded-lg border border-border bg-background hover:bg-muted font-mono transition"
            >
              +250 mi
            </button>
            <button
              type="button"
              onClick={() => addMiles(1000)}
              className="px-2.5 py-1 text-xs rounded-lg border border-border bg-background hover:bg-muted font-mono transition"
            >
              +1k mi
            </button>
          </div>

          {/* Driver Photo Verification Feature (Point #5) */}
          <div className="p-3 rounded-xl border border-border bg-muted/40 space-y-2">
            <label className="flex items-center space-x-2 text-xs cursor-pointer">
              <input
                type="checkbox"
                checked={photoVerified}
                onChange={(e) => setPhotoVerified(e.target.checked)}
                className="rounded border-border text-primary focus:ring-primary bg-background w-4 h-4"
              />
              <span className="font-semibold text-foreground flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-sky-500" />
                Verified via driver odometer photo
              </span>
            </label>
            <p className="text-[11px] text-muted-foreground pl-6">
              Recorded to verify driver check-in submission and prevent odometer rollbacks.
            </p>
          </div>

          {milesDiff !== 0 && (
            <p className="text-[11px] text-muted-foreground font-mono">
              Net delta: <span className={milesDiff > 0 ? "text-amber-600 dark:text-amber-400 font-bold" : "text-sky-600 dark:text-sky-400 font-bold"}>
                {milesDiff > 0 ? `+${formatMiles(milesDiff)}` : formatMiles(milesDiff)} mi
              </span>. All 9 maintenance interval wear meters will recalculate immediately.
            </p>
          )}

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
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Save mileage</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
