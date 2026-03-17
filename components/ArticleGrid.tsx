import { Article } from "@/lib/types";
import { ArticleCard } from "./ArticleCard";

export function ArticleGrid({ articles }: { articles: Article[] }) {
  if (articles.length === 0) {
    return (
      <div className="text-center py-20 text-gray-400">
        <p className="text-lg">No se encontraron noticias de Cali por ahora.</p>
        <p className="text-sm mt-1">Intenta actualizar en unos minutos.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {articles.map((article) => (
        <ArticleCard key={article.id} article={article} />
      ))}
    </div>
  );
}
