import { Suspense } from "react";
import { fetchContracts, getContractStats } from "@/lib/contracts";
import { Header } from "@/components/Header";
import { NavTabs } from "@/components/NavTabs";
import { ContractsDashboard } from "@/components/ContractsDashboard";
import { ContractFilters } from "@/components/ContractFilters";
import { ContractsSection } from "@/components/ContractsSection";

export default async function ContratosPage({
  searchParams,
}: {
  searchParams: Promise<{ desde?: string; hasta?: string }>;
}) {
  const { desde, hasta } = await searchParams;

  const contracts = await fetchContracts({
    desde,
    hasta,
    limite: desde || hasta ? 200 : 6,
  });

  const stats = getContractStats(contracts);

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "var(--bg-base)" }}>
      <Header />

      <div className="px-6 pt-5 pb-4" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <h1 className="text-3xl tracking-wider uppercase" style={{ color: "var(--white)" }}>
            ▶ Contratos SECOP II
          </h1>
          <NavTabs active="contratos" />
        </div>
        <p className="text-base mt-1" style={{ color: "var(--yellow)" }}>
          Municipio de Santiago de Cali &nbsp;·&nbsp;{" "}
          <a href="https://www.datos.gov.co/resource/jbjy-vk9h.json"
            target="_blank" rel="noopener noreferrer"
            style={{ color: "var(--green)" }} className="hover:underline">
            datos.gov.co
          </a>
        </p>
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          Creado por: Nicolás Cardona
        </p>
      </div>

      <Suspense fallback={
        <div className="mx-6 mt-5 terminal-panel p-5 text-base" style={{ color: "var(--yellow)" }}>
          &gt; Cargando filtros…
        </div>
      }>
        <ContractFilters />
      </Suspense>

      {contracts.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-lg" style={{ color: "var(--yellow)" }}>
          &gt; SIN CONTRATOS DISPONIBLES. Verifica la conexión con datos.gov.co_
        </div>
      ) : (
        <>
          <ContractsDashboard stats={stats} />
          <ContractsSection contracts={contracts} />
        </>
      )}

      <footer className="text-center text-xs py-4"
        style={{ color: "var(--text-muted)", borderTop: "1px solid var(--border)" }}>
        Cali Monitor · {new Date().getFullYear()}
      </footer>
    </div>
  );
}
