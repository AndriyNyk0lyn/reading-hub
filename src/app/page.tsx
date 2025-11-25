import { ArticleFeed } from "@/components/feed/article-feed";
import { fetchArticlesFromDevto } from "@/lib/articles";
import type { Article, ArticleFilters } from "@/types/articles";

type SearchParams =
  | Record<string, string | string[] | undefined>
  | Promise<Record<string, string | string[] | undefined>>;

function normalizeFilters(
  params: Record<string, string | string[] | undefined>,
) {
  const filters: ArticleFilters = {};
  if (typeof params.query === "string") filters.query = params.query;
  if (typeof params.tag === "string") filters.tag = params.tag;
  if (typeof params.source === "string") {
    filters.source =
      params.source === "all" ? undefined : (params.source as ArticleFilters["source"]);
  }
  return filters;
}

function isPromiseLike(
  value: SearchParams,
): value is Promise<Record<string, string | string[] | undefined>> {
  return (
    typeof value === "object" &&
    value !== null &&
    "then" in value &&
    typeof (value as PromiseLike<unknown>).then === "function"
  );
}

async function resolveSearchParams(input?: SearchParams) {
  if (!input) return {};
  if (isPromiseLike(input)) {
    return ((await input) ?? {}) as Record<string, string | string[] | undefined>;
  }
  return input as Record<string, string | string[] | undefined>;
}

export default async function Home({
  searchParams,
}: {
  searchParams?: SearchParams;
}) {
  const resolvedParams = await resolveSearchParams(searchParams);
  const filters = normalizeFilters(resolvedParams);

  let initialArticles: Article[] = [];
  try {
    initialArticles = await fetchArticlesFromDevto(filters);
  } catch (error) {
    console.error("Failed to prefetch articles", error);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">Reading feed</h1>
        <p className="text-muted-foreground">
          Browse the latest Dev.to stories, search by keyword, and save anything
          to read offline later.
        </p>
      </div>
      <ArticleFeed initialArticles={initialArticles} initialFilters={filters} />
    </div>
  );
}
