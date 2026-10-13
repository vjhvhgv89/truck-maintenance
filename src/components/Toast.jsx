import React, { useEffect } from "react";
import { CheckCircle2, AlertTriangle, Info, X } from "lucide-react";

export function Toast({ toast, onDismiss }) {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onDismiss();
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast, onDismiss]);

  if (!toast) return null;

  const isSuccess = toast.type === "success";
  const isWarning = toast.type === "warning";

  return (
    <div className="fixed bottom-5 right-5 z-50 max-w-sm w-full animate-in slide-in-from-bottom-5 duration-200">
      <div className={`p-4 rounded-xl border shadow-2xl flex items-start space-x-3 ${
        isSuccess
          ? "bg-slate-900 border-emerald-500/50 shadow-emerald-950/40"
          : isWarning
          ? "bg-slate-900 border-amber-500/50 shadow-amber-950/40"
          : "bg-slate-900 border-sky-500/50 shadow-sky-950/40"
      }`}>
        <div className="flex-shrink-0 mt-0.5">
          {isSuccess ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          ) : isWarning ? (
            <AlertTriangle className="w-5 h-5 text-amber-400" />
          ) : (
            <Info className="w-5 h-5 text-sky-400" />
          )}
        </div>
        <div className="flex-1">
          <h5 className="text-xs font-bold text-white">{toast.title}</h5>
          <p className="text-xs text-slate-300 mt-0.5">{toast.message}</p>
        </div>
        <button
          onClick={onDismiss}
          className="text-slate-400 hover:text-white transition"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
