export function getApiKey(): string | undefined {
  return process.env.DEVTO_API_KEY || process.env.NEXT_PUBLIC_DEVTO_API_KEY;
}
