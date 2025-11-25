"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { parseAsString, useQueryState } from "nuqs";

import type { Article, ArticleFilters } from "@/types/articles";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { ArticleCard } from "./article-card";
import { useOfflineLibrary } from "@/hooks/useOfflineLibrary";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import { normalizeTags } from "@/utils/normalize";

interface ArticleFeedProps {
  initialArticles: Article[];
  initialFilters: ArticleFilters;
}

async function clientFetchArticles(
  filters: ArticleFilters,
  signal?: AbortSignal,
): Promise<Article[]> {
  const query = new URLSearchParams();
  if (filters.query) query.set("query", filters.query);
  if (filters.tag) query.set("tag", filters.tag);
  if (filters.source && filters.source !== "all") {
    query.set("source", filters.source);
  }

  const queryString = query.toString();
  const apiPath = queryString ? `/api/articles?${queryString}` : "/api/articles";

  const response = await fetch(apiPath, {
    cache: "no-store",
    signal,
  });

  if (!response.ok) {
    throw new Error("Unable to load articles");
  }

  return (await response.json()) as Article[];
}

export function ArticleFeed({
  initialArticles,
  initialFilters,
}: ArticleFeedProps) {
  const isOnline = useOnlineStatus();
  const { savedArticles, saveArticle, removeArticle } = useOfflineLibrary();

  const savedIds = useMemo(
    () => new Set(savedArticles.map((article) => article.id)),
    [savedArticles],
  );

  const [query, setQuery] = useQueryState(
    "q",
    parseAsString.withDefault(initialFilters.query ?? ""),
  );
  const [tag, setTag] = useQueryState(
    "tag",
    parseAsString.withDefault(initialFilters.tag ?? ""),
  );
  const [source, setSource] = useQueryState(
    "source",
    parseAsString.withDefault("all"),
  );

  const activeFilters = useMemo<ArticleFilters>(() => {
    return {
      query: query || undefined,
      tag: tag || undefined,
      source: source === "all" ? undefined : (source as ArticleFilters["source"]),
    };
  }, [query, tag, source]);

  const shouldUseInitialData =
    (activeFilters.query ?? "") === (initialFilters.query ?? "") &&
    (activeFilters.tag ?? "") === (initialFilters.tag ?? "");

  const queryResult = useQuery({
    queryKey: ["articles", activeFilters],
    queryFn: ({ signal }) => clientFetchArticles(activeFilters, signal),
    initialData: shouldUseInitialData ? initialArticles : undefined,
    placeholderData: (previousData) => previousData,
  });

  const articles = queryResult.data ?? [];

  const suggestedTags = useMemo(() => {
    const pool = new Set<string>();
    articles.forEach((article) => {
      normalizeTags(article.tags).forEach((articleTag) => {
        if (articleTag) pool.add(articleTag);
      });
    });
    return Array.from(pool).slice(0, 8);
  }, [articles]);

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 rounded-lg border bg-card px-4 py-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search articles..."
            className="sm:flex-1"
          />
          <Button
            variant="outline"
            onClick={() => queryResult.refetch()}
            disabled={queryResult.isFetching}
          >
            Refresh
          </Button>
        </div>

        <Tabs
          value={source || "all"}
          onValueChange={(next) => setSource(next)}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="all">All sources</TabsTrigger>
            <TabsTrigger value="devto">Dev.to</TabsTrigger>
          </TabsList>
        </Tabs>

        {suggestedTags.length > 0 && (
          <div className="flex flex-wrap gap-2 text-sm">
            <span className="text-muted-foreground">Popular tags:</span>
            {suggestedTags.map((tagOption) => (
              <Button
                key={tagOption}
                variant={tag === tagOption ? "default" : "secondary"}
                size="sm"
                onClick={() =>
                  setTag((current) =>
                    current === tagOption ? "" : tagOption,
                  )
                }
              >
                #{tagOption}
              </Button>
            ))}
            {tag && (
              <Button variant="ghost" size="sm" onClick={() => setTag("")}>
                Clear tag
              </Button>
            )}
          </div>
        )}
      </div>

      {!isOnline && !articles.length && (
        <p className="text-sm text-muted-foreground">
          You are offline and no articles are cached yet. Try again when back
          online or open your saved items.
        </p>
      )}

      {queryResult.isError && (
        <div className="rounded-md border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          Unable to load the feed. Please try again shortly.
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {queryResult.isFetching && !articles.length
          ? Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={`skeleton-${index}`} className="h-44 w-full" />
            ))
          : articles.map((article) => (
              <ArticleCard
                key={article.id}
                article={article}
                isSaved={savedIds.has(article.id)}
                onSave={() => saveArticle(article)}
                onRemove={() => removeArticle(article.id)}
              />
            ))}
      </div>

      {!queryResult.isFetching && !articles.length && (
        <div className="rounded-md border px-6 py-10 text-center text-muted-foreground">
          No articles match that query yet. Try a different search or browse your
          saved stories.
        </div>
      )}
    </section>
  );
}

