import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { ExternalLink, MapPin } from "lucide-react";
import { Article } from "@/lib/types";
import { SourceBadge } from "./SourceBadge";
import { TopicBadge } from "./TopicBadge";

export function ArticleCard({ article }: { article: Article }) {
  const timeAgo = formatDistanceToNow(new Date(article.publishedAt), {
    addSuffix: true,
    locale: es,
  });

  return (
    <article className="article-card rounded-lg p-4 flex flex-col gap-3 transition-colors cursor-default">
      <div className="flex items-start justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-1.5 flex-wrap">
          <TopicBadge topic={article.topic} />
          <SourceBadge source={article.source} />
          {article.neighborhood && (
            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-xs"
              style={{ color: "var(--accent)", backgroundColor: "#0c1f3a", border: "1px solid #1e3a5f" }}>
              <MapPin className="w-2.5 h-2.5" />
              {article.neighborhood}
            </span>
          )}
        </div>
        <span className="text-xs whitespace-nowrap" style={{ color: "var(--text-muted)" }}>
          {timeAgo}
        </span>
      </div>

      <a
        href={article.url}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-start gap-1"
      >
        <h2
          className="text-sm font-semibold leading-snug group-hover:text-sky-400 transition-colors line-clamp-3"
          style={{ color: "var(--text-primary)" }}
        >
          {article.title}
        </h2>
        <ExternalLink className="shrink-0 mt-0.5 w-3.5 h-3.5 opacity-0 group-hover:opacity-100 text-sky-400 transition-opacity" />
      </a>

      {article.summary && (
        <p className="text-xs leading-relaxed line-clamp-3" style={{ color: "var(--text-muted)" }}>
          {article.summary}
        </p>
      )}
    </article>
  );
}
