// Exact 9 Standard Maintenance Tasks from Jami's Original Lovable Tracker
export const STANDARD_MAINTENANCE_SCHEDULE = [
  {
    title: "Oil & Filter",
    intervalMiles: 7000,
    subtitle: "Regular engine oil and filter change",
    category: "Engine"
  },
  {
    title: "Tire Rotation",
    intervalMiles: 7000,
    subtitle: "With oil change",
    category: "Tires"
  },
  {
    title: "Air Filter",
    intervalMiles: 7000,
    subtitle: "Inspect, replace as needed",
    category: "Intake"
  },
  {
    title: "Fuel Filter / Water Separator",
    intervalMiles: 14000,
    subtitle: "Every 2nd oil change",
    category: "Fuel System"
  },
  {
    title: "Transmission Fluid & Filter",
    intervalMiles: 45000,
    subtitle: "Automatic transmission fluid and internal filter",
    category: "Drivetrain"
  },
  {
    title: "Transfer Case & Diffs",
    intervalMiles: 50000,
    subtitle: "Front/rear differentials and transfer case gear oil",
    category: "Drivetrain"
  },
  {
    title: "Turbo Check",
    intervalMiles: 50000,
    subtitle: "Inspect shaft play, wastegate, and intercooler boots",
    category: "Engine"
  },
  {
    title: "Serpentine Belt Check",
    intervalMiles: 60000,
    subtitle: "Inspect tensioner, idler pulleys, and belt rib wear",
    category: "Engine"
  },
  {
    title: "Coolant Flush",
    intervalMiles: 125000,
    subtitle: "Complete cooling system drain and extended-life refill",
    category: "Cooling"
  }
];

// Helper to generate full task list for a truck
export function generateTruckTasks(truckId, currentOdometer, scenarioOverrides = {}) {
  return STANDARD_MAINTENANCE_SCHEDULE.map((item, idx) => {
    const id = `task-${truckId}-${idx + 1}`;
    
    // Check if there are scenario overrides
    if (scenarioOverrides[item.title]) {
      return {
        id,
        title: item.title,
        intervalMiles: scenarioOverrides[item.title].intervalMiles || item.intervalMiles,
        lastServicedMileage: scenarioOverrides[item.title].lastServicedMileage,
        nextDueMileage: scenarioOverrides[item.title].nextDueMileage,
        subtitle: item.subtitle,
        category: item.category,
        notes: scenarioOverrides[item.title].notes || ""
      };
    }

    // Default clean intervals based on current odometer
    const lastServiced = Math.max(0, currentOdometer - Math.floor(item.intervalMiles * 0.4));
    const nextDue = lastServiced + item.intervalMiles;

    return {
      id,
      title: item.title,
      intervalMiles: item.intervalMiles,
      lastServicedMileage: lastServiced,
      nextDueMileage: nextDue,
      subtitle: item.subtitle,
      category: item.category,
      notes: ""
    };
  });
}

