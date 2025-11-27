"use client"

import type { Article } from "@/types/articles"

export async function fetchArticleDetailsClient(
	articleId: string,
	signal?: AbortSignal,
): Promise<Article> {
	const response = await fetch(`/api/articles/${articleId}`, {
		cache: "no-store",
		signal,
	})

	if (!response.ok) {
		const message = response.status === 404 ? "Article not found" : "Unable to load article details"
		throw new Error(message)
	}

	return (await response.json()) as Article
}
