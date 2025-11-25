import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function OfflinePage() {
  return (
    <div className="space-y-6 text-center">
      <h1 className="text-3xl font-semibold">You are offline</h1>
      <p className="text-muted-foreground">
        The app shell is still available, but this page could not load new data.
        Jump into your saved library or try again once the connection returns.
      </p>
      <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <Button asChild>
          <Link href="/saved">Saved articles</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/">Back to feed</Link>
        </Button>
      </div>
    </div>
  );
}