// Initial Fleet matching Dylan & Jami's trucks and requirements
export const INITIAL_FLEET = [
  {
    id: "trk-dodge-2500",
    unitNumber: "TRK-01",
    vin: "3C6UR5FL8EG192841",
    makeModel: "2014 Dodge 2500",
    odometer: 180000, // Dylan's exact example!
    lastUpdated: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    driver: "Dave Miller",
    terminal: "Main Yard",
    checkInDays: 7,
    status: "active",
    odometerPhotoVerified: true,
    tasks: generateTruckTasks("trk-dodge-2500", 180000, {
      "Oil & Filter": {
        // Dylan's exact example:
        // Current: 180,000 | Completed at: 179,000 | Interval: 7,000 | Next Due: 186,000 (6,000 mi left)
        intervalMiles: 7000,
        lastServicedMileage: 179000,
        nextDueMileage: 186000,
        notes: "Shell Rotella T6 5W-40 full synthetic and OEM filter."
      },
      "Tire Rotation": {
        intervalMiles: 7000,
        lastServicedMileage: 179000,
        nextDueMileage: 186000,
        notes: "Rotated with oil change. 10/32 tread remaining."
      },
      "Air Filter": {
        intervalMiles: 7000,
        lastServicedMileage: 179000,
        nextDueMileage: 186000,
        notes: "Inspected and vacuumed housing."
      },
      "Fuel Filter / Water Separator": {
        // 180,000 - 168,000 = 12,000 elapsed -> 2,000 mi left until 182,000
        intervalMiles: 14000,
        lastServicedMileage: 168000,
        nextDueMileage: 182000,
        notes: "Front and rear fuel filters replaced."
      },
      "Transmission Fluid & Filter": {
        intervalMiles: 45000,
        lastServicedMileage: 140000,
        nextDueMileage: 185000, // 5,000 mi left
        notes: "Full pan drop and pan filter replacement."
      },
      "Transfer Case & Diffs": {
        intervalMiles: 50000,
        lastServicedMileage: 135000,
        nextDueMileage: 185000, // 5,000 mi left
        notes: "Synthetic 75W-90 and ATF+4."
      },
      "Turbo Check": {
        intervalMiles: 50000,
        lastServicedMileage: 130000,
        nextDueMileage: 180000, // 0 mi left -> DUE SOON!
        notes: "Check actuator stroke and boost leaks."
      },
      "Serpentine Belt Check": {
        intervalMiles: 60000,
        lastServicedMileage: 120000,
        nextDueMileage: 180000, // 0 mi left -> DUE SOON!
        notes: "Inspect tensioner and ribbed belt."
      },
      "Coolant Flush": {
        intervalMiles: 125000,
        lastServicedMileage: 100000,
        nextDueMileage: 225000,
        notes: "HOAT Cummins extended life coolant."
      }
    }),
    serviceLogs: [
      {
        id: "log-dodge-1",
        truckId: "trk-dodge-2500",
        truckUnit: "TRK-01",
        taskTitle: "Oil & Filter",
        completedMileage: 179000,
        completedDate: "2026-10-01",
        technician: "In-House Fleet Mechanic",
        workOrder: "WO-1044",
        notes: "Oil change completed at 179,000 miles. Shell Rotella 5W-40.",
        timestamp: "2026-10-01T14:00:00Z"
      },
      {
        id: "log-dodge-2",
        truckId: "trk-dodge-2500",
        truckUnit: "TRK-01",
        taskTitle: "Tire Rotation",
        completedMileage: 179000,
        completedDate: "2026-10-01",
        technician: "In-House Fleet Mechanic",
        workOrder: "WO-1044",
        notes: "Rotated tires (cross-front to rear). Torqued lug nuts to 140 ft-lbs.",
        timestamp: "2026-10-01T14:30:00Z"
      }
    ]
  },
  {
    id: "trk-gmc-2500",
    unitNumber: "TRK-02",
    vin: "1GT12UEC5JF189304",
    makeModel: "2018 GMC 2500",
    odometer: 142850,
    lastUpdated: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    driver: "Marcus Vance",
    terminal: "North Hub",
    checkInDays: 7,
    status: "active",
    odometerPhotoVerified: true,
    tasks: generateTruckTasks("trk-gmc-2500", 142850, {
      "Oil & Filter": {
        intervalMiles: 7000,
        lastServicedMileage: 136000,
        nextDueMileage: 143000, // 150 mi left -> DUE SOON!
        notes: "Duramax 15W-40 blend."
      },
      "Fuel Filter / Water Separator": {
        intervalMiles: 14000,
        lastServicedMileage: 126000,
        nextDueMileage: 140000, // 140,000 - 142,850 = -2,850 mi -> OVERDUE!
        notes: "AC Delco TP1015 water separator replacement."
      },
      "Tire Rotation": {
        intervalMiles: 7000,
        lastServicedMileage: 136000,
        nextDueMileage: 143000, // 150 mi left -> DUE SOON!
        notes: "With oil change."
      }
    }),
    serviceLogs: [
      {
        id: "log-gmc-1",
        truckId: "trk-gmc-2500",
        truckUnit: "TRK-02",
        taskTitle: "Oil & Filter",
        completedMileage: 136000,
        completedDate: "2026-07-15",
        technician: "Fleet Express Shop",
        workOrder: "WO-9812",
        notes: "Oil and filter service completed.",
        timestamp: "2026-07-15T11:00:00Z"
      }
    ]
  },
  {
    id: "trk-ford-350",
    unitNumber: "TRK-03",
    vin: "1FT8W3BT9NEC184920",
    makeModel: "2021 Ford F-350 Super Duty",
    odometer: 89400,
    lastUpdated: new Date(Date.now() - 1000 * 60 * 200).toISOString(),
    driver: "Sarah Jenkins",
    terminal: "West Division",
    checkInDays: 5,
    status: "active",
    odometerPhotoVerified: true,
    tasks: generateTruckTasks("trk-ford-350", 89400, {
      "Oil & Filter": {
        intervalMiles: 7000,
        lastServicedMileage: 85000,
        nextDueMileage: 92000, // 2,600 mi left -> HEALTHY
        notes: "Motorcraft 10W-30 Super Duty Diesel."
      },
      "Fuel Filter / Water Separator": {
        intervalMiles: 14000,
        lastServicedMileage: 80000,
        nextDueMileage: 94000, // 4,600 mi left -> HEALTHY
        notes: "Dual Motorcraft FD-4615 filters."
      }
    }),
    serviceLogs: []
  }
];

// Helper to determine status:
// Good / Normal / Healthy: > 500 miles remaining (Green).
// Due Soon: 0 to 500 miles remaining (Amber/Yellow).
// Overdue: Negative remaining miles (Red).
export function getTaskStatus(remainingMiles) {
  if (remainingMiles < 0) {
    return {
      status: "overdue",
      label: "OVERDUE",
      badgeClass: "bg-red-500/10 text-red-600 dark:bg-rose-500/20 dark:text-rose-400 border border-red-500/20",
      dotClass: "bg-red-500",
      textColor: "text-red-600 dark:text-rose-400",
      borderGlow: "border-red-500/30",
      bgTint: "bg-red-50/50 dark:bg-rose-950/20"
    };
  } else if (remainingMiles <= 500) {
    return {
      status: "due_soon",
      label: "DUE SOON",
      badgeClass: "bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-300 border border-amber-500/20",
      dotClass: "bg-amber-500",
      textColor: "text-amber-600 dark:text-amber-300",
      borderGlow: "border-amber-500/30",
      bgTint: "bg-amber-50/50 dark:bg-amber-950/20"
    };
  } else {
    return {
      status: "good",
      label: "HEALTHY",
      badgeClass: "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 border border-emerald-500/20",
      dotClass: "bg-emerald-500",
      textColor: "text-emerald-600 dark:text-emerald-400",
      borderGlow: "border-emerald-500/20",
      bgTint: "bg-card"
    };
  }
}

export function formatMiles(num) {
  if (num === null || num === undefined || isNaN(num)) return "0";
  return Math.round(num).toLocaleString();
}

export function formatTimestamp(isoDate) {
  if (!isoDate) return "updated today";
  const date = new Date(isoDate);
  const now = new Date();
  const diffSec = Math.floor((now - date) / 1000);
  
  if (diffSec < 60) return "updated just now";
  if (diffSec < 3600) return `updated ${Math.floor(diffSec / 60)}m ago`;
  if (diffSec < 86400) return `updated today`;
  return `updated ${date.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;
}
