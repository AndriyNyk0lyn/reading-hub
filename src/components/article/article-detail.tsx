"use client";

import { CSSProperties, useState } from "react";
import { Bookmark, BookmarkCheck, ExternalLink, RefreshCw } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import type { Article } from "@/types/articles";
import { useSavedArticle } from "@/hooks/useOfflineLibrary";
import {
  saveArticleForOffline,
  removeSavedArticle,
} from "@/lib/saved-articles";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import { fetchArticleDetailsClient } from "@/lib/client-articles";
import ReactMarkdown, { Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import Title from "../ui/title";
import { normalizeTags } from "@/utils/normalize";

import {
  Prism as SyntaxHighlighter,
  SyntaxHighlighterProps,
} from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

interface ArticleDetailProps {
  articleId: string;
  initialArticle: Article | null;
  shouldFetchRemote?: boolean;
}

const Highlighter =
  SyntaxHighlighter as unknown as React.FC<SyntaxHighlighterProps>;

export function ArticleDetail({
  articleId,
  initialArticle,
  shouldFetchRemote = true,
}: ArticleDetailProps) {
  const isOnline = useOnlineStatus();
  const allowRemoteFetch = shouldFetchRemote && isOnline;
  const savedArticle = useSavedArticle(articleId);
  const [isSaving, setIsSaving] = useState(false);

  const {
    data: remoteArticle,
    error,
    isError,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["article", articleId],
    queryFn: ({ signal }) => fetchArticleDetailsClient(articleId, signal),
    initialData: initialArticle ?? undefined,
    enabled: !!articleId,
    retry: allowRemoteFetch ? 1 : false,
    staleTime: 1000 * 60 * 5,
    placeholderData: (previousData) => previousData,
  });

  const article = savedArticle ?? remoteArticle ?? null;

  async function handleSaveToggle() {
    if (!article) return;
    setIsSaving(true);
    try {
      if (savedArticle) {
        await removeSavedArticle(article.id);
      } else {
        await saveArticleForOffline(article);
      }
    } finally {
      setIsSaving(false);
    }
  }

  if (!article) {
    return (
      <div className="space-y-4 rounded-lg border bg-card px-6 py-8">
        <p className="text-muted-foreground">
          {isOnline
            ? "Loading article details..."
            : "You are offline and this article has not been saved yet."}
        </p>
        {isError && (
          <div className="text-sm text-destructive">
            {error instanceof Error
              ? `${error.message} – try again when online.`
              : "Unable to load this article right now."}
          </div>
        )}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Button
            onClick={() => refetch()}
            disabled={!allowRemoteFetch || isFetching}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Retry
          </Button>
          <Button variant="outline" asChild>
            <a href="/saved">Go to saved articles</a>
          </Button>
          {!allowRemoteFetch && (
            <p className="text-xs text-muted-foreground">
              Saved copy not found yet. Connect to the internet to fetch it
              once.
            </p>
          )}
        </div>
      </div>
    );
  }

  const codeTheme: { [key: string]: CSSProperties } = oneDark as unknown as {
    [key: string]: CSSProperties;
  };

  const codeBlockStyle: CSSProperties = {
    margin: "1rem 0",
    borderRadius: 6,
    maxWidth: "100%",
    overflowX: "auto",
    whiteSpace: "pre",
    fontSize: "0.8rem",
  };

  const markdownComponents: Components = {
    code({ node, className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || "");

      if (match) {
        return (
          <Highlighter
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            style={codeTheme as any}
            language={match[1]}
            PreTag="div"
            customStyle={codeBlockStyle}
            className="not-prose"
            {...props}
          >
            {String(children).replace(/\n$/, "")}
          </Highlighter>
        );
      }

      return (
        <code className={className} {...props}>
          {children}
        </code>
      );
    },
  };

  return (
    <article className="space-y-6">
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          <Badge>{article.source}</Badge>
          {savedArticle && (
            <Badge variant="secondary">Saved for offline reading</Badge>
          )}
        </div>
        <Title>{article.title}</Title>
        <p className="text-muted-foreground">
          By {article.author}
          {article.publishedAt
            ? ` · ${new Date(article.publishedAt).toLocaleDateString()}`
            : null}
        </p>
        <div className="flex flex-wrap gap-2 text-sm">
          {normalizeTags(article.tags).map((tag) => (
            <Badge key={tag} variant="outline">
              #{tag}
            </Badge>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button
          onClick={handleSaveToggle}
          disabled={isSaving}
          className="flex-1 sm:flex-none"
        >
          {savedArticle ? (
            <>
              <BookmarkCheck className="mr-2 h-4 w-4" /> Remove from offline
            </>
          ) : (
            <>
              <Bookmark className="mr-2 h-4 w-4" /> Save for offline
            </>
          )}
        </Button>
        <Button asChild variant="outline" className="flex-1 sm:flex-none">
          <a href={article.url} target="_blank" rel="noreferrer">
            <ExternalLink className="mr-2 h-4 w-4" />
            View on Dev.to
          </a>
        </Button>
      </div>

      <div className="rounded-lg border bg-card px-6 py-6">
        {article.body ? (
          <div className="prose prose-sm dark:prose-invert max-w-none overflow-x-auto">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={markdownComponents}
            >
              {article.body}
            </ReactMarkdown>
          </div>
        ) : (
          <p className="text-muted-foreground">
            This article body is not available yet. Open the original article to
            read it online.
          </p>
        )}
      </div>
    </article>
  );
}
