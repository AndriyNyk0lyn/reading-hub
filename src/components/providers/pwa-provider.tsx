"use client"

import { useEffect } from "react"

export function PwaProvider() {
	useEffect(() => {
		if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
			return
		}

		let registration: ServiceWorkerRegistration | undefined

		navigator.serviceWorker
			.register("/sw.js")
			.then((currentRegistration) => {
				registration = currentRegistration
			})
			.catch((error) => {
				console.error("Service worker registration failed", error)
			})

		return () => {
			if (registration) {
				registration.update().catch(() => undefined)
			}
		}
	}, [])

	return null
}
