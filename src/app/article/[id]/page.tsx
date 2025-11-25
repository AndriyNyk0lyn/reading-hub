import { ArticleDetail } from "@/components/article/article-detail";
import { fetchArticleByIdFromDevto } from "@/lib/articles";

type Params = { id: string } | Promise<{ id: string }>;

async function resolveParams(params: Params) {
  if (
    typeof params === "object" &&
    params !== null &&
    "then" in params &&
    typeof (params as Promise<unknown>).then === "function"
  ) {
    return params as Promise<{ id: string }>;
  }
  return params as { id: string };
}

export default async function ArticlePage({
  params,
}: {
  params: Params;
}) {
  const resolvedParams = await resolveParams(params);
  let initialArticle = null;
  try {
    initialArticle = await fetchArticleByIdFromDevto(resolvedParams.id);
  } catch (error) {
    console.error("Failed to fetch article details", error);
  }

  return (
    <ArticleDetail articleId={resolvedParams.id} initialArticle={initialArticle} />
  );
}

