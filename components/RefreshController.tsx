"use client";

import { useEffect, useState, useCallback, useTransition } from "react";
import { useRouter } from "next/navigation";
import { RefreshCw } from "lucide-react";

const REFRESH_INTERVAL = 30 * 60;

function formatCountdown(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function RefreshController({ fetchedAt }: { fetchedAt: string }) {
  const router = useRouter();
  const [remaining, setRemaining] = useState(REFRESH_INTERVAL);
  const [isPending, startTransition] = useTransition();

  const doRefresh = useCallback(() => {
    startTransition(() => {
      router.refresh();
    });
    setRemaining(REFRESH_INTERVAL);
  }, [router]);

  useEffect(() => {
    const interval = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) { doRefresh(); return REFRESH_INTERVAL; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [doRefresh]);

  const timeStr = new Date(fetchedAt).toLocaleTimeString("es-CO", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="flex items-center gap-3 text-xs" style={{ color: "var(--text-muted)" }}>
      <span className="hidden sm:inline">Act. {timeStr}</span>
      <span className="font-mono" style={{ color: isPending ? "#fbbf24" : "var(--accent)" }}>
        {isPending ? "actualizando…" : formatCountdown(remaining)}
      </span>
      <button
        onClick={doRefresh}
        disabled={isPending}
        className="flex items-center gap-1 px-2.5 py-1.5 rounded text-white text-xs font-medium transition-colors disabled:opacity-50"
        style={{ backgroundColor: "var(--border)" }}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#2d4a7a")}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "var(--border)")}
      >
        <RefreshCw className={`w-3 h-3 ${isPending ? "animate-spin" : ""}`} />
        Actualizar
      </button>
    </div>
  );
}
