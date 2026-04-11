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
      className="sticky top-0 z-10 px-6 py-2"
      style={{
        backgroundColor: "#010810",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <span style={{ color: "var(--accent-bright)" }}>▶</span>
          <h1 className="text-sm tracking-widest uppercase" style={{ color: "var(--text-primary)" }}>
            SISTEMA DE MONITOREO MUNICIPAL
            <span className="hidden sm:inline" style={{ color: "var(--text-muted)" }}>
              {" "}::{" "}CALI, COL.
            </span>
          </h1>
          <span className="hidden sm:flex items-center gap-1.5 text-xs" style={{ color: "var(--text-muted)" }}>
            <span className="cursor-blink" style={{ color: "#42be65" }}>●</span>
            {" "}EN LÍNEA
          </span>
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>
            [{total} REG]
          </span>
        </div>
        <RefreshController fetchedAt={fetchedAt} />
      </div>
    </header>
  );
}
