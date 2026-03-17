import { Article } from "./types";

const CALI_KEYWORDS = [
  "cali",
  "valle del cauca",
  "palmira",
  "buenaventura",
  "jamundí",
  "jamundi",
  "yumbo",
  "buga",
  "tulua",
  "tuluá",
  "cartago",
];

export function filterCaliRelevant(articles: Article[]): Article[] {
  return articles.filter((a) => {
    const text = `${a.title} ${a.summary}`.toLowerCase();
    return CALI_KEYWORDS.some((kw) => text.includes(kw));
  });
}
