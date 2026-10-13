import React, { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import { INITIAL_FLEET, formatMiles } from "./data/fleetData";
import { Navbar } from "./components/Navbar";
import { DashboardSummary } from "./components/DashboardSummary";
import { TruckCardHome } from "./components/TruckCardHome";
import { TruckDetailView } from "./components/TruckDetailView";
import { LogCompletedModal } from "./components/LogCompletedModal";
import { OdometerSyncModal } from "./components/OdometerSyncModal";
import { AddTaskModal } from "./components/AddTaskModal";
import { AddTruckModal } from "./components/AddTruckModal";
import { Toast } from "./components/Toast";
import { Plus } from "lucide-react";

const STORAGE_KEY = "jasper_fleet_maintenance_v3";

export default function App() {
  // Theme state (Light / Dark)
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem("fleet_dark_mode") === "true";
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("fleet_dark_mode", String(isDarkMode));
  }, [isDarkMode]);

  // Load trucks from localStorage or initial dataset
  const [trucks, setTrucks] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error("Failed to parse saved fleet data:", e);
    }
    return INITIAL_FLEET;
  });

  // Navigation view mode: 'fleet' (overview list) | 'truck' (detail view)
  const [viewMode, setViewMode] = useState("fleet");
  const [selectedTruckId, setSelectedTruckId] = useState("trk-101");
  const [activeFilter, setActiveFilter] = useState("all"); // "all" | "overdue" | "due_soon" | "good"
  
  // Modals state
  const [logCompletedModalData, setLogCompletedModalData] = useState(null); // { task, truck }
  const [odometerSyncTruck, setOdometerSyncTruck] = useState(null); // truck
  const [addTaskTruck, setAddTaskTruck] = useState(null); // truck
  const [isAddTruckModalOpen, setIsAddTruckModalOpen] = useState(false);

  // Toast notification state
  const [toast, setToast] = useState(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(trucks));
    } catch (e) {
      console.error("Failed to persist fleet data:", e);
    }
  }, [trucks]);

  // Active truck object
  const activeTruck = trucks.find(t => t.id === selectedTruckId) || trucks[0];

  const showToast = (title, message, type = "success") => {
    setToast({ title, message, type });
  };

  // --- Handlers ---

  // 1. Odometer Sync
  const handleSyncOdometer = (truckId, newOdometer) => {
    setTrucks(prev => prev.map(trk => {
      if (trk.id !== truckId) return trk;
      return {
        ...trk,
        odometer: Number(newOdometer),
        lastUpdated: new Date().toISOString()
      };
    }));

    showToast(
      "Mileage Updated",
      `Unit ${trucks.find(t => t.id === truckId)?.unitNumber} updated to ${formatMiles(newOdometer)} mi. All interval wear meters recalculated.`,
      "success"
    );
  };

  // Quick simulate telematics miles
  const handleSimulateTelematics = (additionalMiles) => {
    if (!activeTruck) return;
    const newOdo = activeTruck.odometer + additionalMiles;
    handleSyncOdometer(activeTruck.id, newOdo);
  };

  // 2. Log Completed Action
  const handleLogCompletedSubmit = (logData) => {
    const targetTruck = logCompletedModalData?.truck || activeTruck;
    if (!targetTruck) return;

    const {
      taskId,
      taskTitle,
      completedMileage,
      completedDate,
      technician,
      workOrder,
      notes
    } = logData;

    setTrucks(prev => prev.map(trk => {
      if (trk.id !== targetTruck.id) return trk;

      // Update the specific task
      const updatedTasks = trk.tasks.map(task => {
        if (task.id !== taskId) return task;

        const newLastServiced = completedMileage;
        const newNextDue = completedMileage + Number(task.intervalMiles);

        return {
          ...task,
          lastServicedMileage: newLastServiced,
          nextDueMileage: newNextDue
        };
      });

      // Create immutable audit log entry
      const newAuditLog = {
        id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
        truckId: trk.id,
        truckUnit: trk.unitNumber,
        taskTitle,
        completedMileage,
        completedDate,
        technician,
        workOrder,
        notes,
        timestamp: new Date().toISOString()
      };

      // Auto update truck odometer if completed mileage is ahead of current odometer
      const updatedOdometer = Math.max(trk.odometer, completedMileage);

      return {
        ...trk,
        odometer: updatedOdometer,
        lastUpdated: new Date().toISOString(),
        tasks: updatedTasks,
        serviceLogs: [newAuditLog, ...(trk.serviceLogs || [])]
      };
    }));

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.7 }
      });
    } catch (e) {}

    showToast(
      "Service Logged",
      `Audit record saved for ${taskTitle}. Next interval reset.`,
      "success"
    );
  };

  // 3. Add Custom Task
  const handleAddTask = (truckId, newTask) => {
    setTrucks(prev => prev.map(trk => {
      if (trk.id !== truckId) return trk;
      return {
        ...trk,
        tasks: [...trk.tasks, newTask]
      };
    }));

    showToast("Task Added", `"${newTask.title}" added to service schedule.`);
  };

  // 4. Onboard New Truck
  const handleAddTruck = (newTruck) => {
    setTrucks(prev => [newTruck, ...prev]);
    setSelectedTruckId(newTruck.id);
    setViewMode("truck");
    showToast("Truck Added", `Unit ${newTruck.unitNumber} (${newTruck.makeModel}) registered.`);
  };

  // 5. Reset to Sample Logistics Fleet Data
  const handleResetData = () => {
    if (window.confirm("Reset fleet tracker back to default sample dataset?")) {
      setTrucks(INITIAL_FLEET);
      setSelectedTruckId("trk-101");
      setViewMode("fleet");
      showToast("Data Restored", "Sample fleet maintenance dataset restored.", "info");
    }
  };

  // 6. Export Complete Fleet Audit Logs (CSV)
  const handleExportCSV = () => {
    const allLogs = [];
    trucks.forEach(trk => {
      (trk.serviceLogs || []).forEach(log => {
        allLogs.push({
          unitNumber: trk.unitNumber,
          vin: trk.vin,
          makeModel: trk.makeModel,
          taskTitle: log.taskTitle,
          completedMileage: log.completedMileage,
          completedDate: log.completedDate,
          technician: log.technician,
          workOrder: log.workOrder || "N/A",
          notes: log.notes ? `"${log.notes.replace(/"/g, '""')}"` : "",
          auditTimestamp: log.timestamp || "N/A"
        });
      });
    });

    if (allLogs.length === 0) {
      alert("No service log entries available to export yet.");
      return;
    }

    const headers = [
      "Unit Number",
      "VIN",
      "Make & Model",
      "Task Completed",
      "Completion Odometer (mi)",
      "Date Completed",
      "Technician",
      "Work Order",
      "Service Notes",
      "Audit Timestamp"
    ];

    const rows = allLogs.map(l => [
      l.unitNumber,
      l.vin,
      `"${l.makeModel}"`,
      `"${l.taskTitle}"`,
      l.completedMileage,
      l.completedDate,
      `"${l.technician}"`,
      l.workOrder,
      l.notes,
      l.auditTimestamp
    ]);

    const csvContent = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `fleet-maintenance-audit-${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast("Audit Exported", "Complete fleet service history CSV downloaded.");
  };

  // Export specific truck logs
  const handleExportTruckCSV = () => {
    if (!activeTruck || !activeTruck.serviceLogs || activeTruck.serviceLogs.length === 0) {
      alert(`No service logs found for Unit ${activeTruck?.unitNumber}.`);
      return;
    }

    const headers = ["Unit", "VIN", "Task", "Completion Mileage", "Date", "Technician", "Work Order", "Notes"];
    const rows = activeTruck.serviceLogs.map(l => [
      activeTruck.unitNumber,
      activeTruck.vin,
      `"${l.taskTitle}"`,
      l.completedMileage,
      l.completedDate,
      `"${l.technician}"`,
      l.workOrder || "",
      `"${(l.notes || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `service-history-${activeTruck.unitNumber}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast("Export Ready", `Service history for Unit ${activeTruck.unitNumber} exported.`);
  };

  // Filter trucks based on active filter
  const filteredTrucks = trucks.filter(truck => {
    if (activeFilter === "all") return true;

    const hasOverdue = (truck.tasks || []).some(t => (t.nextDueMileage - truck.odometer) < 0);
    const hasDueSoon = (truck.tasks || []).some(t => {
      const rem = t.nextDueMileage - truck.odometer;
      return rem >= 0 && rem <= 500;
    });

    if (activeFilter === "overdue") return hasOverdue;
    if (activeFilter === "due_soon") return hasDueSoon;
    if (activeFilter === "good") return !hasOverdue && !hasDueSoon;

    return true;
  });

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans transition-colors duration-200">
      
      {/* Top Navbar Header matching fleet-fix-fast */}
      <Navbar
        onAddTruck={() => setIsAddTruckModalOpen(true)}
        onExportCSV={handleExportCSV}
        onResetData={handleResetData}
        onSimulateTelematics={handleSimulateTelematics}
        activeTruck={activeTruck}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        onNavigateHome={() => setViewMode("fleet")}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8 space-y-6">
        
        {viewMode === "fleet" ? (
          // View 1: Fleet Overview (Matching fleet-fix-fast.lovable.app Home)
          <div className="space-y-6">
            
            {/* Summary Dashboard at Top (User Requirement) */}
            <DashboardSummary
              trucks={trucks}
              activeFilter={activeFilter}
              onFilterChange={(filter) => setActiveFilter(filter)}
            />

            {/* Trucks List matching sample app */}
            <div className="space-y-4">
              {filteredTrucks.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-border p-12 text-center text-muted-foreground text-xs">
                  No trucks match the current filter.
                </div>
              ) : (
                filteredTrucks.map(truck => (
                  <TruckCardHome
                    key={truck.id}
                    truck={truck}
                    onOpenTruck={(id) => {
                      setSelectedTruckId(id);
                      setViewMode("truck");
                    }}
                    onUpdateMileage={(trk) => setOdometerSyncTruck(trk)}
                  />
                ))
              )}
            </div>

            {/* + Add truck dashed card matching fleet-fix-fast.lovable.app */}
            <button
              onClick={() => setIsAddTruckModalOpen(true)}
              className="w-full rounded-2xl border border-dashed border-border hover:border-foreground/40 bg-card/40 hover:bg-card px-4 py-5 text-sm font-bold text-muted-foreground hover:text-foreground transition active:scale-99 flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>+ Add truck</span>
            </button>

          </div>
        ) : (
          // View 2: Truck Detail View (Matching fleet-fix-fast.lovable.app /truck/:id)
          <TruckDetailView
            truck={activeTruck}
            onBackToFleet={() => setViewMode("fleet")}
            onUpdateMileage={(trk) => setOdometerSyncTruck(trk)}
            onLogCompleted={(task) => setLogCompletedModalData({ task, truck: activeTruck })}
            onAddTask={(trk) => setAddTaskTruck(trk)}
            onQuickSimulateMiles={handleSimulateTelematics}
            onExportTruckLogs={handleExportTruckCSV}
          />
        )}

      </main>

      {/* Modals */}
      <LogCompletedModal
        isOpen={!!logCompletedModalData}
        onClose={() => setLogCompletedModalData(null)}
        task={logCompletedModalData?.task}
        truck={logCompletedModalData?.truck}
        onSubmitLog={handleLogCompletedSubmit}
      />

      <OdometerSyncModal
        isOpen={!!odometerSyncTruck}
        onClose={() => setOdometerSyncTruck(null)}
        truck={odometerSyncTruck}
        onSyncOdometer={handleSyncOdometer}
      />

      <AddTaskModal
        isOpen={!!addTaskTruck}
        onClose={() => setAddTaskTruck(null)}
        truck={addTaskTruck}
        onAddTask={handleAddTask}
      />

      <AddTruckModal
        isOpen={isAddTruckModalOpen}
        onClose={() => setIsAddTruckModalOpen(false)}
        onAddTruck={handleAddTruck}
      />

      {/* Floating Toast Notification */}
      <Toast
        toast={toast}
        onDismiss={() => setToast(null)}
      />

      {/* Footer */}
      <footer className="border-t border-border py-6 text-center text-xs text-muted-foreground">
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© 2026 Fleet Maintenance Tracker. Real-time mileage updates & service intervals.</p>
          <p className="font-mono text-[11px]">
            Real-time math: <span className="text-foreground font-semibold">Remaining = Next Due - Odometer</span>
          </p>
        </div>
      </footer>

    </div>
  );
}
