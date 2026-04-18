import { motion } from "framer-motion"
import siteData from "@/lib/site-data"
import { Separator } from "@/components/ui/separator"
import {
	FaBluesky,
	FaGithub,
	FaInstagram,
	FaTelegram,
	FaXTwitter,
} from "react-icons/fa6"
import { FiMail } from "react-icons/fi"
import type { IconType } from "react-icons"

function iconForSocial(label: string): IconType {
	const l = label.toLowerCase()
	if (l.includes("github")) return FaGithub
	if (l.includes("instagram")) return FaInstagram
	if (l === "x") return FaXTwitter
	if (l.includes("telegram")) return FaTelegram
	if (l.includes("bluesky")) return FaBluesky
	return FiMail
}

export default function Footer() {
	const { footer } = siteData
	const year = new Date().getFullYear()

	return (
		<footer
			id="footer"
			className="border-border relative overflow-hidden border-t px-6 pt-32 pb-10"
		>
			<div className="mx-auto max-w-7xl">
				<p className="text-muted-foreground font-mono text-sm">
					{footer.kicker}
				</p>

				<motion.h2
					initial={{ opacity: 0, scale: 0.8 }}
					whileInView={{ opacity: 1, scale: 1 }}
					viewport={{ once: true, margin: "-10%" }}
					transition={{ duration: 0.9, ease: "easeOut" }}
					className="from-foreground via-foreground/90 to-foreground/30 text-giga mt-8 w-full max-w-full bg-gradient-to-b bg-clip-text px-[0.02em] text-center leading-[0.84] tracking-[-0.075em] break-all text-transparent sm:break-normal sm:whitespace-nowrap"
				>
					{footer.bigWord}
				</motion.h2>

				<div className="mt-14 flex flex-col items-start justify-between gap-6 text-sm md:flex-row md:items-center">
					<a
						href={`mailto:${footer.email}`}
						className="text-foreground hover:text-accent inline-flex items-center gap-2 font-mono transition-colors"
					>
						<FiMail className="size-4 shrink-0" />
						{footer.email}
					</a>

					<ul className="flex flex-wrap items-center gap-3">
						{footer.socials.map(s => {
							const Icon = iconForSocial(s.label)
							const external = s.href.startsWith("http")
							return (
								<li key={s.label}>
									<a
										href={s.href}
										target={external ? "_blank" : undefined}
										rel={
											external ? "noreferrer" : undefined
										}
										aria-label={s.label}
										title={s.label}
										className="text-foreground/80 hover:text-accent inline-flex h-9 w-9 items-center justify-center rounded-full transition-colors"
									>
										<Icon className="size-5 shrink-0" />
									</a>
								</li>
							)
						})}
					</ul>

					<p className="text-muted-foreground max-w-sm md:text-right">
						{footer.signoff}
					</p>
				</div>

				<Separator className="mt-10" />

				<p className="text-muted-foreground mt-6 font-mono text-xs">
					© {year} mohiwalla. all rights reserved-ish.
				</p>
			</div>
		</footer>
	)
}
