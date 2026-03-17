import { fetchAllNews } from "@/lib/fetchNews";
import { ArticleGrid } from "@/components/ArticleGrid";
import { Header } from "@/components/Header";

export const revalidate = 1800;

export default async function Home() {
  const { articles, fetchedAt, total } = await fetchAllNews();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header total={total} fetchedAt={fetchedAt} />
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-6">
        <ArticleGrid articles={articles} />
      </main>
      <footer className="text-center text-xs text-gray-400 py-4">
        Cali Monitor · Noticias de Cali y el Valle del Cauca
      </footer>
    </div>
  );
}
