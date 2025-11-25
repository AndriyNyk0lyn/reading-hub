import { NextResponse } from "next/server";

import { fetchArticlesFromDevto } from "@/lib/articles";
import type { ArticleFilters } from "@/types/articles";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const filters: ArticleFilters & { limit?: number } = {};

  const query = url.searchParams.get("query");
  const tag = url.searchParams.get("tag");
  const source = url.searchParams.get("source");
  const limitParam = url.searchParams.get("limit");

  if (query) filters.query = query;
  if (tag) filters.tag = tag;
  if (source && source !== "all") {
    filters.source = source as ArticleFilters["source"];
  }
  if (limitParam) {
    const parsed = Number(limitParam);
    if (!Number.isNaN(parsed)) filters.limit = parsed;
  }

  try {
    const articles = await fetchArticlesFromDevto(filters);
    return NextResponse.json(articles, {
      headers: {
        "Cache-Control": "public, max-age=60, s-maxage=60",
      },
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Unable to fetch articles" },
      { status: 500 },
    );
  }
}

