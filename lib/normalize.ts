import { createHash } from "crypto";
import { Article } from "./types";

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").replace(/&[a-z]+;/gi, " ").trim();
}

function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  return text.slice(0, max - 1).trimEnd() + "…";
}

export function normalizeArticle(raw: {
  title?: string;
  link?: string;
  contentSnippet?: string;
  content?: string;
  pubDate?: string;
  isoDate?: string;
  source?: string;
}): Article | null {
  const title = stripHtml(raw.title || "").trim();
  const url = raw.link || "";
  if (!title || !url) return null;

  const rawSummary = raw.contentSnippet || raw.content || "";
  const summary = truncate(stripHtml(rawSummary), 220);

  const publishedAt = raw.isoDate
    ? new Date(raw.isoDate)
    : raw.pubDate
    ? new Date(raw.pubDate)
    : new Date();

  const id = createHash("md5")
    .update(title.slice(0, 60) + (raw.source || ""))
    .digest("hex");

  return {
    id,
    title,
    source: raw.source || "Desconocido",
    publishedAt,
    summary,
    url,
  };
}

export function deduplicateArticles(articles: Article[]): Article[] {
  const seen = new Set<string>();
  return articles.filter((a) => {
    const key = a.title
      .toLowerCase()
      .replace(/[^a-záéíóúñ0-9\s]/g, "")
      .trim()
      .slice(0, 60);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
