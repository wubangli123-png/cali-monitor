import { Topic } from "@/lib/types";

export function TopicBadge({ topic }: { topic?: Topic }) {
  if (!topic) return null;
  const color = TOPIC_COLORS_HEX[topic] ?? "#7a5200";
  return (
    <span
      className="inline-block px-1.5 py-0 text-xs"
      style={{
        color,
        border: `1px solid ${color}88`,
        backgroundColor: color + "18",
        letterSpacing: "0.05em",
      }}
    >
      [{topic}]
    </span>
  );
}

export const TOPIC_COLORS_HEX: Record<Topic, string> = {
  "Seguridad Pública":       "#ff4444",
  "Salud":                   "#ff9933",
  "Educación":               "#ffcc00",
  "Infraestructura y Obras": "#ffaa00",
  "Movilidad y Transporte":  "#ffbb44",
  "Medio Ambiente":          "#88dd00",
  "Desarrollo Social":       "#ff8800",
  "Desarrollo Económico":    "#ffd700",
  "Gobernanza":              "#ffb000",
  "Judicial":                "#ff6600",
  "Cultura y Eventos":       "#ffaa55",
  "Emergencias":             "#ff2200",
  "General":                 "#7a5200",
};
