"use client";

import { useState, useMemo } from "react";
import { Contract, formatCOP } from "@/lib/contracts";
import { ContractCard } from "./ContractCard";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

const ALL = "Todos";
type View = "grid" | "table";

const ESTADO_COLORS: Record<string, string> = {
  activo:    "var(--green)",
  ejecuci:   "var(--green)",
  cerrado:   "var(--yellow)",
  terminado: "var(--orange)",
  liquidado: "var(--text-muted)",
  suspendido:"var(--red)",
};
function estadoColor(estado: string) {
  const key = estado.toLowerCase();
  for (const [p, c] of Object.entries(ESTADO_COLORS)) if (key.includes(p)) return c;
  return "var(--white)";
}

export function ContractsSection({ contracts }: { contracts: Contract[] }) {
  const [activeEstado, setActiveEstado] = useState<string>(ALL);
  const [activeTipo,   setActiveTipo]   = useState<string>(ALL);
  const [view,         setView]         = useState<View>("grid");

  const estados = useMemo(() => {
    const counts = new Map<string, number>();
    for (const c of contracts) counts.set(c.estado, (counts.get(c.estado) ?? 0) + 1);
    return [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([e]) => e);
  }, [contracts]);

  const tipos = useMemo(() => {
    const counts = new Map<string, number>();
    for (const c of contracts) counts.set(c.tipo, (counts.get(c.tipo) ?? 0) + 1);
    return [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([t]) => t);
  }, [contracts]);

  const filtered = useMemo(() =>
    contracts.filter((c) => {
      const okEstado = activeEstado === ALL || c.estado === activeEstado;
      const okTipo   = activeTipo   === ALL || c.tipo   === activeTipo;
      return okEstado && okTipo;
    }),
    [contracts, activeEstado, activeTipo]
  );

  const hasFilters = activeEstado !== ALL || activeTipo !== ALL;

  return (
    <section className="flex-1 w-full px-6 py-4">

      {/* Filter bar */}
      <div className="mb-4 p-5 terminal-panel">
        <div className="flex items-center justify-between mb-4 gap-2 flex-wrap">
          <p className="text-lg tracking-wider" style={{ color: "var(--white)" }}>
            ▶ CONTRATOS{" "}
            <span style={{ color: "var(--yellow)" }}>
              — {filtered.length} resultado{filtered.length !== 1 ? "s" : ""}
            </span>
          </p>
          <div className="flex items-center gap-2">
            {/* View toggle */}
            <button
              onClick={() => setView(view === "grid" ? "table" : "grid")}
              className="text-base px-4 py-1.5 font-bold transition-colors"
              style={{
                color: "#000",
                backgroundColor: "var(--green)",
                border: "none",
                fontFamily: "inherit",
              }}
            >
              {view === "grid" ? "[TABLA]" : "[MÓDULOS]"}
            </button>
            {hasFilters && (
              <button
                onClick={() => { setActiveEstado(ALL); setActiveTipo(ALL); }}
                className="text-base px-4 py-1.5 font-bold"
                style={{ color: "#000", backgroundColor: "var(--red)", border: "none", fontFamily: "inherit" }}
              >
                [LIMPIAR ×]
              </button>
            )}
          </div>
        </div>

        {/* Estado pills */}
        <div className="flex flex-wrap gap-2 mb-3">
          <Pill label="TODOS" active={activeEstado === ALL} color="var(--white)" onClick={() => setActiveEstado(ALL)} />
          {estados.map((e) => (
            <Pill key={e} label={e} active={activeEstado === e} color="var(--yellow)"
              onClick={() => setActiveEstado(activeEstado === e ? ALL : e)} />
          ))}
        </div>

        {/* Tipo pills */}
        {tipos.length > 1 && (
          <div className="flex flex-wrap gap-2 pt-3" style={{ borderTop: "1px solid var(--border)" }}>
            <span className="text-base self-center mr-2" style={{ color: "var(--yellow)" }}>TIPO:</span>
            <Pill label="TODOS" active={activeTipo === ALL} color="var(--white)" onClick={() => setActiveTipo(ALL)} />
            {tipos.map((t) => (
              <Pill key={t} label={t} active={activeTipo === t} color="var(--green)"
                onClick={() => setActiveTipo(activeTipo === t ? ALL : t)} />
            ))}
          </div>
        )}
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 text-lg" style={{ color: "var(--yellow)" }}>
          &gt; SIN RESULTADOS PARA ESTE FILTRO_
        </div>
      ) : view === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map((c) => <ContractCard key={c.id} contract={c} />)}
        </div>
      ) : (
        <TableView contracts={filtered} />
      )}
    </section>
  );
}

function TableView({ contracts }: { contracts: Contract[] }) {
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{
        width: "100%",
        borderCollapse: "collapse",
        fontFamily: "inherit",
        fontSize: "0.82rem",
      }}>
        <thead>
          <tr style={{ borderBottom: "1px solid var(--yellow)" }}>
            {["ESTADO", "ENTIDAD", "OBJETO", "TIPO", "VALOR", "FIRMA"].map((h) => (
              <th key={h} style={{
                textAlign: "left",
                padding: "6px 10px",
                color: "var(--yellow)",
                letterSpacing: "0.1em",
                fontWeight: "normal",
                whiteSpace: "nowrap",
              }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {contracts.map((c, i) => {
            const color = estadoColor(c.estado);
            const timeAgo = c.fechaFirma
              ? formatDistanceToNow(new Date(c.fechaFirma), { addSuffix: true, locale: es })
              : "—";
            return (
              <tr key={c.id}
                style={{ borderBottom: "1px solid var(--border)", backgroundColor: i % 2 === 0 ? "transparent" : "#0d0d0d" }}>
                <td style={{ padding: "8px 10px", whiteSpace: "nowrap" }}>
                  <span style={{ color: "#000", backgroundColor: color, padding: "1px 6px", fontSize: "0.72rem", fontWeight: "bold" }}>
                    {c.estado}
                  </span>
                </td>
                <td style={{ padding: "8px 10px", color: "var(--yellow)", maxWidth: 180 }}>
                  <span style={{ display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {c.entidad}
                  </span>
                </td>
                <td style={{ padding: "8px 10px", color: "var(--white)", maxWidth: 260 }}>
                  {c.url ? (
                    <a href={c.url} target="_blank" rel="noopener noreferrer"
                      style={{ color: "var(--white)", textDecoration: "none" }}
                      className="hover:underline">
                      <span style={{ display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {c.objeto}
                      </span>
                    </a>
                  ) : (
                    <span style={{ display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {c.objeto}
                    </span>
                  )}
                </td>
                <td style={{ padding: "8px 10px", color: "var(--text-muted)", whiteSpace: "nowrap" }}>
                  {c.tipo}
                </td>
                <td style={{ padding: "8px 10px", color, whiteSpace: "nowrap", fontWeight: "bold" }}>
                  {formatCOP(c.valor)}
                </td>
                <td style={{ padding: "8px 10px", color: "var(--text-muted)", whiteSpace: "nowrap" }}>
                  {timeAgo}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function Pill({ label, active, color, onClick }: {
  label: string; active: boolean; color: string; onClick: () => void;
}) {
  return (
    <button onClick={onClick} className="px-3 py-1.5 text-base transition-all"
      style={{
        color: active ? "#000" : color,
        backgroundColor: active ? color : "transparent",
        border: `2px solid ${color}`,
        fontFamily: "inherit",
        letterSpacing: "0.03em",
        fontWeight: active ? "bold" : "normal",
        opacity: active ? 1 : 0.75,
      }}>
      {label}
    </button>
  );
}
