const SOURCE_COLORS_HEX: Record<string, string> = {
  "Google News - Cali":  "#4589ff",
  "Google News - Valle": "#1192e8",
  "90 Minutos":          "#be95ff",
  "Q'Hubo Cali":         "#009d9a",
  "Occidente":           "#33b1ff",
  "Alcaldía de Cali":    "#0f62fe",
  "El Tiempo - Cali":    "#ff832b",
  "RCN Radio":           "#da1e28",
};

const DEFAULT_HEX = "#4d6e8a";

export function SourceBadge({ source }: { source: string }) {
  const color = SOURCE_COLORS_HEX[source] ?? DEFAULT_HEX;
  return (
    <span
      className="inline-block px-1.5 py-0 text-xs"
      style={{
        color,
        border: `1px solid ${color}55`,
        backgroundColor: color + "14",
        letterSpacing: "0.03em",
      }}
    >
      {source}
    </span>
  );
}
