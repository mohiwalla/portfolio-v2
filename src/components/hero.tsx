import { useEffect } from "react"
import { Link } from "react-router"
import {
	motion,
	useMotionValue,
	useSpring,
	useTransform,
	type Variants,
} from "framer-motion"
import { ArrowDown, ExternalLink, Mail, Terminal } from "lucide-react"
import siteData from "@/lib/site-data"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useGlobal } from "@/stores/global"

interface HeroProps {
	onNameClick?: () => void
}

const fadeUp: Variants = {
	hidden: { opacity: 0, y: 20 },
	show: {
		opacity: 1,
		y: 0,
		transition: { duration: 0.6, ease: "easeOut" },
	},
}

function ctaIcon(href: string) {
	if (href.startsWith("mailto:")) return <Mail />
	if (href.startsWith("http")) return <ExternalLink />
	if (href.startsWith("/terminal")) return <Terminal />
	return null
}

export default function Hero({ onNameClick }: HeroProps) {
	const { hero } = siteData
	const { openTerminalPanel } = useGlobal()
	const name = hero.name.toLowerCase()

	const mx = useMotionValue(0)
	const my = useMotionValue(0)
	const sx = useSpring(mx, { stiffness: 60, damping: 18, mass: 0.6 })
	const sy = useSpring(my, { stiffness: 60, damping: 18, mass: 0.6 })
	const fx = useTransform(sx, v => v * 20)
	const fy = useTransform(sy, v => v * 20)

	useEffect(() => {
		const onMove = (e: MouseEvent) => {
			const x = (e.clientX / window.innerWidth) * 2 - 1
			const y = (e.clientY / window.innerHeight) * 2 - 1
			mx.set(x)
			my.set(y)
		}
		window.addEventListener("mousemove", onMove)
		return () => window.removeEventListener("mousemove", onMove)
	}, [mx, my])

	return (
		<section className="relative flex min-h-screen w-full items-center justify-center overflow-hidden px-6">
			<motion.div
				aria-hidden
				style={{ x: fx, y: fy }}
				className="pointer-events-none absolute inset-0 flex items-center justify-center select-none"
			>
				<span className="font-display text-foreground/[0.04] text-[min(24vw,15rem)] leading-none break-all sm:break-normal sm:whitespace-nowrap">
					{name}
				</span>
			</motion.div>

			<div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center text-center">
				<motion.div
					initial={{ opacity: 0, y: -8 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, ease: "easeOut" }}
				>
					<Badge className="border-accent/30 bg-accent/10 text-accent mb-8">
						<span className="bg-accent mr-2 inline-block h-1.5 w-1.5 rounded-full" />
						{hero.role}
					</Badge>
				</motion.div>

				<motion.h1
					variants={fadeUp}
					initial="hidden"
					animate="show"
					transition={{ delay: 0.2 }}
					onClick={onNameClick}
					className="text-giga font-display text-foreground w-full max-w-full leading-[0.86] tracking-[-0.075em] break-all select-none sm:break-normal sm:whitespace-nowrap"
					aria-label={name}
				>
					{name}
				</motion.h1>

				<motion.p
					variants={fadeUp}
					initial="hidden"
					animate="show"
					transition={{ delay: 0.6 }}
					className="font-display text-foreground/80 mt-10 text-2xl md:text-4xl"
				>
					{hero.tagline}
				</motion.p>

				<motion.p
					variants={fadeUp}
					initial="hidden"
					animate="show"
					transition={{ delay: 0.75 }}
					className="text-muted-foreground mt-4 max-w-xl"
				>
					{hero.subtagline}
				</motion.p>

				<motion.div
					variants={fadeUp}
					initial="hidden"
					animate="show"
					transition={{ delay: 0.9 }}
					className="mt-10 flex flex-wrap items-center justify-center gap-3"
				>
					{hero.ctas.map(cta => {
						const variant =
							cta.kind === "primary" ? "accent" : "outline"
						const icon = ctaIcon(cta.href)
						const content = (
							<>
								{cta.label}
								{icon}
							</>
						)

						if (
							cta.href.startsWith("mailto:") ||
							cta.href.startsWith("http")
						) {
							return (
								<a
									key={cta.label}
									href={cta.href}
									target={
										cta.href.startsWith("http")
											? "_blank"
											: undefined
									}
									rel={
										cta.href.startsWith("http")
											? "noreferrer"
											: undefined
									}
								>
									<Button variant={variant} size="lg">
										{content}
									</Button>
								</a>
							)
						}

						if (cta.href === "/terminal") {
							return (
								<Button
									key={cta.label}
									variant={variant}
									size="lg"
									onClick={openTerminalPanel}
								>
									{content}
								</Button>
							)
						}

						if (cta.href.startsWith("/")) {
							return (
								<Link key={cta.label} to={cta.href}>
									<Button variant={variant} size="lg">
										{content}
									</Button>
								</Link>
							)
						}

						return (
							<Button key={cta.label} variant={variant} size="lg">
								{content}
							</Button>
						)
					})}
				</motion.div>
			</div>

			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ delay: 1.4, duration: 0.6 }}
				className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
			>
				<motion.div
					animate={{ y: [0, 8, 0] }}
					transition={{
						duration: 1.8,
						repeat: Infinity,
						ease: "easeInOut",
					}}
					className="text-muted-foreground flex flex-col items-center gap-2 font-mono text-xs tracking-widest uppercase"
				>
					<span>scroll</span>
					<ArrowDown className="h-4 w-4" />
				</motion.div>
			</motion.div>
		</section>
	)
}
