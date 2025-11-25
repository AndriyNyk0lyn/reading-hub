import { Article, ArticleFilters, DevtoArticle } from "@/types/articles";

export function normalizeTags(
  tags: Article["tags"] | string | undefined
): string[] {
  if (!tags) return [];
  if (Array.isArray(tags)) {
    return tags.filter(Boolean);
  }
  return tags
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}
export function normalizeFilters(
  params: Record<string, string | string[] | undefined>
) {
  const filters: ArticleFilters = {};
  if (typeof params.query === "string") filters.query = params.query;
  if (typeof params.tag === "string") filters.tag = params.tag;
  if (typeof params.source === "string") {
    filters.source =
      params.source === "all"
        ? undefined
        : (params.source as ArticleFilters["source"]);
  }
  return filters;
}

export function toArticle(record: DevtoArticle): Article {
  const tags = normalizeTags(record.tags);
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
