import { MapPin } from "lucide-react";
import { RefreshController } from "./RefreshController";

export function Header({
  total,
  fetchedAt,
}: {
  total: number;
  fetchedAt: string;
}) {
  return (
    <header className="bg-gray-900 text-white px-4 py-4 sticky top-0 z-10 shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <MapPin className="w-5 h-5 text-green-400" />
          <div>
            <h1 className="text-lg font-bold leading-tight">
              Monitor Cali
            </h1>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 text-xs text-green-400">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />
                </span>
                EN VIVO
              </span>
              <span className="text-xs text-gray-400">
                {total} artículos
              </span>
            </div>
          </div>
        </div>
        <RefreshController fetchedAt={fetchedAt} />
      </div>
    </header>
  );
}
