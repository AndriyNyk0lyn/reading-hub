"use client"

import type { Article, SavedArticle } from "@/types/articles"
import { getDb } from "./db"

export async function saveArticleForOffline(article: Article): Promise<void> {
	const db = getDb()
	const record: SavedArticle = {
		...article,
		savedAt: new Date().toISOString(),
	}
	await db.articles.put(record)
}

export async function removeSavedArticle(id: string): Promise<void> {
	const db = getDb()
	await db.articles.delete(id)
}

export async function getSavedArticles(): Promise<SavedArticle[]> {
	const db = getDb()
	return db.articles.orderBy("savedAt").reverse().toArray()
}

export async function getSavedArticleById(id: string): Promise<SavedArticle | undefined> {
	const db = getDb()
	return db.articles.get(id)
}
