import { Suspense } from "react";

import { SavedFeed } from "@/components/saved/saved-feed";
import Title from "@/components/ui/title";

export default function SavedPage() {
  return (
    <div className="space-y-6">
      <div>
        <Title>Saved articles</Title>
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

