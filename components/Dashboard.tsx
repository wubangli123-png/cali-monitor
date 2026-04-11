import { DashboardStats, Topic } from "@/lib/types";
import { DayBucket, WordFreq, NeighborhoodArticle } from "@/lib/stats";
import { TOPIC_COLORS_HEX } from "./TopicBadge";
import { WeeklyChart } from "./charts/WeeklyChart";
import { WordCloud } from "./charts/WordCloud";
import { MapPanel } from "./MapPanel";

function asciBar(pct: number, total = 28): string {
  const filled = Math.round((pct / 100) * total);
  return "█".repeat(filled) + "░".repeat(total - filled);
}

function Panel({ title, children, className }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`terminal-panel p-5 ${className ?? ""}`}>
      <div className="panel-title">▶ {title}</div>
      {children}
    </div>
  );
}

function KpiBlock({ label, value, accent }: { label: string; value: number | string; accent?: string }) {
  return (
    <div className="terminal-panel p-4 flex flex-col gap-1">
      <span className="text-xs tracking-widest" style={{ color: "var(--accent-dim)" === "var(--accent-dim)" ? "var(--text-muted)" : "var(--text-muted)" }}>
        // {label}
      </span>
      <span className="text-3xl tabular-nums" style={{ color: accent ?? "var(--accent-bright)", lineHeight: 1.1 }}>
        {value}
      </span>
    </div>
  );
}

export function Dashboard({
  stats, weekly, words, neighborhoodArticles, dailySummary,
}: {
  stats: DashboardStats;
  weekly: DayBucket[];
  words: WordFreq[];
  neighborhoodArticles: NeighborhoodArticle[];
  dailySummary: string;
}) {
  const maxCount24h = stats.byTopic24h[0]?.count ?? 1;

  return (
    <section className="w-full px-6 pt-5 pb-2 flex flex-col gap-4">

      {/* Site header */}
      <div className="flex flex-col gap-0.5 border-b pb-3" style={{ borderColor: "var(--border)" }}>
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          // MONITOR DE SITUACIÓN — MUNICIPIO DE SANTIAGO DE CALI
        </p>
        <p className="text-xs" style={{ color: "var(--text-muted)" }}>
          // por Nicolas Cardona &nbsp;·&nbsp;{" "}
          <a href="https://github.com/cardonanl/cali-monitor" target="_blank" rel="noopener noreferrer"
            style={{ color: "var(--accent)" }} className="hover:underline">
            github.com/cardonanl/cali-monitor
          </a>
        </p>
      </div>

      {/* ── Row 1: KPI cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KpiBlock label="TOTAL EN BD"      value={stats.total}           accent="#4589ff" />
        <KpiBlock label="ÚLTIMAS 24H"      value={stats.last24h}         accent="#42be65" />
        <KpiBlock label="FUENTES"          value={stats.bySource.length} accent="#be95ff" />
        <KpiBlock label="TÓPICOS ACTIVOS"  value={stats.byTopic.length}  accent="#33b1ff" />
      </div>

      {/* ── Row 2: AI summary + Weekly activity (each = 2 KPI widths) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        <Panel title="RESUMEN EJECUTIVO — GENERADO POR IA">
          <div
            className="text-sm leading-relaxed whitespace-pre-line overflow-auto"
            style={{ color: "var(--text-primary)", maxHeight: 220 }}
          >
            {dailySummary}
          </div>
        </Panel>

        <Panel title="ACTIVIDAD SEMANAL — NOTICIAS POR DÍA">
          <WeeklyChart data={weekly} />
        </Panel>

      </div>

      {/* ── Row 3: Topic distribution (1/3) + Map (2/3) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        <Panel title="DISTRIBUCIÓN POR TÓPICO — 24H">
          {stats.byTopic24h.length > 0 ? (
            <div className="flex flex-col gap-4">
              {stats.byTopic24h.map(({ topic, count }) => {
                const color = TOPIC_COLORS_HEX[topic as Topic] ?? "#4d6e8a";
                const pct = Math.round((count / maxCount24h) * 100);
                return (
                  <div key={topic} style={{ color }}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm" style={{ maxWidth: "80%" }}>{topic}</span>
                      <span className="text-sm tabular-nums" style={{ color: "var(--text-muted)" }}>{count}</span>
                    </div>
                    <span style={{ fontSize: "0.78rem", letterSpacing: "-0.02em", color: color + "cc" }}>
                      {asciBar(pct)}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              &gt; SIN DATOS EN LAS ÚLTIMAS 24H_
            </p>
          )}
        </Panel>

        {/* Map — spans 2 of 3 columns */}
        <div className="terminal-panel p-5 lg:col-span-2">
          <div className="panel-title">
            ▶ MAPA DE INCIDENCIAS POR BARRIO
            {neighborhoodArticles.length > 0 && (
              <span style={{ color: "var(--accent-bright)" }}>
                [{neighborhoodArticles.length} UBICADOS]
              </span>
            )}
          </div>
          {neighborhoodArticles.length === 0 ? (
            <div className="flex items-center justify-center h-64 text-sm"
              style={{ color: "var(--text-muted)" }}>
              &gt; SIN ARTÍCULOS CON BARRIO DETECTADO. EJECUTAR{" "}
              <code className="mx-1 px-1" style={{ backgroundColor: "var(--border)", color: "var(--text-primary)" }}>
                POST /api/reclassify
              </code>
            </div>
          ) : (
            <MapPanel articles={neighborhoodArticles} />
          )}
        </div>

      </div>

      {/* ── Row 4: Word cloud — full width, bigger ── */}
      <Panel title="TÉRMINOS MÁS FRECUENTES — ÚLTIMAS 24H">
        <WordCloud data={words} />
      </Panel>

    </section>
  );
}
