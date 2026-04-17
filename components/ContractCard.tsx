import { Contract, formatCOP } from "@/lib/contracts";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

const ESTADO_COLORS: Record<string, string> = {
  activo:      "var(--green)",
  ejecuci:     "var(--green)",   // "En ejecución"
  cerrado:     "var(--yellow)",
  terminado:   "var(--orange)",
  liquidado:   "var(--text-muted)",
  suspendido:  "var(--red)",
};

function estadoColor(estado: string): string {
  const key = estado.toLowerCase();
  for (const [pattern, color] of Object.entries(ESTADO_COLORS)) {
    if (key.includes(pattern)) return color;
  }
  return "var(--white)";
}

export function ContractCard({ contract: c }: { contract: Contract }) {
  const color = estadoColor(c.estado);
  const timeAgo = c.fechaFirma
    ? formatDistanceToNow(new Date(c.fechaFirma), { addSuffix: true, locale: es })
    : "";

  return (
    <article className="article-card p-4 flex flex-col gap-3">

      {/* Meta row */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="inline-block px-2 py-0 text-sm font-bold"
            style={{ color: "#000", backgroundColor: color }}>
            {c.estado}
          </span>
          <span className="inline-block px-2 py-0 text-sm"
            style={{ color: "var(--yellow)", border: "1px solid var(--border)" }}>
            {c.tipo}
          </span>
          {c.esPyme && (
            <span className="inline-block px-2 py-0 text-sm"
              style={{ color: "var(--green)", border: "1px solid var(--green)55", backgroundColor: "#00dd4414" }}>
              PyME
            </span>
          )}
        </div>
        <span className="text-sm" style={{ color: "var(--yellow)" }}>{timeAgo}</span>
      </div>

      {/* Objeto */}
      {c.url ? (
        <a href={c.url} target="_blank" rel="noopener noreferrer" className="group">
          <h2 className="text-lg leading-snug line-clamp-3" style={{ color: "var(--white)" }}>
            <span style={{ color: "var(--yellow)" }}>›</span>{" "}
            <span className="group-hover:underline">{c.objeto}</span>
          </h2>
        </a>
      ) : (
        <h2 className="text-lg leading-snug line-clamp-3" style={{ color: "var(--white)" }}>
          <span style={{ color: "var(--yellow)" }}>›</span> {c.objeto}
        </h2>
      )}

      {/* Entidad + proveedor */}
      <div className="flex flex-col gap-0.5">
        <p className="text-base line-clamp-1" style={{ color: "var(--yellow)" }}>
          <span style={{ color: "var(--text-muted)" }}>Entidad: </span>{c.entidad}
        </p>
        <p className="text-base line-clamp-1" style={{ color: "var(--white)" }}>
          <span style={{ color: "var(--text-muted)" }}>Contratista: </span>{c.proveedor}
        </p>
      </div>

      {/* Valor + duración */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <span className="text-base font-bold" style={{ color: color }}>
          {formatCOP(c.valor)}
        </span>
        <span className="text-sm" style={{ color: "var(--text-muted)" }}>
          {c.duracion}
        </span>
      </div>

    </article>
  );
}
