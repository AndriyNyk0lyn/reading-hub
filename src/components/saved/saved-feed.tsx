"use client";

import { useMemo, useState } from "react";
import { BookmarkMinus } from "lucide-react";
import Link from "next/link";

import { useOfflineLibrary } from "@/hooks/useOfflineLibrary";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { normalizeTags } from "@/utils/normalize";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";

export function SavedFeed() {
  const { savedArticles, removeArticle } = useOfflineLibrary();
  const [query, setQuery] = useState("");
  const [tag, setTag] = useState<string | null>(null);
  const isOnline = useOnlineStatus();
  const availableTags = useMemo(() => {
    const pool = new Set<string>();
    savedArticles.forEach((article) =>
      normalizeTags(article.tags).forEach((currentTag) => {
        if (currentTag) pool.add(currentTag);
      })
    );
    return Array.from(pool);
  }, [savedArticles]);

  const filteredArticles = useMemo(() => {
    return savedArticles.filter((article) => {
      const matchesQuery =
        !query ||
        article.title.toLowerCase().includes(query.toLowerCase()) ||
        article.description?.toLowerCase().includes(query.toLowerCase());
      const matchesTag = !tag || normalizeTags(article.tags).includes(tag);
      return matchesQuery && matchesTag;
    });
  }, [savedArticles, query, tag]);

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 rounded-lg border bg-card px-4 py-4">
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search saved articles"
        />
        {availableTags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {availableTags.map((tagOption) => (
              <Button
                key={tagOption}
                size="sm"
                variant={tag === tagOption ? "default" : "secondary"}
                onClick={() => setTag(tag === tagOption ? null : tagOption)}
              >
                #{tagOption}
              </Button>
            ))}
            {tag && (
              <Button variant="ghost" size="sm" onClick={() => setTag(null)}>
                Clear tag
              </Button>
            )}
          </div>
        )}
      </div>

      {filteredArticles.length === 0 ? (
        <div className="rounded-md border px-6 py-10 text-center text-muted-foreground">
          {savedArticles.length === 0
            ? "You have not saved any articles yet. Save a story to read it offline."
            : "No saved articles match that filter."}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filteredArticles.map((article) => (
            <Card key={article.id}>
              <CardHeader>
                <CardTitle className="line-clamp-2">{article.title}</CardTitle>
                <CardDescription className="text-xs">
                  Saved on{" "}
                  {new Date(article.savedAt).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p className="line-clamp-3">
                  {article.description ||
                    "This saved article does not include a summary."}
                </p>
                <div className="flex flex-wrap gap-1 text-xs">
                  {normalizeTags(article.tags).map((currentTag) => (
                    <Badge key={currentTag} variant="outline">
                      #{currentTag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-3 sm:flex-row sm:justify-between">
                <Button asChild size="sm" variant="outline">
                  {isOnline ? (
                    <Link href={`/article/${article.id}`}>Open</Link>
                  ) : (
                    <a href={`/article/${article.id}`}>Open</a>
                  )}
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => removeArticle(article.id)}
                >
                  <BookmarkMinus className="mr-2 h-4 w-4" />
                  Remove
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}
