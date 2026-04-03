"use client";

import { useState, useMemo } from "react";
import { Article, Topic } from "@/lib/types";
import { TOPIC_COLORS_HEX } from "./TopicBadge";
import { ArticleCard } from "./ArticleCard";
import { SlidersHorizontal, X } from "lucide-react";

const ALL = "Todas";

export function ArticleSection({ articles }: { articles: Article[] }) {
  const [activeTopic, setActiveTopic] = useState<Topic | typeof ALL>(ALL);
  const [activeNeighborhood, setActiveNeighborhood] = useState<string | typeof ALL>(ALL);

  // Compute unique topics present in articles (preserving frequency order)
  const topics = useMemo(() => {
    const counts = new Map<Topic, number>();
    for (const a of articles) {
      if (a.topic) counts.set(a.topic, (counts.get(a.topic) ?? 0) + 1);
    }
    return [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([t]) => t);
  }, [articles]);

  // Compute unique neighborhoods present in articles
  const neighborhoods = useMemo(() => {
    const counts = new Map<string, number>();
    for (const a of articles) {
      if (a.neighborhood) counts.set(a.neighborhood, (counts.get(a.neighborhood) ?? 0) + 1);
    }
    return [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([n]) => n);
  }, [articles]);

  const filtered = useMemo(() => {
    return articles.filter((a) => {
      const topicOk = activeTopic === ALL || a.topic === activeTopic;
      const nbhOk = activeNeighborhood === ALL || a.neighborhood === activeNeighborhood;
      return topicOk && nbhOk;
    });
  }, [articles, activeTopic, activeNeighborhood]);

  const hasFilters = activeTopic !== ALL || activeNeighborhood !== ALL;

  return (
    <section className="flex-1 max-w-7xl mx-auto w-full px-4 py-4">
      {/* Filter bar */}
      <div className="flex flex-col gap-3 mb-4">
        <div className="flex items-center justify-between">
          <p className="text-xs uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
            <SlidersHorizontal className="inline w-3 h-3 mr-1.5 mb-0.5" />
            Filtros — {filtered.length} resultado{filtered.length !== 1 ? "s" : ""}
          </p>
          {hasFilters && (
            <button
              onClick={() => { setActiveTopic(ALL); setActiveNeighborhood(ALL); }}
              className="flex items-center gap-1 text-xs px-2 py-1 rounded transition-colors"
              style={{ color: "var(--text-muted)", backgroundColor: "var(--bg-card)", border: "1px solid var(--border)" }}
            >
              <X className="w-3 h-3" /> Limpiar
            </button>
          )}
        </div>

        {/* Topic pills */}
        <div className="flex flex-wrap gap-1.5">
          <FilterPill
            label="Todas"
            active={activeTopic === ALL}
            color="#38bdf8"
            onClick={() => setActiveTopic(ALL)}
          />
          {topics.map((topic) => (
            <FilterPill
              key={topic}
              label={topic}
              active={activeTopic === topic}
              color={TOPIC_COLORS_HEX[topic]}
              onClick={() => setActiveTopic(activeTopic === topic ? ALL : topic)}
            />
          ))}
        </div>

        {/* Neighborhood pills — only shown if there are any */}
        {neighborhoods.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1"
            style={{ borderTop: "1px solid var(--border)" }}>
            <span className="text-xs self-center mr-1" style={{ color: "var(--text-muted)" }}>
              Barrio:
            </span>
            <FilterPill
              label="Todos"
              active={activeNeighborhood === ALL}
              color="#64748b"
              onClick={() => setActiveNeighborhood(ALL)}
            />
            {neighborhoods.map((nbh) => (
              <FilterPill
                key={nbh}
                label={nbh}
                active={activeNeighborhood === nbh}
                color="#38bdf8"
                onClick={() => setActiveNeighborhood(activeNeighborhood === nbh ? ALL : nbh)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20" style={{ color: "var(--text-muted)" }}>
          <p className="text-lg">Sin resultados para este filtro.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </section>
  );
}

function FilterPill({
  label, active, color, onClick,
}: {
  label: string;
  active: boolean;
  color: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="px-2.5 py-1 rounded-full text-xs font-medium transition-all"
      style={{
        backgroundColor: active ? color + "33" : "var(--bg-card)",
        color: active ? color : "var(--text-muted)",
        border: `1px solid ${active ? color + "88" : "var(--border)"}`,
      }}
    >
      {label}
    </button>
  );
}
