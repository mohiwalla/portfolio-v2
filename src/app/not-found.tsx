import { Link } from "react-router"
import { motion } from "framer-motion"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import siteData from "@/lib/site-data"

function Pawn() {
	return (
		<svg
			viewBox="0 0 64 96"
			className="text-accent size-40 drop-shadow-[0_12px_40px_var(--color-accent-glow)]"
			aria-hidden
		>
			<path
				fill="currentColor"
				d="M32 6a12 12 0 0 0-8.8 20.2c-4.2 2.6-7 7.3-7 12.6 0 4.6 2.1 8.7 5.4 11.4L16 74h32l-5.6-23.8c3.3-2.7 5.4-6.8 5.4-11.4 0-5.3-2.8-10-7-12.6A12 12 0 0 0 32 6zM10 80h44a4 4 0 0 1 4 4v4H6v-4a4 4 0 0 1 4-4z"
			/>
		</svg>
	)
}

export default function NotFound() {
	const { notFound } = siteData

	return (
		<main className="bg-background relative flex min-h-screen w-full items-center justify-center overflow-hidden px-6">
			<div className="grain" aria-hidden />

			<div className="relative z-10 mx-auto flex w-full max-w-3xl flex-col items-center text-center">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, ease: "easeOut" }}
				>
					<motion.div
						animate={{ y: [0, -10, 0] }}
						transition={{
							duration: 3.2,
							repeat: Infinity,
							ease: "easeInOut",
						}}
					>
						<Pawn />
					</motion.div>
				</motion.div>

				<motion.h1
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{
						duration: 0.65,
						ease: [0.2, 0.8, 0.2, 1],
						delay: 0.1,
					}}
					className="text-mega font-display text-accent"
				>
					{notFound.heading}
				</motion.h1>

				<motion.p
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.25 }}
					className="text-muted-foreground mt-8 max-w-xl font-mono text-sm"
				>
					{notFound.body}
				</motion.p>

				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.4 }}
					className="mt-10"
				>
					<Link to="/">
						<Button variant="accent" size="lg">
							<ArrowLeft />
							{notFound.linkLabel}
						</Button>
					</Link>
				</motion.div>

				<motion.p
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 0.8, delay: 0.7 }}
					className="text-muted-foreground/70 mt-12 font-mono text-[11px] tracking-[0.3em] uppercase"
				>
					404 · off the board
				</motion.p>
			</div>
		</main>
	)
}
