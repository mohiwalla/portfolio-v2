import { useEffect, useRef } from "react"

interface HeroCanvasProps {
	reducedMotion: boolean
}

interface FieldNode {
	x: number
	y: number
	vx: number
	vy: number
	radius: number
}

interface Palette {
	accent: string
	accentGlow: string
	accentSoft: string
	border: string
	foregroundSoft: string
	shadow: string
}

const GRID_SIZE = 72
const NODE_COUNT = 14
const LINK_DISTANCE = 180
const MAX_DPR = 1.5

function randomRange(min: number, max: number) {
	return Math.random() * (max - min) + min
}

function clamp(value: number, min: number, max: number) {
	return Math.min(max, Math.max(min, value))
}

export default function HeroCanvas({ reducedMotion }: HeroCanvasProps) {
	const canvasRef = useRef<HTMLCanvasElement | null>(null)

	useEffect(() => {
		const canvas = canvasRef.current
		if (!canvas) return

		const context = canvas.getContext("2d")
		if (!context) return

		let width = 0
		let height = 0
		let dpr = 1
		let rafId = 0
		let running = false
		let visible = true
		let fieldNodes: FieldNode[] = []
		let gridLayer: HTMLCanvasElement | null = null
		let palette: Palette = {
			accent: "transparent",
			accentGlow: "transparent",
			accentSoft: "transparent",
			border: "transparent",
			foregroundSoft: "transparent",
			shadow: "transparent",
		}

		const readPalette = () => {
			const styles = getComputedStyle(document.documentElement)
			return {
				accent: styles.getPropertyValue("--color-accent").trim(),
				accentGlow: styles.getPropertyValue("--color-accent-glow").trim(),
				accentSoft: styles.getPropertyValue("--color-accent-soft").trim(),
				border: styles.getPropertyValue("--color-border").trim(),
				foregroundSoft: styles
					.getPropertyValue("--color-foreground-soft")
					.trim(),
				shadow: styles.getPropertyValue("--color-shadow-strong").trim(),
			}
		}

		const createNodes = () => {
			fieldNodes = Array.from({ length: NODE_COUNT }, () => ({
				x: randomRange(width * 0.12, width * 0.88),
				y: randomRange(height * 0.14, height * 0.86),
				vx: randomRange(-0.22, 0.22),
				vy: randomRange(-0.16, 0.16),
				radius: randomRange(1.8, 3.6),
			}))
		}

		const buildGridLayer = () => {
			gridLayer = document.createElement("canvas")
			gridLayer.width = Math.max(1, Math.round(width * dpr))
			gridLayer.height = Math.max(1, Math.round(height * dpr))

			const gridContext = gridLayer.getContext("2d")
			if (!gridContext) {
				gridLayer = null
				return
			}

			gridContext.setTransform(dpr, 0, 0, dpr, 0, 0)
			gridContext.clearRect(0, 0, width, height)
			gridContext.strokeStyle = palette.foregroundSoft
			gridContext.lineWidth = 1

			for (let x = GRID_SIZE; x < width; x += GRID_SIZE) {
				gridContext.beginPath()
				gridContext.moveTo(x + 0.5, 0)
				gridContext.lineTo(x + 0.5, height)
				gridContext.stroke()
			}

			for (let y = GRID_SIZE; y < height; y += GRID_SIZE) {
				gridContext.beginPath()
				gridContext.moveTo(0, y + 0.5)
				gridContext.lineTo(width, y + 0.5)
				gridContext.stroke()
			}
		}

		const resize = () => {
			const rect = canvas.getBoundingClientRect()
			width = Math.max(1, rect.width)
			height = Math.max(1, rect.height)
			dpr = clamp(window.devicePixelRatio || 1, 1, MAX_DPR)
			palette = readPalette()

			canvas.width = Math.round(width * dpr)
			canvas.height = Math.round(height * dpr)
			context.setTransform(dpr, 0, 0, dpr, 0, 0)

			buildGridLayer()
			createNodes()
		}

		const drawGlow = (time: number) => {
			const x = width * 0.52 + Math.sin(time * 0.00045) * width * 0.05
			const y = height * 0.24 + Math.cos(time * 0.00035) * height * 0.04
			const radius = Math.min(width, height) * 0.34
			const gradient = context.createRadialGradient(x, y, 0, x, y, radius)

			gradient.addColorStop(0, palette.accentGlow)
			gradient.addColorStop(0.45, palette.accentSoft)
			gradient.addColorStop(1, "transparent")

			context.fillStyle = gradient
			context.beginPath()
			context.arc(x, y, radius, 0, Math.PI * 2)
			context.fill()
		}

		const drawField = (time: number) => {
			context.clearRect(0, 0, width, height)

			if (gridLayer) {
				context.drawImage(gridLayer, 0, 0, width, height)
			}

			drawGlow(time)

			context.strokeStyle = palette.border
			context.lineWidth = 1

			for (let i = 0; i < fieldNodes.length; i += 1) {
				const node = fieldNodes[i]

				if (!reducedMotion) {
					node.x += node.vx
					node.y += node.vy

					if (node.x <= width * 0.08 || node.x >= width * 0.92) {
						node.vx *= -1
					}

					if (node.y <= height * 0.1 || node.y >= height * 0.9) {
						node.vy *= -1
					}
				}

				for (let j = i + 1; j < fieldNodes.length; j += 1) {
					const other = fieldNodes[j]
					const dx = other.x - node.x
					const dy = other.y - node.y
					const distance = Math.hypot(dx, dy)

					if (distance > LINK_DISTANCE) continue

					context.globalAlpha = 1 - distance / LINK_DISTANCE
					context.strokeStyle = palette.border
					context.beginPath()
					context.moveTo(node.x, node.y)
					context.lineTo(other.x, other.y)
					context.stroke()
				}
			}

			context.globalAlpha = 1

			for (const node of fieldNodes) {
				context.fillStyle = palette.shadow
				context.beginPath()
				context.arc(node.x, node.y, node.radius + 3, 0, Math.PI * 2)
				context.fill()

				context.fillStyle = palette.accent
				context.beginPath()
				context.arc(node.x, node.y, node.radius, 0, Math.PI * 2)
				context.fill()
			}
		}

		const render = (time = 0) => {
			drawField(time)

			if (!reducedMotion && running) {
				rafId = window.requestAnimationFrame(render)
			}
		}

		const start = () => {
			if (running || !visible || reducedMotion) return
			running = true
			rafId = window.requestAnimationFrame(render)
		}

		const stop = () => {
			running = false
			if (rafId) {
				window.cancelAnimationFrame(rafId)
				rafId = 0
			}
		}

		const observer = new IntersectionObserver(entries => {
			visible = entries[0]?.isIntersecting ?? true
			if (visible) {
				if (reducedMotion) {
					render()
					return
				}
				start()
				return
			}
			stop()
		})

		const handleVisibility = () => {
			visible = document.visibilityState === "visible"
			if (visible) {
				if (reducedMotion) {
					render()
					return
				}
				start()
				return
			}
			stop()
		}

		resize()
		render()
		observer.observe(canvas)
		window.addEventListener("resize", resize)
		document.addEventListener("visibilitychange", handleVisibility)
		start()

		return () => {
			stop()
			observer.disconnect()
			window.removeEventListener("resize", resize)
			document.removeEventListener("visibilitychange", handleVisibility)
		}
	}, [reducedMotion])

	return (
		<div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
			<canvas
				ref={canvasRef}
				className="absolute inset-0 size-full opacity-90"
			/>
			<div className="grain" />
		</div>
	)
}
