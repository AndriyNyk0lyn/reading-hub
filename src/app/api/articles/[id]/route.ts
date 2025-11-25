import { NextResponse } from "next/server";

import { fetchArticleByIdFromDevto } from "@/lib/articles";

interface Params {
  id: string;
}

function isPromiseLike(
  value: Params | Promise<Params>,
): value is Promise<Params> {
  return (
    typeof value === "object" &&
    value !== null &&
    "then" in value &&
    typeof (value as PromiseLike<Params>).then === "function"
  );
}

export async function GET(
  _request: Request,
  context: { params: Params | Promise<Params> },
) {
  const params = (isPromiseLike(context.params)
    ? await context.params
    : context.params) ?? { id: "" };

  if (!params.id) {
    return NextResponse.json(
      { message: "Article id is required" },
      { status: 400 },
    );
  }

  try {
    const article = await fetchArticleByIdFromDevto(params.id);
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
      { status: 500 },
    );
  }
}

