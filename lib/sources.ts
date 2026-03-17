export interface FeedSource {
  name: string;
  url: string;
  filterRequired: boolean; // true = must pass Cali keyword filter
  color: string;
}

export const RSS_SOURCES: FeedSource[] = [
  {
    name: "Google News - Cali",
    url: "https://news.google.com/rss/search?q=Cali+Colombia&hl=es&gl=CO&ceid=CO:es",
    filterRequired: true,
    color: "blue",
  },
  {
    name: "Google News - Valle",
    url: "https://news.google.com/rss/search?q=Valle+del+Cauca&hl=es&gl=CO&ceid=CO:es",
    filterRequired: true,
    color: "indigo",
  },
  {
    name: "El Tiempo - Cali",
    url: "https://www.eltiempo.com/rss/colombia_cali.xml",
    filterRequired: false,
    color: "orange",
  },
  {
    name: "RCN Radio",
    url: "https://www.rcnradio.com/feed",
    filterRequired: true,
    color: "red",
  },
];
