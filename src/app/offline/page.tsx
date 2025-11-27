import Link from "next/link"
import { Button } from "@/components/ui/button"
import Title from "@/components/ui/title"

export default function OfflinePage() {
	return (
		<div className="space-y-6 text-center">
			<Title>You are offline</Title>
			<p className="text-muted-foreground">
				The app shell is still available, but this page could not load new data. Jump into your
				saved library or try again once the connection returns.
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
	)
}
