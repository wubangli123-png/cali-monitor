import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { ExternalLink } from "lucide-react";
import { Article } from "@/lib/types";
import { SourceBadge } from "./SourceBadge";

export function ArticleCard({ article }: { article: Article }) {
  const timeAgo = formatDistanceToNow(new Date(article.publishedAt), {
    addSuffix: true,
    locale: es,
  });

  return (
    <article className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex flex-col gap-3 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-2">
        <SourceBadge source={article.source} />
        <span className="text-xs text-gray-400 whitespace-nowrap">{timeAgo}</span>
      </div>
      <a
        href={article.url}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-start gap-1"
      >
        <h2 className="text-sm font-semibold text-gray-800 leading-snug group-hover:text-blue-600 transition-colors line-clamp-3">
          {article.title}
        </h2>
        <ExternalLink className="shrink-0 mt-0.5 w-3.5 h-3.5 text-gray-400 group-hover:text-blue-500" />
      </a>
      {article.summary && (
        <p className="text-xs text-gray-500 leading-relaxed line-clamp-3">
          {article.summary}
        </p>
      )}
    </article>
  );
}
