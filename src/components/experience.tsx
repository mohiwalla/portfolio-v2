import { useEffect, useRef, useState } from "react"
import {
	motion,
	useMotionValueEvent,
	useReducedMotion,
	useScroll,
	useTransform,
} from "framer-motion"
import siteData from "@/lib/site-data"
import type { ExperienceItem } from "@/types/site"
import { cn } from "@/lib/utils"

interface ExperienceMetrics {
	distance: number
	stageHeight: number
	enabled: boolean
}

export default function Experience() {
	const containerRef = useRef<HTMLDivElement>(null)
	const pinRef = useRef<HTMLDivElement>(null)
	const trackRef = useRef<HTMLDivElement>(null)
	const items: ExperienceItem[] = siteData.experience
	const count = items.length
	const [activeIndex, setActiveIndex] = useState(0)
	const prefersReducedMotion = useReducedMotion()
	const [metrics, setMetrics] = useState<ExperienceMetrics>({
		distance: 0,
		stageHeight: 0,
		enabled: false,
	})

	useEffect(() => {
		const track = trackRef.current
		const pin = pinRef.current
		if (!track || !pin) return

		const measure = () => {
			const canAnimate =
				window.innerWidth >= 1024 && !prefersReducedMotion && count > 1
			if (!canAnimate) {
				setMetrics({
					distance: 0,
					stageHeight: 0,
					enabled: false,
				})
				setActiveIndex(0)
				return
			}

			const distance = Math.max(0, track.scrollWidth - pin.clientWidth)
			const scrollSpan = Math.max(
				window.innerHeight * 0.7,
				distance * 0.72,
			)

			setMetrics({
				distance,
				stageHeight: window.innerHeight + scrollSpan,
				enabled: distance > 0,
			})
		}

		measure()
		const resizeObserver = new ResizeObserver(measure)
		resizeObserver.observe(track)
		resizeObserver.observe(pin)
		window.addEventListener("resize", measure)

		return () => {
			resizeObserver.disconnect()
			window.removeEventListener("resize", measure)
		}
	}, [count, prefersReducedMotion])

	const { scrollYProgress } = useScroll({
		target: containerRef,
		offset: ["start start", "end end"],
	})

	const x = useTransform(scrollYProgress, value =>
		metrics.enabled ? -metrics.distance * value : 0,
	)

	useMotionValueEvent(scrollYProgress, "change", value => {
		if (!metrics.enabled) {
			setActiveIndex(0)
			return
		}
		setActiveIndex(Math.min(count - 1, Math.round(value * (count - 1))))
	})

	return (
		<section
			id="experience"
			ref={containerRef}
			className="bg-background text-foreground relative py-24 lg:py-0"
			style={
				metrics.enabled
					? {
							height: metrics.stageHeight,
						}
					: undefined
			}
		>
			<div
				aria-hidden
				className="pointer-events-none absolute inset-0 opacity-[0.08]"
				style={{
					backgroundImage:
						"radial-gradient(circle at 20% 0%, var(--color-accent), transparent 42%), linear-gradient(180deg, rgba(245,158,11,0.08) 0%, transparent 28%)",
				}}
			/>

			<div className="mx-auto flex max-w-7xl items-start justify-between gap-6 px-6 pb-12 md:px-12 lg:hidden">
				<h2 className="text-mega font-display text-foreground/95 leading-none">
					experience
				</h2>
			</div>

			<div
				ref={pinRef}
				className={cn(
					"relative overflow-visible",
					metrics.enabled &&
						"lg:sticky lg:top-0 lg:h-screen lg:overflow-hidden",
				)}
			>
				<div className="pointer-events-none absolute inset-x-0 top-0 z-20 hidden items-start justify-between px-6 pt-10 md:px-12 md:pt-14 lg:flex">
					<motion.h2
						initial={{ opacity: 0, y: 40 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true, amount: 0.4 }}
						transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
						className="text-mega font-display text-foreground/95 leading-none"
					>
						experience
						<motion.span
							initial={{ scaleX: 0 }}
							whileInView={{ scaleX: 1 }}
							viewport={{ once: true, amount: 0.4 }}
							transition={{
								duration: 1.1,
								ease: [0.22, 1, 0.36, 1],
								delay: 0.2,
							}}
							className="bg-accent block h-2 w-40 origin-left md:h-3 md:w-64"
						/>
					</motion.h2>
				</div>

				<motion.div
					ref={trackRef}
					style={metrics.enabled ? { x } : undefined}
					className="flex flex-col lg:h-full lg:w-max lg:flex-row lg:will-change-transform"
				>
					{items.map((item, i) => (
						<ExperienceCard
							key={`${item.company}-${i}`}
							item={item}
							index={i}
							total={count}
						/>
					))}
				</motion.div>

				<div className="pointer-events-none absolute inset-x-0 bottom-10 z-20 hidden items-center justify-center gap-3 lg:flex">
					{items.map((_, i) => (
						<span
							key={i}
							className={cn(
								"bg-border/60 relative h-1.5 w-10 overflow-hidden rounded-full transition-colors",
								i === activeIndex && "bg-border",
							)}
						>
							<span
								className={cn(
									"bg-accent absolute inset-y-0 left-0 transition-all duration-500 ease-out",
									i < activeIndex && "w-full",
									i === activeIndex && "w-1/2",
									i > activeIndex && "w-0",
								)}
							/>
						</span>
					))}
				</div>
			</div>
		</section>
	)
}

