import { Suspense } from "react";

import { SavedFeed } from "@/components/saved/saved-feed";

export default function SavedPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">Saved articles</h1>
        <p className="text-muted-foreground">
          Everything you save is stored locally so you can keep reading without
          a connection.
        </p>
      </div>
      <Suspense fallback={<div>Loading saved articles...</div>}>
        <SavedFeed />
      </Suspense>
    </div>
  );
}

