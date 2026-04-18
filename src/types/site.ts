export interface HeroCopy {
	name: string
	role: string
	tagline: string
	subtagline: string
	ctas: { label: string; href: string; kind: "primary" | "ghost" }[]
}

export interface AboutCopy {
	heading: string
	paragraphs: string[]
	funFacts: string[]
}

export interface ExperienceItem {
	company: string
	role: string
	location: string
	period: string
	bullets: string[]
	punchline: string
}

export interface ProjectItem {
	name: string
	tagline: string
	description: string
	tags: string[]
	href?: string
	status?: "shipped" | "in-progress" | "legacy"
}

export interface FooterCopy {
	bigWord: string
	kicker: string
	email: string
	socials: { label: string; href: string }[]
	signoff: string
}

export interface TerminalCommand {
	cmd: string
	response: string[]
}

export interface NotFoundCopy {
	heading: string
	body: string
	linkLabel: string
}

export interface SiteData {
	hero: HeroCopy
	about: AboutCopy
	experience: ExperienceItem[]
	skills: string[]
	projects: ProjectItem[]
	teaser: { heading: string; clues: string[] }
	footer: FooterCopy
	terminal: {
		greeting: string[]
		commands: TerminalCommand[]
		fallback: string
	}
	konami: { heading: string; body: string; badge: string }
	notFound: NotFoundCopy
}
