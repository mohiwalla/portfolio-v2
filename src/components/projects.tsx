import { useEffect, useRef, useState } from "react"
import {
	motion,
	useMotionValueEvent,
	useReducedMotion,
	useScroll,
	useTransform,
	type MotionValue,
} from "framer-motion"
import { ArrowUpRight } from "lucide-react"
import siteData from "@/lib/site-data"
import type { ProjectItem } from "@/types/site"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const statusStyles: Record<NonNullable<ProjectItem["status"]>, string> = {
	shipped: "border-accent/50 bg-accent/15 text-accent",
	"in-progress": "border-foreground/40 bg-transparent text-foreground/80",
	legacy: "border-border bg-muted/40 text-muted-foreground",
}

const statusLabel: Record<NonNullable<ProjectItem["status"]>, string> = {
	shipped: "shipped",
	"in-progress": "in progress",
	legacy: "legacy",
}

interface ProjectMetrics {
	stageHeight: number
	enabled: boolean
}

function clamp(value: number, min: number, max: number) {
	return Math.min(max, Math.max(min, value))
}

function interpolate(start: number, end: number, progress: number) {
	return start + (end - start) * progress
}

export default function Projects() {
	const containerRef = useRef<HTMLDivElement>(null)
	const projects: ProjectItem[] = siteData.projects
	const count = projects.length
	const [activeIndex, setActiveIndex] = useState(0)
	const prefersReducedMotion = useReducedMotion()
	const [metrics, setMetrics] = useState<ProjectMetrics>({
		stageHeight: 0,
		enabled: false,
	})

	useEffect(() => {
		const measure = () => {
			const enabled =
				window.innerWidth >= 1024 && !prefersReducedMotion && count > 1
			setMetrics({
				stageHeight: enabled
					? window.innerHeight * Math.max(count, 1)
					: 0,
				enabled,
			})
			if (!enabled) {
				setActiveIndex(0)
			}
		}

		measure()
		window.addEventListener("resize", measure)
		return () => window.removeEventListener("resize", measure)
	}, [count, prefersReducedMotion])

	const { scrollYProgress } = useScroll({
		target: containerRef,
		offset: ["start start", "end end"],
	})

	const progressIndex = useTransform(scrollYProgress, value =>
		metrics.enabled ? value * (count - 1) : 0,
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
			id="projects"
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
			<div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 pb-12 md:px-12 lg:hidden">
				<motion.h2
					initial={{ opacity: 0, y: 40 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, amount: 0.4 }}
					transition={{
						duration: 0.8,
						ease: [0.22, 1, 0.36, 1],
					}}
					className="text-mega font-display text-foreground/95 leading-none"
				>
					projects
				</motion.h2>
				<motion.p
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, amount: 0.4 }}
					transition={{
						duration: 0.7,
						ease: [0.22, 1, 0.36, 1],
						delay: 0.15,
					}}
					className="text-muted-foreground max-w-xl font-mono text-xs tracking-[0.25em] uppercase"
				>
					<span className="text-accent">»</span> things that ship,
					break, and ship again.
				</motion.p>
			</div>

			<div
				className={cn(
					"relative overflow-visible",
					metrics.enabled &&
						"lg:sticky lg:top-0 lg:h-screen lg:overflow-hidden",
				)}
			>
				<div className="pointer-events-none absolute inset-x-0 top-0 z-30 hidden flex-col gap-3 px-6 pt-10 md:px-12 md:pt-14 lg:flex">
					<div className="flex items-start justify-between gap-6">
						<motion.h2
							initial={{ opacity: 0, y: 40 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true, amount: 0.4 }}
							transition={{
								duration: 0.8,
								ease: [0.22, 1, 0.36, 1],
							}}
							className="text-mega font-display text-foreground/95 leading-none"
						>
							projects
						</motion.h2>
						<motion.p
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true, amount: 0.4 }}
							transition={{
								duration: 0.7,
								ease: [0.22, 1, 0.36, 1],
								delay: 0.15,
							}}
							className="text-muted-foreground hidden max-w-xs pt-6 font-mono text-xs tracking-[0.25em] uppercase md:block"
						>
							<span className="text-accent">»</span> things that
							ship, break, and ship again.
						</motion.p>
					</div>
				</div>

				<div className="text-muted-foreground pointer-events-none absolute top-10 left-6 z-30 hidden font-mono text-xs tracking-[0.3em] uppercase md:left-12 lg:top-14 lg:block">
					<span className="text-accent">
						{String(activeIndex + 1).padStart(2, "0")}
					</span>{" "}
					/ {String(count).padStart(2, "0")}
				</div>

				<div className="relative mx-auto flex w-full max-w-5xl flex-col gap-6 px-6 md:px-12 lg:h-full lg:items-center lg:justify-center lg:gap-0 lg:px-6">
					{projects.map((project, i) => (
						<ProjectStackItem
							key={`${project.name}-${i}`}
							project={project}
							index={i}
							total={count}
							activeIndex={activeIndex}
							progressIndex={progressIndex}
							enabled={metrics.enabled}
						/>
					))}
				</div>

				<div className="pointer-events-none absolute inset-x-0 bottom-8 z-30 hidden px-6 md:px-12 lg:block">
					<div className="bg-border/50 relative h-[2px] w-full overflow-hidden">
						<motion.span
							className="bg-accent absolute inset-y-0 left-0 block h-full w-full origin-left"
							style={{
								scaleX: metrics.enabled ? scrollYProgress : 0,
							}}
						/>
					</div>
				</div>
			</div>
		</section>
	)
}

