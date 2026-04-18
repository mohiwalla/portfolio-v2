import { motion, type Variants } from "framer-motion"
import { Hash, Keyboard, Sparkles, Terminal } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import siteData from "@/lib/site-data"
import { useEasterEggs } from "@/stores/easter-eggs"

const TOTAL_EGGS = 7

const CLUE_ICONS: LucideIcon[] = [Terminal, Keyboard, Sparkles, Hash]

const fadeUp: Variants = {
	hidden: { opacity: 0, y: 24 },
	show: (i: number) => ({
		opacity: 1,
		y: 0,
		transition: {
			duration: 0.55,
			ease: [0.2, 0.8, 0.2, 1],
			delay: i * 0.08,
		},
	}),
}

export default function Teaser() {
	const { teaser } = siteData
	const { count } = useEasterEggs()

	return (
		<section id="teaser" className="relative w-full px-6 py-32">
			<div className="mx-auto max-w-4xl text-center">
				<motion.h2
					initial="hidden"
					whileInView="show"
					viewport={{ once: true, margin: "-80px" }}
					variants={fadeUp}
					custom={0}
					className="text-mega font-display text-foreground"
				>
					{teaser.heading}
				</motion.h2>

				<motion.p
					initial="hidden"
					whileInView="show"
					viewport={{ once: true, margin: "-80px" }}
					variants={fadeUp}
					custom={1}
					className="text-muted-foreground mx-auto mt-6 max-w-xl font-mono text-sm"
				>
					a few clues, if you squint.
				</motion.p>

				<div className="mt-16 grid gap-4 text-left sm:grid-cols-2">
					{teaser.clues.map((clue, i) => {
						const Icon = CLUE_ICONS[i % CLUE_ICONS.length]
						return (
							<motion.div
								key={clue}
								initial="hidden"
								whileInView="show"
								viewport={{ once: true, margin: "-60px" }}
								variants={fadeUp}
								custom={i + 2}
							>
								<Card className="bg-card/60 hover:border-accent/60 h-full backdrop-blur transition-colors">
									<CardContent className="flex items-start gap-4 p-6">
										<span className="border-border text-accent mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border">
											<Icon className="h-4 w-4" />
										</span>
										<p className="text-foreground/80 font-mono text-sm">
											{clue}
										</p>
									</CardContent>
								</Card>
							</motion.div>
						)
					})}
				</div>

				<motion.p
					initial="hidden"
					whileInView="show"
					viewport={{ once: true, margin: "-80px" }}
					variants={fadeUp}
					custom={teaser.clues.length + 2}
					className="text-muted-foreground mt-10 font-mono text-xs tracking-wider uppercase"
				>
					you've found <span className="text-accent">{count}</span> /{" "}
					{TOTAL_EGGS} secrets
				</motion.p>
			</div>
		</section>
	)
}
