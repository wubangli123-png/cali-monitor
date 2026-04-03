const SOURCE_COLORS: Record<string, string> = {
  "Google News - Cali":  "bg-blue-900/40 text-blue-300 border border-blue-700/40",
  "Google News - Valle": "bg-indigo-900/40 text-indigo-300 border border-indigo-700/40",
  "90 Minutos":          "bg-yellow-900/40 text-yellow-300 border border-yellow-700/40",
  "Q'Hubo Cali":         "bg-green-900/40 text-green-300 border border-green-700/40",
  "Occidente":           "bg-teal-900/40 text-teal-300 border border-teal-700/40",
  "Alcaldía de Cali":    "bg-purple-900/40 text-purple-300 border border-purple-700/40",
  "El Tiempo - Cali":    "bg-orange-900/40 text-orange-300 border border-orange-700/40",
  "RCN Radio":           "bg-red-900/40 text-red-300 border border-red-700/40",
};

const DEFAULT_COLOR = "bg-slate-800/40 text-slate-400 border border-slate-600/40";

export function SourceBadge({ source }: { source: string }) {
  const color = SOURCE_COLORS[source] ?? DEFAULT_COLOR;
  return (
    <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${color}`}>
      {source}
    </span>
  );
}
