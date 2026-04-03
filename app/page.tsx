import { fetchAllNews } from "@/lib/fetchNews";
import { getDashboardStats, getHourlyActivity, getWordFrequencies, getNeighborhoodArticles } from "@/lib/stats";
import { ArticleSection } from "@/components/ArticleSection";
import { Header } from "@/components/Header";
import { Dashboard } from "@/components/Dashboard";

export const revalidate = 1800;

export default async function Home() {
  // fetchAllNews first — it upserts articles to Supabase synchronously.
  // Stats queries run after so they always see the current batch.
  const { articles, fetchedAt, total } = await fetchAllNews();

  const [stats, hourly, words, neighborhoodArticles] = await Promise.all([
    getDashboardStats(),
    getHourlyActivity(),
    getWordFrequencies(),
    getNeighborhoodArticles(),
  ]);

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "var(--bg-base)" }}>
      <Header total={total} fetchedAt={fetchedAt} />
      <Dashboard stats={stats} hourly={hourly} words={words} neighborhoodArticles={neighborhoodArticles} />

      <ArticleSection articles={articles} />

      <footer className="text-center text-xs py-4"
        style={{ color: "var(--text-muted)", borderTop: "1px solid var(--border)" }}>
        Cali Monitor · {new Date().getFullYear()}
      </footer>
    </div>
  );
}
