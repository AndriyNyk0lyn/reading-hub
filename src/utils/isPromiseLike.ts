export type SearchParams =
  | Record<string, string | string[] | undefined>
  | Promise<Record<string, string | string[] | undefined>>
  | { id: string };

export function isPromiseLike(
  value: SearchParams
): value is Promise<Record<string, string | string[] | undefined>> {
  return (
    typeof value === "object" &&
    value !== null &&
    "then" in value &&
    typeof (value as PromiseLike<unknown>).then === "function"
  );
}
