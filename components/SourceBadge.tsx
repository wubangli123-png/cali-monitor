const SOURCE_COLORS: Record<string, string> = {
  "Google News - Cali": "bg-blue-100 text-blue-700",
  "Google News - Valle": "bg-indigo-100 text-indigo-700",
  "El Tiempo - Cali": "bg-orange-100 text-orange-700",
  "RCN Radio": "bg-red-100 text-red-700",
};

const DEFAULT_COLOR = "bg-gray-100 text-gray-700";

export function SourceBadge({ source }: { source: string }) {
  const color = SOURCE_COLORS[source] ?? DEFAULT_COLOR;
  return (
    <span
      className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${color}`}
    >
      {source}
    </span>
  );
}
