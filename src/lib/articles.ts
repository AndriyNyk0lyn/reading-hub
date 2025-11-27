import "server-only"

import { DEVTO_BASE_URL } from "@/app/constants/api"
import type { Article, ArticleFilters, DevtoArticle } from "@/types/articles"
import { getApiKey } from "@/utils/getApiKey"
import { toArticle } from "@/utils/normalize"

export async function fetchArticlesFromDevto(
	filters: ArticleFilters & { limit?: number },
	signal?: AbortSignal,
): Promise<Article[]> {
	if (filters.source && filters.source !== "devto") {
		return []
	}

	const url = new URL(DEVTO_BASE_URL)
	const perPage = filters.limit ?? 24
	url.searchParams.set("per_page", perPage.toString())
	if (filters.query) url.searchParams.set("search", filters.query)
	if (filters.tag) url.searchParams.set("tag", filters.tag)
	if (filters.state) url.searchParams.set("state", filters.state)

	const headers = new Headers()
	const apiKey = getApiKey()
	if (apiKey) headers.set("api-key", apiKey)

	const response = await fetch(url, {
		headers,
		signal,
		next: { revalidate: 120 },
	})

	if (!response.ok) {
		throw new Error("Unable to load articles from Dev.to")
	}

	const payload = (await response.json()) as DevtoArticle[]
	return payload.map(toArticle)
}

export async function fetchArticleByIdFromDevto(
	id: string,
	signal?: AbortSignal,
): Promise<Article | null> {
	const url = `${DEVTO_BASE_URL}/${id}`
	const headers = new Headers()
	const apiKey = getApiKey()
	if (apiKey) headers.set("api-key", apiKey)

	const response = await fetch(url, { headers, signal, cache: "no-store" })
	if (response.status === 404) return null
	if (!response.ok) throw new Error("Unable to load article")
	const payload = (await response.json()) as DevtoArticle
	return toArticle(payload)
}
