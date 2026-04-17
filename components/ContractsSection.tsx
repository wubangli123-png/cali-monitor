"use client";

import { useState, useMemo } from "react";
import { Contract } from "@/lib/contracts";
import { ContractCard } from "./ContractCard";

const ALL = "Todos";

export function ContractsSection({ contracts }: { contracts: Contract[] }) {
  const [activeEstado, setActiveEstado] = useState<string>(ALL);
  const [activeTipo,   setActiveTipo]   = useState<string>(ALL);

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

      <div className="mb-4 p-5 terminal-panel">
        <div className="flex items-center justify-between mb-4">
          <p className="text-lg tracking-wider" style={{ color: "var(--white)" }}>
            ▶ CONTRATOS{" "}
            <span style={{ color: "var(--yellow)" }}>
              — {filtered.length} resultado{filtered.length !== 1 ? "s" : ""}
            </span>
          </p>
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

        {/* Estado pills */}
        <div className="flex flex-wrap gap-2 mb-3">
          <Pill label="TODOS" active={activeEstado === ALL} color="var(--white)"
            onClick={() => setActiveEstado(ALL)} />
          {estados.map((e) => (
            <Pill key={e} label={e} active={activeEstado === e} color="var(--yellow)"
              onClick={() => setActiveEstado(activeEstado === e ? ALL : e)} />
          ))}
        </div>

        {/* Tipo pills */}
        {tipos.length > 1 && (
          <div className="flex flex-wrap gap-2 pt-3" style={{ borderTop: "1px solid var(--border)" }}>
            <span className="text-base self-center mr-2" style={{ color: "var(--yellow)" }}>TIPO:</span>
            <Pill label="TODOS" active={activeTipo === ALL} color="var(--white)"
              onClick={() => setActiveTipo(ALL)} />
            {tipos.map((t) => (
              <Pill key={t} label={t} active={activeTipo === t} color="var(--green)"
                onClick={() => setActiveTipo(activeTipo === t ? ALL : t)} />
            ))}
          </div>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20 text-lg" style={{ color: "var(--yellow)" }}>
          &gt; SIN RESULTADOS PARA ESTE FILTRO_
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map((c) => <ContractCard key={c.id} contract={c} />)}
        </div>
      )}

    </section>
  );
}

function Pill({ label, active, color, onClick }: {
  label: string; active: boolean; color: string; onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="px-3 py-1.5 text-base transition-all"
      style={{
        color: active ? "#000" : color,
        backgroundColor: active ? color : "transparent",
        border: `2px solid ${color}`,
        fontFamily: "inherit",
        letterSpacing: "0.03em",
        fontWeight: active ? "bold" : "normal",
        opacity: active ? 1 : 0.75,
      }}
    >
      {label}
    </button>
  );
}
