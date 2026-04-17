const SECOP_URL = "https://www.datos.gov.co/resource/jbjy-vk9h.json";

export interface Contract {
  id: string;
  entidad: string;
  sector: string;
  objeto: string;
  tipo: string;
  modalidad: string;
  estado: string;
  valor: number;
  valorPagado: number;
  valorPendiente: number;
  fechaFirma: string;
  fechaInicio: string;
  fechaFin: string;
  proveedor: string;
  esPyme: boolean;
  duracion: string;
  url: string;
  ciudad: string;
}

export interface ContractStats {
  total: number;
  valorTotal: number;
  activos: number;
  pymes: number;
  porTipo: { tipo: string; count: number }[];
  porEstado: { estado: string; count: number }[];
}

export interface FetchContractsOptions {
  desde?: string;   // "YYYY-MM-DD"
  hasta?: string;   // "YYYY-MM-DD"
  limite?: number;
}

function buildUrl({ desde, hasta, limite = 20 }: FetchContractsOptions): string {
  const params = new URLSearchParams();

  if (desde || hasta) {
    const conds = ["ciudad='Cali'"];
    if (desde) conds.push(`fecha_de_firma >= '${desde}T00:00:00.000'`);
    if (hasta) conds.push(`fecha_de_firma <= '${hasta}T23:59:59.000'`);
    params.set("$where", conds.join(" AND "));
  } else {
    params.set("ciudad", "Cali");
  }

  params.set("$limit", String(limite));
  params.set("$order", "fecha_de_firma DESC");

  return `${SECOP_URL}?${params.toString()}`;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalize(raw: any): Contract {
  return {
    id:             raw.id_contrato ?? raw.referencia_del_contrato ?? String(Math.random()),
    entidad:        raw.nombre_entidad ?? "—",
    sector:         raw.sector ?? "—",
    objeto:         raw.objeto_del_contrato ?? raw.descripcion_del_proceso ?? "—",
    tipo:           raw.tipo_de_contrato ?? "—",
    modalidad:      raw.modalidad_de_contratacion ?? "—",
    estado:         raw.estado_contrato ?? "—",
    valor:          Number(raw.valor_del_contrato) || 0,
    valorPagado:    Number(raw.valor_pagado) || 0,
    valorPendiente: Number(raw.valor_pendiente_de_ejecucion) || 0,
    fechaFirma:     raw.fecha_de_firma ?? "",
    fechaInicio:    raw.fecha_de_inicio_del_contrato ?? "",
    fechaFin:       raw.fecha_de_fin_del_contrato ?? "",
    proveedor:      raw.proveedor_adjudicado ?? "—",
    esPyme:         raw.es_pyme === "Sí" || raw.es_pyme === "Si" || raw.es_pyme === "1",
    duracion:       raw.duraci_n_del_contrato ?? "—",
    url:            raw.urlproceso?.url ?? raw.urlproceso ?? "",
    ciudad:         raw.ciudad ?? "Cali",
  };
}

export async function fetchContracts(options: FetchContractsOptions = {}): Promise<Contract[]> {
  const url = buildUrl(options);
  try {
    const res = await fetch(url, { next: { revalidate: 1800 } });
    if (!res.ok) {
      console.error(`[secop] HTTP ${res.status} — ${url}`);
      return [];
    }
    const data = await res.json();
    return (Array.isArray(data) ? data : []).map(normalize);
  } catch (err) {
    console.error("[secop] fetch failed:", err);
    return [];
  }
}

export function getContractStats(contracts: Contract[]): ContractStats {
  const valorTotal = contracts.reduce((s, c) => s + c.valor, 0);
  const activos    = contracts.filter((c) => c.estado.toLowerCase().includes("activo") || c.estado.toLowerCase().includes("ejecuci")).length;
  const pymes      = contracts.filter((c) => c.esPyme).length;

  const tipoMap = new Map<string, number>();
  const estadoMap = new Map<string, number>();
  for (const c of contracts) {
    tipoMap.set(c.tipo,     (tipoMap.get(c.tipo)     ?? 0) + 1);
    estadoMap.set(c.estado, (estadoMap.get(c.estado) ?? 0) + 1);
  }

  return {
    total: contracts.length,
    valorTotal,
    activos,
    pymes,
    porTipo:   [...tipoMap.entries()].sort((a, b) => b[1] - a[1]).map(([tipo, count])   => ({ tipo, count })),
    porEstado: [...estadoMap.entries()].sort((a, b) => b[1] - a[1]).map(([estado, count]) => ({ estado, count })),
  };
}

export function formatCOP(value: number): string {
  if (value >= 1_000_000_000)
    return `$${(value / 1_000_000_000).toFixed(1)}B`;
  if (value >= 1_000_000)
    return `$${(value / 1_000_000).toFixed(1)}M`;
  return new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(value);
}
