# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server at localhost:3000
npm run build    # Production build (also validates RSS feeds at build time)
npm run start    # Run production build locally
npm run lint     # ESLint
npx tsc --noEmit # Type-check without emitting
```

There are no tests. The build itself exercises `fetchAllNews()` during static page generation, so `npm run build` is the primary validation step.

## Architecture

**Data flow (sequential — order matters for stats correctness):**
```
app/page.tsx (Server Component)
  1. fetchAllNews()
       ├── Promise.allSettled(RSS feeds) → normalize → filter → deduplicate
       ├── supabase.upsert(articles WITHOUT topic)  ← synchronous, ~0.5s
       │     Stats queries run AFTER this so Supabase always has current articles.
       └── classifyArticles() → supabase.upsert(WITH topic)  ← fire-and-forget
  2. Promise.all([getDashboardStats(), getHourlyActivity(), getWordFrequencies()])
       └── All three query Supabase, which now contains the just-upserted articles.
```

**Critical ordering:** `fetchAllNews()` must complete before the stats queries. They are NOT parallelized in `page.tsx` — sequential `await` is intentional.

**Caching:** `export const revalidate = 1800` — Next.js/Vercel ISR caches the page 30 minutes. Refresh via `router.refresh()` in `RefreshController` (uses `useTransition` to keep UI visible while re-rendering). Typical render: ~3-5s (RSS fetch + sync upsert + 3 stat queries).

**Theme:** Full dark mode via CSS custom properties in `globals.css`:
- `--bg-base: #070d1a` · `--bg-card: #0d1526` · `--bg-card-hover: #111d35`
- `--border: #1e2f4d` · `--text-primary: #e2e8f0` · `--text-muted: #64748b` · `--accent: #38bdf8`

Do **not** use Tailwind `dark:` classes — use the CSS vars via `style={{}}` props.

## Key files

- **`lib/sources.ts`** — RSS feed config. `filterRequired: true` = must pass Cali keyword filter.
- **`lib/filter.ts`** — `filterCaliRelevant()`: keyword list includes `cali`, `valle del cauca`, nearby cities.
- **`lib/normalize.ts`** — strips HTML, truncates to 220 chars, `id` = MD5(`title.slice(0,60) + source`). Deduplication: normalized title (lowercase, no punctuation, first 60 chars) in a `Set`.
- **`lib/classify.ts`** — `classifyArticles()`: single OpenAI call with all titles, returns articles with `topic`. Falls back to unmodified articles on error.
- **`lib/stats.ts`** — three exported functions:
  - `getDashboardStats()` → total, last24h, byTopic[], bySource[]
  - `getHourlyActivity()` → 24 buckets `{ hour: "HH:00", count }` for the area chart
  - `getWordFrequencies()` → top-60 words `{ text, value }` from last-24h titles/summaries, with Spanish stopwords filtered
- **`lib/supabase.ts`** — single `supabase` client from env vars.
- **`components/TopicBadge.tsx`** — topic pill with dark-mode styles. Exports `TOPIC_COLORS_HEX` used by Dashboard bar chart and WordCloud palette.
- **`components/SourceBadge.tsx`** — source pill. Update `SOURCE_COLORS` when adding feeds.
- **`components/Dashboard.tsx`** — server component: 4 KPI cards + 3-column chart row (topic bars, topic bar chart, hourly area chart) + word cloud panel.
- **`components/charts/TopicChart24h.tsx`** — `"use client"` recharts `BarChart` by topic.
- **`components/charts/HourlyChart.tsx`** — `"use client"` recharts `AreaChart` by hour (last 24h).
- **`components/charts/WordCloud.tsx`** — `"use client"` CSS word cloud; font size 11–33px proportional to frequency, coloured by topic palette.
- **`components/ArticleCard.tsx`** — uses `.article-card` CSS class for hover (no JS event handlers — Server Component constraint). Topic badge + source badge + relative time + title + summary.

## Topic classification

**Model:** `gpt-4o-mini`, `temperature: 0`, `response_format: json_object`

**Categories (alcaldía-oriented, April 2026):**
`Seguridad Pública | Salud | Educación | Infraestructura y Obras | Movilidad y Transporte | Medio Ambiente | Desarrollo Social | Desarrollo Económico | Gobernanza | Judicial | Cultura y Eventos | Emergencias | General`

**Neighborhood extraction:** Same OpenAI call also extracts the barrio name (if mentioned) and matches it against the 339 canonical barrio names from `lib/barrios.ts`. Returns null if no barrio found. Stored in `neighborhood` column.

**Cost:** ~$0.003 per ~50-article batch (slightly higher due to barrio list in prompt). Runs fire-and-forget after every render cycle; topics + neighborhoods appear in the DB within ~30s of a page load.

**Reclassify all existing articles:** `POST /api/reclassify` — processes all Supabase articles in batches of 50.

**Fallback:** `.catch(() => deduped)` — articles render without topic badges if OpenAI fails.

## Supabase integration

**Project:** `ujhcutuccwhochxambxk`

**Table: `public.articles`**

| Column | Type | Notes |
|---|---|---|
| `id` | `text` | PK — MD5 of `title.slice(0,60) + source` |
| `title` | `text` | |
| `source` | `text` | e.g. `"Google News - Cali"` |
| `published_at` | `timestamptz` | From RSS `pubDate`/`isoDate` |
| `summary` | `text` | Nullable, max 220 chars |
| `url` | `text` | |
| `topic` | `text` | Nullable — filled by OpenAI ~30s after upsert |
| `neighborhood` | `text` | Nullable — barrio name from `lib/barrios.ts` canonical list |
| `fetched_at` | `timestamptz` | Timestamp of the fetch cycle |

Indexes: `published_at DESC`, `topic`, `neighborhood`. RLS: public SELECT + INSERT + UPDATE (required for publishable key). Schema in `supabase/schema.sql`.

**Required Supabase migration (run once in SQL editor):**
```sql
alter table articles add column if not exists neighborhood text;
create index if not exists articles_neighborhood_idx on articles (neighborhood);
```

**Required env vars** (`.env.local` locally, Vercel Environment Variables in prod):
```
NEXT_PUBLIC_SUPABASE_URL=https://ujhcutuccwhochxambxk.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=sb_publishable_...
OPENAI_API_KEY=sk-proj-...
```

## Adding a new RSS source

1. Add entry to `RSS_SOURCES` in `lib/sources.ts`.
2. Add dark-mode color to `SOURCE_COLORS` in `components/SourceBadge.tsx`.
3. `npm run build` to verify — malformed XML feeds fail gracefully (`[fetchNews] feed failed:`).

## Known feed issues

El Tiempo (`eltiempo.com/rss/colombia_cali.xml`) and RCN Radio (`rcnradio.com/feed`) fail due to malformed XML. Google News Cali + Valle del Cauca are the active sources (~166 articles per cycle as of March 2026).

## Pending features (roadmap)

- **Mapa de barrios** — extract neighborhood from title/summary (via OpenAI in same classify call), geocode, plot on Google Maps or Mapbox. Requires `lat`, `lng`, `neighborhood` columns in `articles`.
- **Topic badges on article cards** — currently absent because classification is fire-and-forget. Could read topics from Supabase on render, or move classification to a separate cron endpoint.

## Deploy

Vercel. Push to GitHub → import → deploy. Add all three env vars in **Settings → Environment Variables**. First ISR render ~5s (no OpenAI block); topics populate in DB ~30s later in background.
