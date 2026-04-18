import { motion } from "framer-motion"
import siteData from "@/lib/site-data"
import type { ExperienceItem } from "@/types/site"

export default function Experience() {
	const items: ExperienceItem[] = siteData.experience
	const count = items.length

	return (
		<section
			id="experience"
			className="bg-background text-foreground relative overflow-hidden px-6 py-24 md:px-12"
		>
			<div
				aria-hidden
				className="absolute inset-0 opacity-[0.08]"
				style={{
					backgroundImage:
						"radial-gradient(circle at 20% 0%, var(--color-accent), transparent 42%), linear-gradient(180deg, rgba(245,158,11,0.08) 0%, transparent 28%)",
				}}
			/>

			<div className="relative mx-auto max-w-7xl">
				<motion.h2
					initial={{ opacity: 0, y: 40 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, amount: 0.25 }}
					transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
					className="text-mega font-display text-foreground/95 leading-none"
				>
					experience
					<motion.span
						initial={{ scaleX: 0 }}
						whileInView={{ scaleX: 1 }}
						viewport={{ once: true, amount: 0.25 }}
						transition={{
							duration: 1.1,
							ease: [0.22, 1, 0.36, 1],
							delay: 0.2,
						}}
						className="bg-accent mt-3 block h-2 w-40 origin-left md:h-3 md:w-64"
					/>
				</motion.h2>

				<div className="mt-14 space-y-10">
					{items.map((item, i) => (
						<ExperienceCard
							key={`${item.company}-${i}`}
							item={item}
							index={i}
							total={count}
						/>
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
		<motion.article
			initial={{ opacity: 0, y: 32 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true, amount: 0.2 }}
			transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
			className="border-border/40 relative overflow-hidden rounded-[2rem] border px-6 py-10 shadow-[0_24px_80px_-40px_rgba(0,0,0,0.75)] md:px-10 md:py-12"
			aria-label={`${item.company}, ${item.role}`}
		>
			<div
				aria-hidden
				className="absolute inset-0 opacity-[0.05]"
				style={{
					backgroundImage:
						"radial-gradient(circle at 18% 18%, var(--color-accent), transparent 38%)",
				}}
			/>

			<div className="relative mx-auto max-w-5xl">
				<div className="text-muted-foreground mb-5 flex flex-wrap items-center gap-3 font-mono text-xs tracking-[0.2em] uppercase">
					<span className="text-accent">
						{String(index + 1).padStart(2, "0")} /{" "}
						{String(total).padStart(2, "0")}
					</span>
					<span className="bg-accent inline-block h-px w-8" />
					<span>{item.period}</span>
					<span className="text-border">·</span>
					<span>{item.location}</span>
				</div>

				<h3 className="font-display text-foreground text-[clamp(2.25rem,7vw,5rem)] leading-[0.88] font-bold wrap-break-word">
					{item.company}
				</h3>

				<p className="text-foreground/90 mt-4 text-xl font-medium md:text-2xl">
					{item.role}
				</p>

				<ul className="text-foreground/80 mt-8 grid max-w-3xl gap-2 text-base md:text-lg">
					{bullets.map((b, i) => (
						<li
							key={i}
							className="flex items-center gap-3 leading-relaxed"
						>
							<span
								aria-hidden
								className="text-accent shrink-0 font-mono"
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
		</motion.article>
	)
}
