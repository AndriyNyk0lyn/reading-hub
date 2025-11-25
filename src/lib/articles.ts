import "server-only";

import { Article, ArticleFilters } from "@/types/articles";

const DEVTO_BASE_URL = "https://dev.to/api/articles";

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
}

function getApiKey(): string | undefined {
  return process.env.DEVTO_API_KEY || process.env.NEXT_PUBLIC_DEVTO_API_KEY;
}

export function toArticle(record: DevtoArticle): Article {
  const tags = record.tag_list?.length
    ? record.tag_list
    : record.tags
        ?.split(",")
        .map((tag) => tag.trim())
        .filter(Boolean) ?? [];
  return {
    id: record.id.toString(),
    title: record.title,
    description: record.description,
    body: record.body_markdown,
    url: record.url,
    author: record.user?.name || record.user?.username || "Unknown",
    tags,
    publishedAt: record.published_timestamp || record.readable_publish_date,
    source: "devto",
  };
}

export async function fetchArticlesFromDevto(
  filters: ArticleFilters & { limit?: number },
  signal?: AbortSignal,
): Promise<Article[]> {
  if (filters.source && filters.source !== "devto") {
    return [];
  }

  const url = new URL(DEVTO_BASE_URL);
  const perPage = filters.limit ?? 24;
  url.searchParams.set("per_page", perPage.toString());
  if (filters.query) url.searchParams.set("search", filters.query);
  if (filters.tag) url.searchParams.set("tag", filters.tag);

  const headers = new Headers();
  const apiKey = getApiKey();
  if (apiKey) headers.set("api-key", apiKey);

  const response = await fetch(url, {
    headers,
    signal,
    next: { revalidate: 120 },
  });

  if (!response.ok) {
    throw new Error("Unable to load articles from Dev.to");
  }

  const payload = (await response.json()) as DevtoArticle[];
  return payload.map(toArticle);
}

export async function fetchArticleByIdFromDevto(
  id: string,
  signal?: AbortSignal,
): Promise<Article | null> {
  const url = `${DEVTO_BASE_URL}/${id}`;
  const headers = new Headers();
  const apiKey = getApiKey();
  if (apiKey) headers.set("api-key", apiKey);

  const response = await fetch(url, { headers, signal, cache: "no-store" });
  if (response.status === 404) return null;
  if (!response.ok) throw new Error("Unable to load article");
  const payload = (await response.json()) as DevtoArticle;
  return toArticle(payload);
}

