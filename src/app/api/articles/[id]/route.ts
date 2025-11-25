import { NextResponse } from "next/server";
import { fetchArticleByIdFromDevto } from "@/lib/articles";
import { SearchParams, isPromiseLike } from "@/utils/isPromiseLike";

export async function GET(
  _request: Request,
  context: { params: SearchParams | Promise<SearchParams> }
) {
  const params = (isPromiseLike(context.params as SearchParams)
    ? await context.params
    : context.params) ?? { id: "" };

  if (!(params as { id: string }).id) {
    return NextResponse.json(
      { message: "Article id is required" },
      { status: 400 }
    );
  }

  try {
    const article = await fetchArticleByIdFromDevto(
      (params as { id: string }).id
    );
    if (!article) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }
    return NextResponse.json(article, {
      headers: {
        "Cache-Control": "public, max-age=60, s-maxage=60",
      },
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Unable to fetch article" },
      { status: 500 }
    );
  }
}
