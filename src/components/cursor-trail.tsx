import { useEffect, useRef, useState } from "react"
import { useGlobal } from "@/stores/global"

interface TrailPoint {
	id: number
	x: number
	y: number
}

const MAX_POINTS = 18

function prefersReducedMotion() {
	if (typeof window === "undefined") return false
	return window.matchMedia("(prefers-reduced-motion: reduce)").matches
}

export default function CursorTrail() {
	const { cursorTrailOn } = useGlobal()
	const [points, setPoints] = useState<TrailPoint[]>([])
	const [reduced, setReduced] = useState(prefersReducedMotion)
	const idRef = useRef(0)

	useEffect(() => {
		if (typeof window === "undefined") return
		const mql = window.matchMedia("(prefers-reduced-motion: reduce)")
		const update = () => setReduced(mql.matches)
		update()
		mql.addEventListener("change", update)
		return () => mql.removeEventListener("change", update)
	}, [])

	useEffect(() => {
		if (!cursorTrailOn || reduced) return

		const onMove = (event: MouseEvent) => {
			idRef.current += 1
			const point: TrailPoint = {
				id: idRef.current,
				x: event.clientX,
				y: event.clientY,
			}
			setPoints(prev => {
				const next = [...prev, point]
				if (next.length > MAX_POINTS) {
					next.splice(0, next.length - MAX_POINTS)
				}
				return next
			})
		}

		window.addEventListener("mousemove", onMove)
		return () => {
			window.removeEventListener("mousemove", onMove)
			setPoints([])
		}
	}, [cursorTrailOn, reduced])

	if (!cursorTrailOn || reduced) return null

	return (
		<div
			aria-hidden
			className="pointer-events-none fixed inset-0 z-50 overflow-hidden"
		>
			{points.map((p, i) => {
				const progress = (i + 1) / points.length
				return (
					<span
						key={p.id}
						className="bg-accent absolute rounded-full"
						style={{
							left: p.x,
							top: p.y,
							width: 6,
							height: 6,
							opacity: progress,
							transform: `translate(-50%, -50%) scale(${progress})`,
							boxShadow: `0 0 12px var(--color-accent)`,
							transition: "opacity 180ms linear",
						}}
					/>
				)
			})}
		</div>
	)
}
