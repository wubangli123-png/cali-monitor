"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { RefreshCw } from "lucide-react";

const REFRESH_INTERVAL = 30 * 60; // 30 minutes in seconds

function formatCountdown(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function RefreshController({ fetchedAt }: { fetchedAt: string }) {
  const router = useRouter();
  const [remaining, setRemaining] = useState(REFRESH_INTERVAL);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const doRefresh = useCallback(() => {
    setIsRefreshing(true);
    router.refresh();
    setRemaining(REFRESH_INTERVAL);
    setTimeout(() => setIsRefreshing(false), 1500);
  }, [router]);

  useEffect(() => {
    const interval = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          doRefresh();
          return REFRESH_INTERVAL;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [doRefresh]);

  const fetchedDate = new Date(fetchedAt);
  const timeStr = fetchedDate.toLocaleTimeString("es-CO", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="flex items-center gap-3 text-sm">
      <span className="text-gray-300 hidden sm:inline">
        Actualizado: {timeStr}
      </span>
      <span className="text-gray-400 font-mono text-xs">
        {formatCountdown(remaining)}
      </span>
      <button
        onClick={doRefresh}
        disabled={isRefreshing}
        className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-medium transition-colors disabled:opacity-50"
      >
        <RefreshCw
          className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`}
        />
        Actualizar
      </button>
    </div>
  );
}
