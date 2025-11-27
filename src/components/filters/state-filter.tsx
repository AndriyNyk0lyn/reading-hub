"use client"

import { Button } from "@/components/ui/button"
import type { ArticleStateFilterValue } from "@/types/articles"

export const stateFilters: { value: ArticleStateFilterValue; label: string }[] = [
	{ value: "all", label: "All" },
	{ value: "fresh", label: "Fresh" },
	{ value: "rising", label: "Rising" },
]

interface ArticleStateFilterProps {
	value: ArticleStateFilterValue
	onValueChange: (next: ArticleStateFilterValue) => void
	className?: string
}

export function ArticleStateFilter({ value, onValueChange, className }: ArticleStateFilterProps) {
	return (
		<div className={className}>
			<p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">State</p>
			<div className="flex flex-wrap gap-2">
				{stateFilters.map((option) => (
					<Button
						key={option.value}
						size="sm"
						variant={value === option.value ? "default" : "secondary"}
						onClick={() => onValueChange(option.value)}
					>
						{option.label}
					</Button>
				))}
			</div>
		</div>
	)
}
