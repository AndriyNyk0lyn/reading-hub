import { ArticleDetail } from "@/components/article/article-detail";
import { fetchArticleByIdFromDevto } from "@/lib/articles";
import { isPromiseLike, SearchParams } from "@/utils/isPromiseLike";

export default async function ArticlePage({
  params,
}: {
  params: SearchParams;
}) {
  const resolvedParams = (isPromiseLike(params) ? await params : params) ?? {
    id: "",
  };
  let initialArticle = null;
  try {
    initialArticle = await fetchArticleByIdFromDevto(
      resolvedParams.id as string
    );
  } catch (error) {
    console.error("Failed to fetch article details", error);
  }

  return (
    <ArticleDetail
      articleId={resolvedParams.id as string}
      initialArticle={initialArticle}
    />
  );
}
