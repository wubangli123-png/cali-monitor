import { MapPin } from "lucide-react";
import { RefreshController } from "./RefreshController";

export function Header({
  total,
  fetchedAt,
}: {
  total: number;
  fetchedAt: string;
}) {
  return (
    <header
      className="sticky top-0 z-10 px-4 py-3"
      style={{
        backgroundColor: "#050b17",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <MapPin className="w-4 h-4 text-sky-400" />
          <div className="flex items-center gap-3">
            <h1 className="text-sm font-bold tracking-widest uppercase text-white">
              Monitor Cali
            </h1>
            <span
              className="hidden sm:flex items-center gap-1.5 text-xs"
              style={{ color: "var(--text-muted)" }}
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-400" />
              </span>
              EN VIVO
            </span>
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>
              {total} artículos
            </span>
          </div>
        </div>
        <RefreshController fetchedAt={fetchedAt} />
      </div>
    </header>
  );
}
