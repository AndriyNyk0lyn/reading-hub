import { ArticleFeed } from "@/components/feed/article-feed";
import { fetchArticlesFromDevto } from "@/lib/articles";
import type { Article } from "@/types/articles";
import { normalizeFilters } from "@/utils/normalize";
import Title from "@/components/ui/title";
import { isPromiseLike, SearchParams } from "@/utils/isPromiseLike";

async function resolveSearchParams(input?: SearchParams) {
  if (!input) return {};
  if (isPromiseLike(input)) {
    return ((await input) ?? {}) as Record<
      string,
      string | string[] | undefined
    >;
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
        <Title>Reading feed</Title>
        <p className="text-muted-foreground">
          Browse the latest Dev.to stories, search by keyword, and save anything
          to read offline later.
        </p>
      </div>
      <ArticleFeed initialArticles={initialArticles} initialFilters={filters} />
    </div>
  );
}
