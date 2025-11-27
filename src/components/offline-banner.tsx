"use client"

import { useOnlineStatus } from "@/hooks/useOnlineStatus"

export function OfflineBanner() {
	const isOnline = useOnlineStatus()
	if (isOnline) return null

	return (
		<div className="bg-amber-500/20 px-4 py-2 text-sm text-amber-900 dark:text-amber-100">
			You are offline. Saved articles are still available, and new data will sync once you
			reconnect.
		</div>
	)
}
