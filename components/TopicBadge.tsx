import { Topic } from "@/lib/types";

const TOPIC_STYLES: Record<Topic, string> = {
  "Seguridad Pública":      "bg-red-900/50 text-red-300 border border-red-700/50",
  "Salud":                  "bg-teal-900/50 text-teal-300 border border-teal-700/50",
  "Educación":              "bg-indigo-900/50 text-indigo-300 border border-indigo-700/50",
  "Infraestructura y Obras":"bg-cyan-900/50 text-cyan-300 border border-cyan-700/50",
  "Movilidad y Transporte": "bg-sky-900/50 text-sky-300 border border-sky-700/50",
  "Medio Ambiente":         "bg-green-900/50 text-green-300 border border-green-700/50",
  "Desarrollo Social":      "bg-pink-900/50 text-pink-300 border border-pink-700/50",
  "Desarrollo Económico":   "bg-amber-900/50 text-amber-300 border border-amber-700/50",
  "Gobernanza":             "bg-blue-900/50 text-blue-300 border border-blue-700/50",
  "Judicial":               "bg-orange-900/50 text-orange-300 border border-orange-700/50",
  "Cultura y Eventos":      "bg-purple-900/50 text-purple-300 border border-purple-700/50",
  "Emergencias":            "bg-rose-900/50 text-rose-300 border border-rose-700/50",
  "General":                "bg-slate-800/50 text-slate-400 border border-slate-600/50",
};

export function TopicBadge({ topic }: { topic?: Topic }) {
  if (!topic) return null;
  return (
    <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${TOPIC_STYLES[topic]}`}>
      {topic}
    </span>
  );
}

export const TOPIC_COLORS_HEX: Record<Topic, string> = {
  "Seguridad Pública":      "#f87171",
  "Salud":                  "#2dd4bf",
  "Educación":              "#818cf8",
  "Infraestructura y Obras":"#22d3ee",
  "Movilidad y Transporte": "#38bdf8",
  "Medio Ambiente":         "#4ade80",
  "Desarrollo Social":      "#f472b6",
  "Desarrollo Económico":   "#fbbf24",
  "Gobernanza":             "#60a5fa",
  "Judicial":               "#fb923c",
  "Cultura y Eventos":      "#c084fc",
  "Emergencias":            "#fb7185",
  "General":                "#64748b",
};
