import Link from "next/link";
import { RefreshController } from "./RefreshController";

type ActivePage = "noticias" | "contratos";

function NavTab({ href, label, active }: { href: string; label: string; active: boolean }) {
  return (
    <Link href={href}
      className="text-xs px-3 py-1 tracking-widest transition-colors"
      style={{
        fontFamily: "inherit",
        color:           active ? "#000"              : "var(--yellow)",
        backgroundColor: active ? "var(--yellow)"     : "transparent",
        border:          "1px solid var(--yellow)",
        textDecoration:  "none",
      }}
    >
      {label}
    </Link>
  );
}

export function Header({
  total,
  fetchedAt,
  activePage = "noticias",
}: {
  total?: number;
  fetchedAt?: string;
  activePage?: ActivePage;
}) {
  return (
    <header className="sticky top-0 z-10 px-6 py-2"
      style={{ backgroundColor: "#080808", borderBottom: "1px solid var(--border)" }}>
      <div className="flex items-center justify-between gap-4">

        <div className="flex items-center gap-4">
          <span style={{ color: "var(--yellow)" }}>▶</span>
          <h1 className="text-sm tracking-widest uppercase" style={{ color: "var(--white)" }}>
            MONITOR CALI
            <span className="hidden sm:inline" style={{ color: "var(--yellow)" }}>
              {" "}::{" "}SISTEMA DE MONITOREO MUNICIPAL
            </span>
          </h1>
          <span className="hidden sm:flex items-center gap-1.5 text-xs" style={{ color: "var(--yellow)" }}>
            <span className="cursor-blink" style={{ color: "var(--green)" }}>●</span>
            {" "}EN LÍNEA
          </span>
          {total !== undefined && (
            <span className="text-xs" style={{ color: "var(--yellow)" }}>
              [{total} REG]
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <NavTab href="/"          label="NOTICIAS"  active={activePage === "noticias"}  />
          <NavTab href="/contratos" label="CONTRATOS" active={activePage === "contratos"} />
          {fetchedAt && <RefreshController fetchedAt={fetchedAt} />}
        </div>

      </div>
    </header>
  );
}
