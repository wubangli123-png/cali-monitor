import Parser from "rss-parser";
import { Article, NewsResponse } from "./types";
import { RSS_SOURCES } from "./sources";
import { normalizeArticle, deduplicateArticles } from "./normalize";
import { filterCaliRelevant } from "./filter";

const parser = new Parser({
  timeout: 8000,
  headers: {
    "User-Agent": "Mozilla/5.0 (compatible; CaliMonitor/1.0)",
  },
});

async function fetchFeed(
  url: string,
  sourceName: string,
  filterRequired: boolean
): Promise<Article[]> {
  const feed = await parser.parseURL(url);
  const articles: Article[] = [];

  for (const item of feed.items || []) {
    const article = normalizeArticle({
      title: item.title,
      link: item.link,
      contentSnippet: item.contentSnippet,
      content: item.content,
      pubDate: item.pubDate,
      isoDate: item.isoDate,
      source: sourceName,
    });
    if (article) articles.push(article);
  }

  return filterRequired ? filterCaliRelevant(articles) : articles;
}

export async function fetchAllNews(): Promise<NewsResponse> {
  const results = await Promise.allSettled(
    RSS_SOURCES.map((s) => fetchFeed(s.url, s.name, s.filterRequired))
  );

  const allArticles: Article[] = [];
  for (const result of results) {
    if (result.status === "fulfilled") {
      allArticles.push(...result.value);
    } else {
      console.error("[fetchNews] feed failed:", result.reason);
    }
  }

  const deduped = deduplicateArticles(allArticles);
  deduped.sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  return {
    articles: deduped,
    fetchedAt: new Date().toISOString(),
    total: deduped.length,
  };
}
