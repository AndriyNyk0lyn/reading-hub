export type ArticleSource = "devto" | "hn" | "jsonplaceholder";

export type ArticleState = "fresh" | "rising";

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
  state?: ArticleState;
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
  state?: ArticleState;
}

export type ArticleStateFilterValue = ArticleState | "all";

export interface DevtoArticle {
  id: number;
  title: string;
  description?: string;
  body_markdown?: string;
  url: string;
  tags: string;
  readable_publish_date?: string;
  published_timestamp?: string;
  tag_list?: string[];
  user?: {
    name?: string;
    username?: string;
  };
  state?: string;
}