function ExperienceCard({
	item,
	index,
	total,
}: {
	item: ExperienceItem
	index: number
	total: number
}) {
	const bullets = item.bullets.slice(0, 4)
	return (
		<article
			className="border-border/40 relative flex w-full flex-col justify-end border-b px-6 py-12 last:border-b-0 md:px-12 lg:h-screen lg:w-screen lg:shrink-0 lg:border-b-0 lg:px-20 lg:pt-[34vh] lg:pb-28"
			aria-label={`${item.company}, ${item.role}`}
		>
			<div
				aria-hidden
				className="pointer-events-none absolute inset-0 opacity-[0.05]"
				style={{
					backgroundImage:
						"radial-gradient(circle at 18% 18%, var(--color-accent), transparent 38%)",
				}}
			/>

			<div className="text-muted-foreground pointer-events-none absolute top-10 right-6 hidden font-mono text-xs tracking-[0.25em] uppercase md:right-12 lg:top-16 lg:right-20 lg:block">
				{String(index + 1).padStart(2, "0")} /{" "}
				{String(total).padStart(2, "0")}
			</div>

			<div className="mx-auto w-full max-w-5xl">
				<div className="text-muted-foreground mb-5 flex flex-wrap items-center gap-3 font-mono text-xs tracking-[0.2em] uppercase">
					<span className="text-accent lg:hidden">
						{String(index + 1).padStart(2, "0")} /{" "}
						{String(total).padStart(2, "0")}
					</span>
					<span className="bg-accent inline-block h-px w-8" />
					<span>{item.period}</span>
					<span className="text-border">·</span>
					<span>{item.location}</span>
				</div>

				<h3 className="text-mega font-display text-foreground leading-[0.82] break-words">
					{item.company}
				</h3>

				<p className="text-foreground/90 mt-4 text-xl font-medium md:text-2xl">
					{item.role}
				</p>

				<ul className="text-foreground/80 mt-8 grid max-w-3xl gap-2 text-base md:text-lg">
					{bullets.map((b, i) => (
						<li
							key={i}
							className="flex items-start gap-3 leading-relaxed"
						>
							<span
								aria-hidden
								className="text-accent mt-[0.35em] shrink-0 font-mono"
							>
								»
							</span>
							<span>{b}</span>
						</li>
					))}
				</ul>

				<p className="text-muted-foreground mt-8 max-w-2xl font-mono text-sm italic md:text-base">
					{item.punchline}
				</p>
			</div>
		</article>
	)
}
