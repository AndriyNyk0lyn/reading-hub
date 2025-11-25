export function SiteFooter() {
  return (
    <footer className="border-t">
      <div className="mx-auto flex max-w-5xl flex-col gap-2 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>Built as a PWA demo focused on offline reading.</p>
        <a
          href="https://github.com/andriynykolyn/offline-reading-hub"
          target="_blank"
          rel="noreferrer"
          className="text-primary underline-offset-4 hover:underline"
        >
          View on GitHub
        </a>
      </div>
    </footer>
  );
}

