"use client"

import { Bookmark, BookmarkCheck, ExternalLink } from "lucide-react"
import Link from "next/link"
import { useMemo } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import type { Article } from "@/types/articles"
import { normalizeTags } from "@/utils/normalize"

interface ArticleCardProps {
	article: Article
	isSaved: boolean
	onSave: () => Promise<void> | void
	onRemove: () => Promise<void> | void
}

export function ArticleCard({ article, isSaved, onSave, onRemove }: ArticleCardProps) {
	const publishedAt = useMemo(() => {
		if (!article.publishedAt) return undefined
		const date = new Date(article.publishedAt)
		return date.toLocaleDateString(undefined, {
			month: "short",
			day: "numeric",
		})
	}, [article.publishedAt])

	return (
		<Card className="h-full">
			<CardHeader>
				<CardTitle className="line-clamp-2 text-lg">{article.title}</CardTitle>
				<CardDescription className="line-clamp-3">
					{article.description || "No summary is available for this article yet."}
				</CardDescription>
				<CardAction>
					<Badge variant="secondary" className="uppercase">
						{article.source}
					</Badge>
				</CardAction>
			</CardHeader>
			<CardContent className="space-y-2 text-sm text-muted-foreground">
				<p>By {article.author}</p>
				{publishedAt && <p>Published {publishedAt}</p>}
				<div className="flex flex-wrap gap-1 text-xs">
					{normalizeTags(article.tags).map((tag) => (
						<Badge key={tag} variant="outline">
							#{tag}
						</Badge>
					))}
				</div>
			</CardContent>
			<CardFooter className="flex flex-col gap-3 sm:flex-row sm:justify-between">
				<Button asChild variant="outline" size="sm" className="w-full sm:w-auto">
					<Link href={`/article/${article.id}`}>Read details</Link>
				</Button>
				<div className="flex w-full gap-2 sm:w-auto">
					<Button asChild size="sm" variant="ghost" className="flex-1 sm:flex-none">
						<a href={article.url} target="_blank" rel="noreferrer">
							<ExternalLink className="mr-2 h-4 w-4" />
							Original
						</a>
					</Button>
					<Button
						size="sm"
						className="flex-1 sm:flex-none"
						onClick={() => (isSaved ? onRemove() : onSave())}
					>
						{isSaved ? (
							<>
								<BookmarkCheck className="mr-2 h-4 w-4" />
								Saved
							</>
						) : (
							<>
								<Bookmark className="mr-2 h-4 w-4" />
								Save
							</>
						)}
					</Button>
				</div>
			</CardFooter>
		</Card>
	)
}
