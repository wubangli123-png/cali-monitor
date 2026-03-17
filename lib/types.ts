export interface Article {
  id: string;
  title: string;
  source: string;
  publishedAt: Date;
  summary: string;
  url: string;
}

export interface NewsResponse {
  articles: Article[];
  fetchedAt: string;
  total: number;
}
