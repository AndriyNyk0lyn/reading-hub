export type ArticleSource = "devto" | "hn" | "jsonplaceholder";

export interface Article {
  id: string;
  title: string;
  description?: string;
  body?: string;
  url: string;
  author: string;
  tags: string[];
  publishedAt?: string;
  source: ArticleSource;
}

export interface SavedArticle extends Article {
  savedAt: string;
}

export interface AppSettings {
  name: "settings";
  theme: "light" | "dark" | "system";
  lastSyncAt?: string;
}

export interface ArticleFilters {
  query?: string;
  tag?: string;
  source?: ArticleSource | "all";
}

