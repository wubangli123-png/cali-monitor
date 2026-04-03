/**
 * Historical bulk scraper — last 30 days
 *
 * Sources:
 *   - Google News date-range queries (week by week)
 *   - Q'Hubo Cali RSS pagination (?paged=N)
 *   - Occidente RSS pagination (?paged=N)
 *   - Alcaldía de Cali HTML pagination (?genPag=N)
 *
 * Run: node scripts/scrape-historical.mjs
 * Then: curl -X POST http://localhost:3000/api/reclassify
 */

import Parser from "rss-parser";
import { load } from "cheerio";
import { createHash } from "crypto";
import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { readFileSync } from "fs";

// Load .env.local
const __dir = dirname(fileURLToPath(import.meta.url));
const envPath = join(__dir, "../.env.local");
try {
  const envContent = readFileSync(envPath, "utf8");
  for (const line of envContent.split("\n")) {
    const [key, ...rest] = line.split("=");
    if (key && rest.length) process.env[key.trim()] = rest.join("=").trim();
  }
} catch { /* ignore */ }

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY
);

const parser = new Parser({
  timeout: 12000,
  headers: { "User-Agent": "Mozilla/5.0 (compatible; CaliMonitor/1.0)" },
});

const MONTH_MAP = {
  ene:0,feb:1,mar:2,abr:3,may:4,jun:5,jul:6,ago:7,sep:8,oct:9,nov:10,dic:11,
};

function md5id(title, source) {
  return createHash("md5").update(title.slice(0, 60) + source).digest("hex");
}

function stripHtml(html) {
  return html.replace(/<[^>]*>/g, "").replace(/&[a-z]+;/gi, " ").trim();
}

function truncate(text, max) {
  if (text.length <= max) return text;
  return text.slice(0, max - 1).trimEnd() + "…";
}

const CUTOFF = new Date(Date.now() - 31 * 24 * 60 * 60 * 1000);
const NOW = new Date();

// ─── 1. Google News date-range (week by week) ────────────────────────────────

function weekRanges() {
  const ranges = [];
  let end = new Date(NOW);
  while (end > CUTOFF) {
    const start = new Date(end.getTime() - 7 * 24 * 60 * 60 * 1000);
    const fmt = (d) => d.toISOString().slice(0, 10);
    ranges.push({ after: fmt(start > CUTOFF ? start : CUTOFF), before: fmt(end) });
    end = start;
  }
  return ranges;
}

const GN_QUERIES = [
  "Cali Colombia",
  "Valle del Cauca",
  "site:90minutos.co",
  "site:qhubocali.com",
  "site:occidente.co Cali",
];

async function fetchGoogleNews() {
  const articles = [];
  for (const range of weekRanges()) {
    for (const q of GN_QUERIES) {
      const url = `https://news.google.com/rss/search?q=${encodeURIComponent(q)}+after:${range.after}+before:${range.before}&hl=es&gl=CO&ceid=CO:es`;
      try {
        const feed = await parser.parseURL(url);
        const sourceName = q.startsWith("site:") ? q.replace("site:", "").split(".")[0].replace(/^\w/, c => c.toUpperCase()) : `Google News - ${q.split(" ")[0]}`;
        for (const item of feed.items ?? []) {
          const title = stripHtml(item.title || "").trim();
          const pubDate = item.isoDate ? new Date(item.isoDate) : new Date(item.pubDate || NOW);
          if (!title || !item.link || pubDate < CUTOFF) continue;
          articles.push({
            id: md5id(title, sourceName),
            title,
            source: sourceName,
            published_at: pubDate.toISOString(),
            summary: truncate(stripHtml(item.contentSnippet || item.content || ""), 220),
            url: item.link,
          });
        }
        process.stdout.write(".");
      } catch { process.stdout.write("x"); }
      await sleep(400);
    }
  }
  console.log();
  return articles;
}

// ─── 2. WordPress RSS pagination ─────────────────────────────────────────────

async function fetchWordPressPaginated(baseUrl, sourceName, maxPages = 15) {
  const articles = [];
  for (let page = 1; page <= maxPages; page++) {
    const url = `${baseUrl}?paged=${page}`;
    try {
      const feed = await parser.parseURL(url);
      if (!feed.items?.length) break;

      let hasOld = false;
      for (const item of feed.items) {
        const title = stripHtml(item.title || "").trim();
        const pubDate = item.isoDate ? new Date(item.isoDate) : new Date(item.pubDate || NOW);
        if (pubDate < CUTOFF) { hasOld = true; continue; }
        if (!title || !item.link) continue;
        articles.push({
          id: md5id(title, sourceName),
          title,
          source: sourceName,
          published_at: pubDate.toISOString(),
          summary: truncate(stripHtml(item.contentSnippet || item.content || ""), 220),
          url: item.link,
        });
      }
      process.stdout.write(".");
      if (hasOld) break; // Oldest item on this page is before cutoff — stop
      await sleep(600);
    } catch { process.stdout.write("x"); break; }
  }
  return articles;
}

