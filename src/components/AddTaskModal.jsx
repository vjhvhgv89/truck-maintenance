import React, { useState } from "react";
import { X, Plus, Wrench, AlertCircle } from "lucide-react";
import { formatMiles } from "../data/fleetData";

const PRESET_TASKS = [
  { title: "Oil & Filter Service", interval: 10000, category: "Engine", notes: "Full synthetic oil & heavy-duty spin-on filter." },
  { title: "Fuel Filter Replacement", interval: 15000, category: "Fuel System", notes: "Water separator and final stage canister filter replacement." },
  { title: "Tire Rotation & Balance", interval: 12000, category: "Tires", notes: "Rotate tires and check steer alignment and tread depth." },
  { title: "Brake Lining & Rotor Check", interval: 20000, category: "Brakes", notes: "Measure friction puck thickness and lubricate adjusters." },
  { title: "Air Filter Element", interval: 25000, category: "Intake", notes: "Replace air restriction element." },
  { title: "Air Dryer Cartridge", interval: 30000, category: "Pneumatics", notes: "Bendix desiccant cartridge and purge valve." },
  { title: "Transmission Fluid Service", interval: 50000, category: "Drivetrain", notes: "Transmission fluid flush and pan filter." },
];

export function AddTaskModal({ isOpen, onClose, truck, onAddTask }) {
  if (!isOpen || !truck) return null;

  const [title, setTitle] = useState("");
  const [intervalMiles, setIntervalMiles] = useState(10000);
  const [category, setCategory] = useState("Engine");
  const [lastServicedMileage, setLastServicedMileage] = useState(truck.odometer);
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  const intervalNum = Number(intervalMiles) || 0;
  const lastServicedNum = Number(lastServicedMileage) || 0;
  const nextDueNum = lastServicedNum + intervalNum;

  const handleSelectPreset = (preset) => {
    setTitle(preset.title);
    setIntervalMiles(preset.interval);
    setCategory(preset.category);
    setNotes(preset.notes);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Please enter a maintenance task title.");
      return;
    }
    if (intervalNum <= 0) {
      setError("Interval miles must be greater than zero.");
      return;
    }

    onAddTask(truck.id, {
      id: `task-${Date.now()}`,
      title: title.trim(),
      intervalMiles: intervalNum,
      lastServicedMileage: lastServicedNum,
      nextDueMileage: nextDueNum,
      category,
      notes: notes.trim()
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="w-full max-w-lg bg-card border border-border rounded-2xl shadow-elevated overflow-hidden text-foreground max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-border flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-muted text-foreground flex items-center justify-center">
              <Wrench className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-base font-black tracking-tight text-foreground">
                Add Maintenance Task
              </h3>
              <p className="text-xs text-muted-foreground font-mono">
                Unit {truck.unitNumber} · Preventive Service Schedule
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
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-600 dark:text-rose-400 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Quick Presets */}
          <div>
            <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block mb-1.5">
              Select Preset:
            </label>
            <div className="flex flex-wrap gap-1.5">
              {PRESET_TASKS.slice(0, 4).map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectPreset(p)}
                  className="px-2.5 py-1 rounded-lg border border-border bg-background text-[11px] font-medium text-foreground hover:bg-muted transition"
                >
                  {p.title}
                </button>
              ))}
            </div>
          </div>

          {/* Task Title */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-foreground">
              Task Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Oil & Filter Service @ 10,000 mi"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setError("");
              }}
              className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Interval Miles & Category */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-foreground">
                Interval Miles *
              </label>
              <input
                type="number"
                min="500"
                step="500"
                required
                value={intervalMiles}
                onChange={(e) => setIntervalMiles(e.target.value)}
                className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs font-mono font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-foreground">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="Engine">Engine</option>
                <option value="Fuel System">Fuel System</option>
                <option value="Tires">Tires</option>
                <option value="Brakes">Brakes</option>
                <option value="Intake">Intake</option>
                <option value="Pneumatics">Pneumatics</option>
                <option value="Drivetrain">Drivetrain</option>
              </select>
            </div>
          </div>

          {/* Last Serviced Mileage */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-foreground flex items-center justify-between">
              <span>Last Serviced Odometer (mi)</span>
              <span className="text-[10px] text-muted-foreground font-mono">Current: {formatMiles(truck.odometer)}</span>
            </label>
            <input
              type="number"
              min="0"
              required
              value={lastServicedMileage}
              onChange={(e) => setLastServicedMileage(e.target.value)}
              className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs font-mono text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Calculation preview */}
          <div className="p-3 rounded-xl bg-muted/60 border border-border flex items-center justify-between text-xs font-mono">
            <div>
              <span className="text-[10px] text-muted-foreground block font-sans">Next Due At</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">{formatMiles(nextDueNum)} mi</span>
            </div>
            <div>
              <span className="text-[10px] text-muted-foreground block font-sans">Remaining</span>
              <span className="text-foreground font-bold">{formatMiles(nextDueNum - truck.odometer)} mi</span>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-foreground">
              Technical / OEM Notes
            </label>
            <textarea
              rows={2}
              placeholder="e.g. OEM filter part numbers, torque specifications..."
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
              className="flex items-center space-x-1 px-4 py-2 text-xs font-bold rounded-xl bg-primary text-primary-foreground hover:opacity-90 transition shadow-sm active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Add task</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
