import { endsWith, pushBounded } from "@/utils/sequence"

export const KONAMI_CODE = [
	"ArrowUp",
	"ArrowUp",
	"ArrowDown",
	"ArrowDown",
	"ArrowLeft",
	"ArrowRight",
	"ArrowLeft",
	"ArrowRight",
	"b",
	"a",
] as const

export type KonamiKey = (typeof KONAMI_CODE)[number]

export function createKonamiDetector(onMatch: () => void) {
	let buffer: string[] = []
	const handler = (event: KeyboardEvent) => {
		const key = event.key.length === 1 ? event.key.toLowerCase() : event.key
		buffer = pushBounded(buffer, key, KONAMI_CODE.length)
		if (endsWith(buffer, [...KONAMI_CODE])) {
			buffer = []
			onMatch()
		}
	}
	return handler
}
