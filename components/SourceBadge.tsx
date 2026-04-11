const SOURCE_COLORS_HEX: Record<string, string> = {
  "Google News - Cali":  "#ffb000",
  "Google News - Valle": "#ff9900",
  "90 Minutos":          "#ffd700",
  "Q'Hubo Cali":         "#ff8800",
  "Occidente":           "#ffaa44",
  "Alcaldía de Cali":    "#ffcc00",
  "El Tiempo - Cali":    "#ff6600",
  "RCN Radio":           "#ff4400",
};

const DEFAULT_HEX = "#7a5200";

export function SourceBadge({ source }: { source: string }) {
  const color = SOURCE_COLORS_HEX[source] ?? DEFAULT_HEX;
  return (
    <span
      className="inline-block px-1.5 py-0 text-xs"
      style={{
        color,
        border: `1px solid ${color}66`,
        backgroundColor: color + "14",
        letterSpacing: "0.03em",
      }}
    >
      {source}
    </span>
  );
}
