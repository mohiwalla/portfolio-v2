import * as React from "react"
import { Link } from "react-router"
import confetti from "canvas-confetti"
import { motion } from "framer-motion"
import siteData from "@/lib/site-data"
import { useEasterEggs } from "@/stores/easter-eggs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const ORBIT_ICONS = ["🕹️", "🎮", "♟️", "⌨️"] as const

export default function Konami() {
	const { markFound } = useEasterEggs()
	const firedRef = React.useRef(false)
	const rafRef = React.useRef<number | null>(null)

	React.useEffect(() => {
		if (firedRef.current) return
		firedRef.current = true

		rafRef.current = window.requestAnimationFrame(() => {
			void confetti({
				particleCount: 250,
				spread: 110,
				startVelocity: 55,
				colors: ["#ffc24d", "#ffffff", "#ffe8b3", "#ffb020"],
				origin: { y: 0.35 },
			})
			rafRef.current = null
		})

		markFound("konami")

		return () => {
			if (rafRef.current !== null) {
				window.cancelAnimationFrame(rafRef.current)
				rafRef.current = null
			}
		}
	}, [markFound])

	return (
		<div className="bg-background relative min-h-dvh overflow-hidden px-4 py-16">
			<div className="grain" />

			<div className="absolute top-6 left-6 z-10">
				<Link to="/">
					<Button variant="outline" size="sm">
						<span aria-hidden>←</span> home
					</Button>
				</Link>
			</div>

			<div className="relative mx-auto flex max-w-5xl flex-col items-center gap-8 pt-10 text-center">
				<motion.div
					initial={{ opacity: 0, y: 8 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
				>
					<Badge className="tracking-[0.2em] uppercase">
						{siteData.konami.badge}
					</Badge>
				</motion.div>

				<motion.h1
					initial={{ opacity: 0, y: 24 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{
						duration: 0.8,
						ease: [0.22, 1, 0.36, 1],
						delay: 0.05,
					}}
					className="text-giga font-display"
				>
					{siteData.konami.heading}
				</motion.h1>

				<motion.p
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 0.6, delay: 0.2 }}
					className="text-muted-foreground max-w-xl text-base md:text-lg"
				>
					{siteData.konami.body}
				</motion.p>

				<div className="relative mt-12 flex h-64 w-64 items-center justify-center">
					<div className="border-border/60 absolute inset-6 rounded-full border border-dashed" />
					<motion.div
						aria-hidden
						animate={{ rotate: 360 }}
						transition={{
							duration: 16,
							repeat: Infinity,
							ease: "linear",
						}}
						className="absolute inset-0"
					>
						{ORBIT_ICONS.map((icon, i) => {
							const angle = (i / ORBIT_ICONS.length) * 360
							return (
								<span
									key={icon}
									className="absolute top-1/2 left-1/2 block text-3xl leading-none"
									style={{
										marginLeft: "-0.75rem",
										marginTop: "-0.75rem",
										transform: `rotate(${angle}deg) translate(108px) rotate(${-angle}deg)`,
									}}
								>
									{icon}
								</span>
							)
						})}
					</motion.div>
				</div>
			</div>
		</div>
	)
}
