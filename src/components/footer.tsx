import { motion } from "framer-motion"
import { Mail, ExternalLink } from "lucide-react"
import type { ComponentType, SVGProps } from "react"
import siteData from "@/lib/site-data"
import { Separator } from "@/components/ui/separator"

type IconComponent = ComponentType<SVGProps<SVGSVGElement>>

const GithubIcon: IconComponent = props => (
	<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
		<path
			fillRule="evenodd"
			clipRule="evenodd"
			d="M12 1.5C6.2 1.5 1.5 6.2 1.5 12c0 4.64 3.01 8.58 7.18 9.97.53.1.72-.23.72-.51 0-.25-.01-.92-.01-1.8-2.92.63-3.54-1.41-3.54-1.41-.48-1.22-1.17-1.55-1.17-1.55-.95-.65.07-.64.07-.64 1.06.07 1.62 1.09 1.62 1.09.94 1.61 2.47 1.15 3.07.88.1-.68.37-1.15.67-1.42-2.33-.27-4.78-1.17-4.78-5.19 0-1.14.41-2.08 1.08-2.82-.11-.26-.47-1.33.1-2.78 0 0 .88-.28 2.88 1.08a10 10 0 0 1 5.24 0c2-1.36 2.88-1.08 2.88-1.08.58 1.45.21 2.52.1 2.78.68.74 1.08 1.68 1.08 2.82 0 4.03-2.46 4.92-4.8 5.18.38.32.72.96.72 1.94 0 1.4-.01 2.53-.01 2.88 0 .28.19.62.73.51A10.5 10.5 0 0 0 22.5 12C22.5 6.2 17.8 1.5 12 1.5Z"
		/>
	</svg>
)

function iconForSocial(label: string, href: string): IconComponent {
	const l = label.toLowerCase()
	if (l.includes("github")) return GithubIcon
	if (l.includes("mail") || l.includes("email") || href.startsWith("mailto:"))
		return Mail
	return ExternalLink
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
					className="from-foreground to-foreground/30 font-display text-giga mt-8 w-full bg-gradient-to-b bg-clip-text text-center leading-none tracking-tight text-transparent"
				>
					{footer.bigWord}
				</motion.h2>

				<div className="mt-14 flex flex-col items-start justify-between gap-6 text-sm md:flex-row md:items-center">
					<a
						href={`mailto:${footer.email}`}
						className="text-foreground hover:text-accent inline-flex items-center gap-2 font-mono transition-colors"
					>
						<Mail className="h-4 w-4" />
						{footer.email}
					</a>

					<ul className="flex flex-wrap items-center gap-5">
						{footer.socials.map(s => {
							const Icon = iconForSocial(s.label, s.href)
							const external = s.href.startsWith("http")
							return (
								<li key={s.label}>
									<a
										href={s.href}
										target={external ? "_blank" : undefined}
										rel={
											external ? "noreferrer" : undefined
										}
										className="text-foreground/80 hover:text-accent inline-flex items-center gap-2 font-mono transition-colors"
									>
										<Icon className="h-4 w-4" />
										{s.label}
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
