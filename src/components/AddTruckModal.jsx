import React, { useState } from "react";
import { X, Truck, Plus, AlertCircle } from "lucide-react";
import { generateTruckTasks } from "../data/fleetData";

export function AddTruckModal({ isOpen, onClose, onAddTruck }) {
  if (!isOpen) return null;

  const [unitNumber, setUnitNumber] = useState("");
  const [vin, setVin] = useState("");
  const [makeModel, setMakeModel] = useState("2020 Ford F-250 Super Duty");
  const [odometer, setOdometer] = useState(120000);
  const [driver, setDriver] = useState("");
  const [terminal, setTerminal] = useState("Main Yard");
  const [autoPopulateTasks, setAutoPopulateTasks] = useState(true);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!unitNumber.trim()) {
      setError("Please specify a Unit Number (e.g., TRK-04).");
      return;
    }
    if (!vin.trim() || vin.trim().length < 6) {
      setError("Please enter a valid VIN (at least 6 characters).");
      return;
    }
    const odoNum = Number(odometer);
    if (isNaN(odoNum) || odoNum <= 0) {
      setError("Please enter a valid odometer mileage.");
      return;
    }

    const newTruckId = `trk-${Date.now().toString().slice(-4)}`;

    const defaultTasks = autoPopulateTasks 
      ? generateTruckTasks(newTruckId, odoNum)
      : [];

    onAddTruck({
      id: newTruckId,
      unitNumber: unitNumber.trim().toUpperCase(),
      vin: vin.trim().toUpperCase(),
      makeModel: makeModel.trim(),
      odometer: odoNum,
      lastUpdated: new Date().toISOString(),
      driver: driver.trim() || "Unassigned",
      terminal,
      checkInDays: 7,
      status: "active",
      odometerPhotoVerified: true,
      tasks: defaultTasks,
      serviceLogs: []
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="w-full max-w-lg bg-card border border-border rounded-2xl shadow-elevated overflow-hidden text-foreground"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-border flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-muted text-foreground flex items-center justify-center">
              <Truck className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-base font-black tracking-tight text-foreground">
                Add Truck
              </h3>
              <p className="text-xs text-muted-foreground">
                Register a new company vehicle in your fleet
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

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-foreground">
                Unit Number *
              </label>
              <input
                type="text"
                required
                placeholder="TRK-04"
                value={unitNumber}
                onChange={(e) => {
                  setUnitNumber(e.target.value);
                  setError("");
                }}
                className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs font-mono font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-primary uppercase"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-foreground">
                VIN *
              </label>
              <input
                type="text"
                required
                placeholder="1FT8W3BT9NEC..."
                value={vin}
                onChange={(e) => {
                  setVin(e.target.value);
                  setError("");
                }}
                className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs font-mono text-foreground focus:outline-none focus:ring-2 focus:ring-primary uppercase"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-foreground">
                Make & Model *
              </label>
              <input
                type="text"
                required
                placeholder="2020 Ford F-250 Super Duty"
                value={makeModel}
                onChange={(e) => setMakeModel(e.target.value)}
                className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-foreground">
                Current Odometer (mi) *
              </label>
              <input
                type="number"
                min="0"
                required
                value={odometer}
                onChange={(e) => setOdometer(e.target.value)}
                className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs font-mono font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-foreground">
                Assigned Driver
              </label>
              <input
                type="text"
                placeholder="e.g. John Doe"
                value={driver}
                onChange={(e) => setDriver(e.target.value)}
                className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-foreground">
                Terminal Base
              </label>
              <input
                type="text"
                placeholder="Main Yard"
                value={terminal}
                onChange={(e) => setTerminal(e.target.value)}
                className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div className="pt-2">
            <label className="flex items-center space-x-2 text-xs text-muted-foreground cursor-pointer">
              <input
                type="checkbox"
                checked={autoPopulateTasks}
                onChange={(e) => setAutoPopulateTasks(e.target.checked)}
                className="rounded border-border text-primary focus:ring-primary bg-background w-4 h-4"
              />
              <span className="text-foreground font-medium">
                Auto-generate complete 9-task maintenance schedule (Oil @ 7k, Fuel Filter @ 14k, Trans @ 45k, etc.)
              </span>
            </label>
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
              className="flex items-center space-x-1 px-4 py-2 text-xs font-bold rounded-xl bg-primary text-primary-foreground hover:opacity-90 transition shadow-sm active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Register truck</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
