import siteData from "@/lib/site-data"
import { cn } from "@/lib/utils"

interface MarqueeRowProps {
	reverse?: boolean
	items: string[]
	duration?: string
}

function MarqueeRow({ reverse = false, items, duration }: MarqueeRowProps) {
	const track = [...items, ...items]
	return (
		<div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
			<div
				className={cn(
					"animate-marquee flex w-max",
					reverse && "[animation-direction:reverse]",
				)}
				style={duration ? { animationDuration: duration } : undefined}
			>
				{track.map((skill, i) => (
					<span
						key={`${skill}-${i}`}
						className="border-border hover:border-accent hover:text-accent mx-2 inline-flex items-center gap-2 rounded-full border px-5 py-2 font-mono text-sm whitespace-nowrap transition-colors"
					>
						<span className="bg-accent/60 h-1 w-1 rounded-full" />
						{skill}
					</span>
				))}
			</div>
		</div>
	)
}

export default function Skills() {
	const { skills } = siteData

	return (
		<section id="skills" className="relative w-full overflow-hidden py-32">
			<div className="relative mx-auto max-w-7xl px-6">
				<div className="relative">
					<span
						aria-hidden
						className="font-display text-foreground/4 text-mega absolute inset-0 flex items-center justify-center whitespace-nowrap select-none"
					>
						stack
					</span>
					<h2 className="font-display text-mega text-foreground relative leading-none">
						stack
					</h2>
				</div>

				<p className="text-muted-foreground mt-6 max-w-xl font-mono text-sm">
					the usual suspects. some by choice, some by necessity.
				</p>
			</div>

			<div className="mt-16 space-y-6">
				<MarqueeRow items={skills} duration="32s" />
				<MarqueeRow items={skills} reverse duration="40s" />
				<MarqueeRow items={skills} duration="28s" />
			</div>
		</section>
	)
}
