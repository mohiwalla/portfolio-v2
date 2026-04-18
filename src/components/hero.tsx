import { type PointerEvent } from "react"
import { Link } from "react-router"
import {
	motion,
	useMotionValue,
	useReducedMotion,
	useSpring,
	useTransform,
	type MotionValue,
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

const backdropLines = [
	{ top: "24%", left: "14%", width: "26%", rotate: 12 },
	{ top: "31%", left: "56%", width: "20%", rotate: -22 },
	{ top: "54%", left: "12%", width: "18%", rotate: -34 },
	{ top: "64%", left: "58%", width: "24%", rotate: 18 },
	{ top: "76%", left: "28%", width: "30%", rotate: -8 },
]

const backdropNodes = [
	{ top: "20%", left: "22%", size: 14, delay: 0.1 },
	{ top: "28%", left: "70%", size: 12, delay: 0.6 },
	{ top: "44%", left: "16%", size: 10, delay: 0.9 },
	{ top: "58%", left: "78%", size: 14, delay: 0.3 },
	{ top: "72%", left: "30%", size: 12, delay: 0.7 },
	{ top: "80%", left: "62%", size: 10, delay: 1.1 },
]

interface HeroBackdropProps {
	sx: MotionValue<number>
	sy: MotionValue<number>
	reducedMotion: boolean
}

function HeroBackdrop({ sx, sy, reducedMotion }: HeroBackdropProps) {
	const driftSlowX = useTransform(sx, value => value * 18)
	const driftSlowY = useTransform(sy, value => value * 12)
	const driftMidX = useTransform(sx, value => value * -30)
	const driftMidY = useTransform(sy, value => value * 22)
	const driftFastX = useTransform(sx, value => value * 42)
	const driftFastY = useTransform(sy, value => value * -28)
	const glowX = useTransform(sx, value => value * 96)
	const glowY = useTransform(sy, value => value * 72)

	return (
		<div
			aria-hidden
			className="pointer-events-none absolute inset-0 overflow-hidden"
		>
			<div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,196,92,0.16),transparent_34%),radial-gradient(circle_at_18%_30%,rgba(255,255,255,0.08),transparent_20%),radial-gradient(circle_at_82%_18%,rgba(255,196,92,0.12),transparent_24%),linear-gradient(180deg,rgba(255,255,255,0.04),transparent_34%,rgba(0,0,0,0.45))]" />

			<div
				className="absolute inset-0 opacity-40"
				style={{
					backgroundImage:
						"linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)",
					backgroundSize: "140px 140px",
					maskImage:
						"radial-gradient(circle at center, black 24%, transparent 78%)",
				}}
			/>

			<motion.div
				style={{ x: glowX, y: glowY }}
				className="absolute top-1/2 left-1/2 h-[30rem] w-[30rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,196,92,0.3),rgba(255,196,92,0.12)_34%,transparent_70%)] blur-3xl"
			/>

			<motion.div
				style={{ x: driftSlowX, y: driftSlowY }}
				className="absolute inset-0"
			>
				{backdropLines.map((line, index) => (
					<div
						key={`${line.top}-${line.left}-${index}`}
						className="absolute h-px rounded-full bg-gradient-to-r from-transparent via-white/22 to-transparent"
						style={{
							top: line.top,
							left: line.left,
							width: line.width,
							transform: `rotate(${line.rotate}deg)`,
							transformOrigin: "left center",
						}}
					/>
				))}
			</motion.div>

			<motion.div
				style={{ x: driftMidX, y: driftMidY }}
				className="absolute inset-0"
			>
				{backdropNodes.map(node => (
					<motion.div
						key={`${node.top}-${node.left}`}
						animate={
							reducedMotion
								? undefined
								: {
										y: [0, -10, 0],
										opacity: [0.65, 1, 0.65],
									}
						}
						transition={{
							duration: 5.5,
							repeat: Infinity,
							delay: node.delay,
							ease: "easeInOut",
						}}
						className="bg-background/30 absolute rounded-full border border-white/12 shadow-[0_0_40px_rgba(255,255,255,0.05)] backdrop-blur-sm"
						style={{
							top: node.top,
							left: node.left,
							width: node.size,
							height: node.size,
							marginLeft: -node.size / 2,
							marginTop: -node.size / 2,
						}}
					>
						<span className="bg-accent/80 absolute inset-[26%] rounded-full shadow-[0_0_18px_rgba(255,196,92,0.7)]" />
					</motion.div>
				))}
			</motion.div>

			<motion.div
				style={{ x: driftFastX, y: driftFastY }}
				className="absolute top-1/2 left-1/2 h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2"
			>
				<motion.div
					animate={reducedMotion ? undefined : { rotate: 360 }}
					transition={{
						duration: 34,
						repeat: Infinity,
						ease: "linear",
					}}
					className="absolute inset-0 rounded-full border border-white/8"
				/>

				<motion.div
					animate={reducedMotion ? undefined : { rotate: -360 }}
					transition={{
						duration: 24,
						repeat: Infinity,
						ease: "linear",
					}}
					className="border-accent/25 absolute inset-[10%] rounded-full border border-dashed"
				/>

				<div className="absolute top-0 left-1/2 h-full w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-white/20 to-transparent" />
				<div className="absolute top-1/2 left-0 h-px w-full -translate-y-1/2 bg-gradient-to-r from-transparent via-white/20 to-transparent" />

				<div className="absolute inset-[24%] rounded-full border border-white/10 bg-[radial-gradient(circle,rgba(255,255,255,0.08),rgba(255,196,92,0.08)_38%,transparent_72%)] shadow-[inset_0_0_60px_rgba(255,255,255,0.06)]" />
				<div className="border-accent/30 absolute inset-[34%] rounded-full border bg-[radial-gradient(circle,rgba(255,196,92,0.24),transparent_78%)] shadow-[0_0_50px_rgba(255,196,92,0.16)]" />
			</motion.div>

			<div className="grain" />
		</div>
	)
}

export default function Hero({ onNameClick }: HeroProps) {
	const { hero } = siteData
	const { openTerminalPanel } = useGlobal()
	const name = hero.name.toLowerCase()
	const reducedMotion = useReducedMotion()

	const mx = useMotionValue(0)
	const my = useMotionValue(0)
	const sx = useSpring(mx, { stiffness: 60, damping: 18, mass: 0.6 })
	const sy = useSpring(my, { stiffness: 60, damping: 18, mass: 0.6 })

	const handlePointerMove = (event: PointerEvent<HTMLElement>) => {
		const rect = event.currentTarget.getBoundingClientRect()
		const x = ((event.clientX - rect.left) / rect.width) * 2 - 1
		const y = ((event.clientY - rect.top) / rect.height) * 2 - 1
		mx.set(x)
		my.set(y)
	}

	const handlePointerLeave = () => {
		mx.set(0)
		my.set(0)
	}

	return (
		<section
			className="relative flex min-h-screen w-full items-center justify-center overflow-hidden px-6"
			onPointerMove={handlePointerMove}
			onPointerLeave={handlePointerLeave}
		>
			<HeroBackdrop sx={sx} sy={sy} reducedMotion={!!reducedMotion} />

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
