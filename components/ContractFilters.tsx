"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export function ContractFilters() {
  const router       = useRouter();
  const searchParams = useSearchParams();

  const [desde, setDesde] = useState(searchParams.get("desde") ?? "");
  const [hasta, setHasta] = useState(searchParams.get("hasta") ?? "");

  function apply() {
    const params = new URLSearchParams();
    if (desde) params.set("desde", desde);
    if (hasta) params.set("hasta", hasta);
    router.push(`/contratos${params.size ? "?" + params.toString() : ""}`);
  }

  function clear() {
    setDesde("");
    setHasta("");
    router.push("/contratos");
  }

  const hasFilters = desde || hasta;

  return (
    <div className="terminal-panel p-5 mx-6 mt-5">
      <div className="panel-title">▶ FILTRAR POR FECHA DE FIRMA</div>
      <div className="flex flex-wrap items-end gap-4">

        <label className="flex flex-col gap-1">
          <span className="text-xs tracking-widest" style={{ color: "var(--yellow)" }}>// DESDE</span>
          <input
            type="date"
            value={desde}
            onChange={(e) => setDesde(e.target.value)}
            className="text-base px-3 py-1.5"
            style={{
              backgroundColor: "#1a1a1a",
              border: "1px solid var(--border)",
              color: "var(--white)",
              fontFamily: "inherit",
              colorScheme: "dark",
            }}
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-xs tracking-widest" style={{ color: "var(--yellow)" }}>// HASTA</span>
          <input
            type="date"
            value={hasta}
            onChange={(e) => setHasta(e.target.value)}
            className="text-base px-3 py-1.5"
            style={{
              backgroundColor: "#1a1a1a",
              border: "1px solid var(--border)",
              color: "var(--white)",
              fontFamily: "inherit",
              colorScheme: "dark",
            }}
          />
        </label>

        <button
          onClick={apply}
          className="text-base px-5 py-1.5 font-bold"
          style={{ backgroundColor: "var(--green)", color: "#000", border: "none", fontFamily: "inherit" }}
        >
          [APLICAR]
        </button>

        {hasFilters && (
          <button
            onClick={clear}
            className="text-base px-4 py-1.5 font-bold"
            style={{ backgroundColor: "var(--red)", color: "#000", border: "none", fontFamily: "inherit" }}
          >
            [LIMPIAR ×]
          </button>
        )}
      </div>
    </div>
  );
}
