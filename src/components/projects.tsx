import { motion } from "framer-motion"
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

export default function Projects() {
	const projects: ProjectItem[] = siteData.projects
	const count = projects.length

	return (
		<section
			id="projects"
			className="bg-background text-foreground relative overflow-hidden px-6 py-24 md:px-12"
		>
			<div className="relative mx-auto max-w-7xl">
				<div className="flex flex-col gap-4">
					<motion.h2
						initial={{ opacity: 0, y: 40 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true, amount: 0.25 }}
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
						viewport={{ once: true, amount: 0.25 }}
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

				<div className="mt-14 grid gap-6 xl:grid-cols-2">
					{projects.map((project, i) => (
						<motion.div
							key={`${project.name}-${i}`}
							initial={{ opacity: 0, y: 28 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true, amount: 0.18 }}
							transition={{
								duration: 0.55,
								ease: [0.22, 1, 0.36, 1],
								delay: i * 0.05,
							}}
							className="h-full"
						>
							<ProjectCard
								project={project}
								index={i}
								total={count}
							/>
						</motion.div>
					))}
				</div>
			</div>
		</section>
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
		<Card className="border-border/70 bg-card/90 relative flex h-full flex-col overflow-hidden p-2 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.6)] backdrop-blur-sm">
			<div
				aria-hidden
				className="absolute inset-0 opacity-[0.06]"
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
			<CardContent className="relative flex-1 px-6 md:px-10">
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