function ProjectStackItem({
	project,
	index,
	total,
	activeIndex,
	progressIndex,
	enabled,
}: {
	project: ProjectItem
	index: number
	total: number
	activeIndex: number
	progressIndex: MotionValue<number>
	enabled: boolean
}) {
	const opacity = useTransform(progressIndex, value => {
		if (!enabled) return 1
		if (index === 0 && value <= 0) return 1
		if (value <= index - 1 || value >= index + 1) return 0
		if (value < index) {
			return clamp(value - (index - 1), 0, 1)
		}
		return 1 - clamp(value - index, 0, 1)
	})

	const y = useTransform(progressIndex, value => {
		if (!enabled) return 0
		if (index === 0 && value <= 0) return 0
		if (value < index) {
			return interpolate(60, 0, clamp(value - (index - 1), 0, 1))
		}
		return interpolate(0, -40, clamp(value - index, 0, 1))
	})

	const scale = useTransform(progressIndex, value => {
		if (!enabled) return 1
		if (index === 0 && value <= 0) return 1
		if (value < index) {
			return interpolate(0.96, 1, clamp(value - (index - 1), 0, 1))
		}
		return 1
	})

	const rotate = useTransform(progressIndex, value => {
		if (!enabled || value <= index) return 0
		return interpolate(0, -4, clamp(value - index, 0, 1))
	})

	return (
		<motion.div
			className={cn(
				"relative w-full",
				enabled &&
					"lg:absolute lg:inset-x-6 lg:top-1/2 lg:-translate-y-1/2 lg:will-change-transform xl:inset-x-12",
				enabled && activeIndex !== index && "lg:pointer-events-none",
			)}
			style={{
				zIndex: total - index,
				opacity,
				y,
				scale,
				rotate,
			}}
		>
			<ProjectCard project={project} index={index} total={total} />
		</motion.div>
	)
}

function ProjectCard({
	project,
	index,
	total,
}: {
	project: ProjectItem
	index: number
	total: number
}) {
	const status = project.status
	return (
		<Card className="border-border/70 bg-card/90 relative flex h-full flex-col overflow-hidden p-2 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.6)] backdrop-blur-sm lg:max-h-[min(72dvh,42rem)]">
			<div
				aria-hidden
				className="pointer-events-none absolute inset-0 opacity-[0.06]"
				style={{
					backgroundImage:
						"radial-gradient(circle at 20% 0%, var(--color-accent), transparent 55%)",
				}}
			/>
			<CardHeader className="relative flex flex-col gap-4 p-6 md:p-10">
				<div className="flex flex-wrap items-center gap-2">
					{status ? (
						<Badge
							className={cn(
								"border font-mono text-[10px] tracking-[0.2em] uppercase",
								statusStyles[status],
							)}
						>
							<span
								className={cn(
									"mr-2 inline-block h-1.5 w-1.5 rounded-full",
									status === "shipped" && "bg-accent",
									status === "in-progress" &&
										"bg-foreground/70",
									status === "legacy" &&
										"bg-muted-foreground",
								)}
							/>
							{statusLabel[status]}
						</Badge>
					) : null}
					{project.tags.map(tag => (
						<span
							key={tag}
							className="border-border/80 bg-background/60 text-foreground/70 inline-flex items-center rounded-full border px-2.5 py-0.5 font-mono text-[10px] tracking-[0.18em] uppercase"
						>
							{tag}
						</span>
					))}
					<span className="text-muted-foreground ml-auto font-mono text-[10px] tracking-[0.3em] uppercase">
						{String(index + 1).padStart(2, "0")} /{" "}
						{String(total).padStart(2, "0")}
					</span>
				</div>
				<h3 className="group font-display text-foreground relative w-full text-4xl leading-[0.9] break-words md:text-6xl">
					<span className="relative">
						{project.name}
						<span className="bg-accent absolute -bottom-1 left-0 h-[3px] w-0 transition-all duration-500 ease-out group-hover:w-full" />
					</span>
				</h3>
				<p className="text-foreground/80 text-lg md:text-xl">
					{project.tagline}
				</p>
			</CardHeader>
			<CardContent className="relative flex-1 px-6 md:px-10 lg:min-h-0 lg:overflow-y-auto">
				<p className="text-muted-foreground max-w-2xl text-base leading-relaxed">
					{project.description}
				</p>
			</CardContent>
			{project.href ? (
				<CardFooter className="relative px-6 pb-6 md:px-10 md:pb-10">
					<a
						href={project.href}
						target="_blank"
						rel="noreferrer noopener"
						className="group text-foreground/80 hover:text-accent inline-flex items-center gap-2 font-mono text-xs tracking-[0.3em] uppercase transition-colors"
					>
						view
						<ArrowUpRight
							size={14}
							className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
						/>
					</a>
				</CardFooter>
			) : null}
		</Card>
	)
}
