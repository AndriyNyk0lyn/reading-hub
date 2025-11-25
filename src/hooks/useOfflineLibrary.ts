"use client";

import { useCallback } from "react";
import { useLiveQuery } from "dexie-react-hooks";

import type { Article } from "@/types/articles";
import {
  removeSavedArticle,
  saveArticleForOffline,
} from "@/lib/saved-articles";
import { getDb } from "@/lib/db";
import { fetchArticleDetailsClient } from "@/lib/client-articles";

export function useOfflineLibrary() {
  const savedArticles =
    useLiveQuery(
      () => getDb().articles.orderBy("savedAt").reverse().toArray(),
      [],
    ) ?? [];

  const handleSave = useCallback(async (article: Article) => {
    let articleToSave = article;

    if (!article.body) {
      try {
        const detailed = await fetchArticleDetailsClient(article.id);
        articleToSave = { ...article, ...detailed };
      } catch (error) {
        console.warn("Failed to fetch full article details", error);
      }
    }
    if (navigator.serviceWorker?.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: "CACHE_ARTICLE",
        payload: {
          pageUrl: `/article/${article.id}`,
          apiUrl: `/api/articles/${article.id}`,
        },
      });
    }
    await saveArticleForOffline(articleToSave);
  }, []);

  const handleRemove = useCallback(async (id: string) => {
    await removeSavedArticle(id);
  }, []);

  return {
    savedArticles,
    saveArticle: handleSave,
    removeArticle: handleRemove,
  };
}

export function useSavedArticle(id?: string) {
  return (
    useLiveQuery(() => {
      if (!id) return undefined;
      return getDb().articles.get(id);
    }, [id]) ?? null
  );
}
