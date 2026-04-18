import * as React from "react"
import type { EasterEggId } from "@/types/easter-egg"

interface EasterEggStore {
	found: Set<EasterEggId>
	markFound: (id: EasterEggId) => void
	has: (id: EasterEggId) => boolean
	count: number
}

const Ctx = React.createContext<EasterEggStore | null>(null)

const STORAGE_KEY = "mohiwalla:eggs"

export function EasterEggProvider({ children }: { children: React.ReactNode }) {
	const [found, setFound] = React.useState<Set<EasterEggId>>(() => {
		if (typeof window === "undefined") return new Set()
		try {
			const raw = localStorage.getItem(STORAGE_KEY)
			if (!raw) return new Set()
			const ids = JSON.parse(raw) as EasterEggId[]
			return new Set(ids)
		} catch {
			return new Set()
		}
	})

	const value = React.useMemo<EasterEggStore>(
		() => ({
			found,
			markFound: id =>
				setFound(prev => {
					if (prev.has(id)) return prev
					const next = new Set(prev)
					next.add(id)
					try {
						localStorage.setItem(
							STORAGE_KEY,
							JSON.stringify([...next]),
						)
					} catch {
						/* ignore */
					}
					return next
				}),
			has: id => found.has(id),
			count: found.size,
		}),
		[found],
	)

	return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useEasterEggs() {
	const ctx = React.useContext(Ctx)
	if (!ctx)
		throw new Error("useEasterEggs must be used within <EasterEggProvider>")
	return ctx
}