// ─── 3. Alcaldía de Cali HTML scraper ────────────────────────────────────────

function parseCaliGovDate(raw) {
  const m = raw.trim().match(/(\d{1,2})\s+([A-Za-záéíóú]{3})\.?-?(\d{2,4})/i);
  if (!m) return new Date();
  const day = parseInt(m[1]);
  const month = MONTH_MAP[m[2].toLowerCase().slice(0, 3)] ?? 0;
  const year = parseInt(m[3]) < 100 ? 2000 + parseInt(m[3]) : parseInt(m[3]);
  return new Date(year, month, day);
}

async function scrapeCaliGov(maxPages = 15) {
  const articles = [];
  const BASE = "https://www.cali.gov.co";
  for (let page = 1; page <= maxPages; page++) {
    const url = `${BASE}/publicaciones/noticias/?genPag=${page}`;
    try {
      const res = await fetch(url, {
        headers: { "User-Agent": "Mozilla/5.0 (compatible; CaliMonitor/1.0)", Accept: "text/html" },
        signal: AbortSignal.timeout(12000),
      });
      if (!res.ok) break;

      const $ = load(await res.text());
      let hasOld = false;
      let found = 0;

      $("a[href*='/publicaciones/']").each((_, el) => {
        const href = $(el).attr("href") ?? "";
        if (!href.match(/\/publicaciones\/\d+\//)) return;
        const title = $(el).text().trim();
        if (!title || title.length < 10) return;

        const parent = $(el).closest("div, li, article");
        const summary = truncate(parent.find("p").first().text().trim(), 220);
        const dateRaw = parent.find("span").last().text().trim();
        const pubDate = parseCaliGovDate(dateRaw);

        if (pubDate < CUTOFF) { hasOld = true; return; }

        const articleUrl = href.startsWith("http") ? href : `${BASE}${href}`;
        articles.push({
          id: md5id(title, "Alcaldía de Cali"),
          title,
          source: "Alcaldía de Cali",
          published_at: pubDate.toISOString(),
          summary,
          url: articleUrl,
        });
        found++;
      });

      process.stdout.write(found > 0 ? "." : "0");
      if (hasOld || found === 0) break;
      await sleep(800);
    } catch { process.stdout.write("x"); break; }
  }
  return articles;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function sleep(ms) { return new Promise((r) => setTimeout(r, ms)); }

function dedup(articles) {
  const seen = new Set();
  return articles.filter((a) => {
    if (seen.has(a.id)) return false;
    seen.add(a.id);
    return true;
  });
}

async function upsertBatch(articles) {
  const fetchedAt = new Date().toISOString();
  const BATCH = 100;
  let total = 0;
  for (let i = 0; i < articles.length; i += BATCH) {
    const batch = articles.slice(i, i + BATCH).map((a) => ({ ...a, fetched_at: fetchedAt }));
    const { error } = await supabase.from("articles").upsert(batch, { onConflict: "id" });
    if (error) console.error("\n[supabase] upsert error:", error.message);
    else total += batch.length;
  }
  return total;
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  console.log(`Scraping historial desde ${CUTOFF.toISOString().slice(0,10)} hasta hoy\n`);

  console.log("1/4 Google News (por semana)...");
  const gnArticles = await fetchGoogleNews();
  console.log(`    → ${gnArticles.length} artículos`);

  console.log("2/4 Q'Hubo Cali (RSS paginado)...");
  const qhubo = await fetchWordPressPaginated("https://qhubocali.com/feed/", "Q'Hubo Cali");
  console.log(`    → ${qhubo.length} artículos`);

  console.log("3/4 Occidente (RSS paginado)...");
  const occidente = await fetchWordPressPaginated("https://occidente.co/cali/feed/", "Occidente");
  console.log(`    → ${occidente.length} artículos`);

  console.log("4/4 Alcaldía de Cali (HTML paginado)...");
  const alcaldia = await scrapeCaliGov(15);
  console.log(`    → ${alcaldia.length} artículos`);

  const all = dedup([...gnArticles, ...qhubo, ...occidente, ...alcaldia]);
  console.log(`\nTotal único: ${all.length} artículos`);

  console.log("Subiendo a Supabase...");
  const upserted = await upsertBatch(all);
  console.log(`✓ ${upserted} artículos insertados/actualizados`);

  console.log("\nAhora ejecuta:");
  console.log("  curl -X POST http://localhost:3000/api/reclassify");
  console.log("para clasificar todos los artículos históricos.");
}

main().catch((err) => { console.error(err); process.exit(1); });
