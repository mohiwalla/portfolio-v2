import { useCallback, useEffect, useRef, useState } from "react"
import { useLocation, useNavigate } from "react-router"
import { Command } from "cmdk"
import { AnimatePresence, motion } from "framer-motion"
import {
	Castle,
	Flame,
	Home,
	Mail,
	MousePointer2,
	Rocket,
	Search,
	Sparkles,
	TerminalSquare,
	User,
} from "lucide-react"
import { useGlobal } from "@/stores/global"
import { useEasterEggs } from "@/stores/easter-eggs"

const ROASTS: string[] = [
	"you still use tailwind v3?",
	"your useEffect deps array is a crime scene.",
	"nice semicolons. prettier weeps.",
	"zero tests. i admire the confidence.",
	"you named a variable `data2`. we need to talk.",
	"your bundle size has its own gravitational field.",
	"`any` in typescript is a lifestyle choice, huh?",
	"git commit -m 'stuff'. iconic.",
]

type SectionId = "hero" | "about" | "projects" | "contact"

function scrollToSection(id: string) {
	if (typeof window === "undefined") return
	const el = document.getElementById(id)
	if (!el) return
	el.scrollIntoView({ behavior: "smooth", block: "start" })
}

export default function CommandPalette() {
	const [open, setOpen] = useState(false)
	const [toast, setToast] = useState<string | null>(null)
	const toastTimer = useRef<number | null>(null)
	const navigate = useNavigate()
	const location = useLocation()
	const { toggleCursorTrail, openTerminalPanel } = useGlobal()
	const { markFound } = useEasterEggs()

	useEffect(() => {
		const onKey = (event: KeyboardEvent) => {
			if (
				(event.metaKey || event.ctrlKey) &&
				event.key.toLowerCase() === "k"
			) {
				event.preventDefault()
				setOpen(prev => !prev)
			} else if (event.key === "Escape") {
				setOpen(false)
			}
		}
		window.addEventListener("keydown", onKey)
		return () => window.removeEventListener("keydown", onKey)
	}, [])

	useEffect(() => {
		return () => {
			if (toastTimer.current !== null) {
				window.clearTimeout(toastTimer.current)
			}
		}
	}, [])

	const showToast = useCallback((msg: string) => {
		setToast(msg)
		if (toastTimer.current !== null) {
			window.clearTimeout(toastTimer.current)
		}
		toastTimer.current = window.setTimeout(() => {
			setToast(null)
			toastTimer.current = null
		}, 2500)
	}, [])

	const runNavigate = useCallback(
		(sectionId: SectionId) => {
			setOpen(false)
			if (location.pathname !== "/") {
				navigate(`/#${sectionId}`)
			} else {
				scrollToSection(sectionId)
			}
		},
		[location.pathname, navigate],
	)

	const handleChess = useCallback(() => {
		setOpen(false)
		navigate("/chess")
	}, [navigate])

	const handleTerminal = useCallback(() => {
		setOpen(false)
		openTerminalPanel()
	}, [openTerminalPanel])

	const handleCursorTrail = useCallback(() => {
		toggleCursorTrail()
		markFound("cmdk")
		setOpen(false)
		showToast("cursor trail toggled.")
	}, [markFound, showToast, toggleCursorTrail])

	const handleRoast = useCallback(() => {
		const line = ROASTS[Math.floor(Math.random() * ROASTS.length)]
		setOpen(false)
		showToast(line)
	}, [showToast])

	const handleContact = useCallback(() => {
		setOpen(false)
		window.location.href = "mailto:kamal@mohiwalla.com"
	}, [])

	return (
		<>
			<AnimatePresence>
				{open ? (
					<motion.div
						key="cmdk-overlay"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.15 }}
						className="bg-background/70 fixed inset-0 z-[100] flex items-start justify-center px-4 pt-[18vh] backdrop-blur-sm"
						onClick={() => setOpen(false)}
					>
						<motion.div
							initial={{ opacity: 0, y: -8, scale: 0.98 }}
							animate={{ opacity: 1, y: 0, scale: 1 }}
							exit={{ opacity: 0, y: -8, scale: 0.98 }}
							transition={{
								duration: 0.18,
								ease: [0.2, 0.8, 0.2, 1],
							}}
							onClick={e => e.stopPropagation()}
							className="w-full max-w-xl"
						>
							<Command
								label="command menu"
								className="border-border bg-card overflow-hidden rounded-xl border shadow-2xl"
							>
								<div className="border-border flex items-center gap-2 border-b px-3 py-2">
									<Search className="text-muted-foreground h-4 w-4" />
									<Command.Input
										autoFocus
										placeholder="type a command or search..."
										className="text-foreground placeholder:text-muted-foreground h-9 w-full bg-transparent font-mono text-sm focus:outline-none"
									/>
									<kbd className="text-muted-foreground hidden font-mono text-[10px] sm:inline">
										esc
									</kbd>
								</div>

								<Command.List className="max-h-[360px] overflow-y-auto p-1">
									<Command.Empty className="text-muted-foreground px-3 py-6 text-center font-mono text-sm">
										no results. make something up.
									</Command.Empty>

									<Command.Group
										heading="navigation"
										className="text-muted-foreground [&_[cmdk-group-heading]]:text-muted-foreground px-2 pt-2 pb-1 font-mono text-[10px] tracking-widest uppercase [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:pt-2 [&_[cmdk-group-heading]]:pb-1 [&_[cmdk-group-heading]]:font-mono [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:tracking-widest [&_[cmdk-group-heading]]:uppercase"
									>
										<PaletteItem
											icon={<Home className="h-4 w-4" />}
											label="home"
											hint="scroll to hero"
											onSelect={() => runNavigate("hero")}
										/>
										<PaletteItem
											icon={<User className="h-4 w-4" />}
											label="about"
											hint="scroll to about"
											onSelect={() =>
												runNavigate("about")
											}
										/>
										<PaletteItem
											icon={
												<Rocket className="h-4 w-4" />
											}
											label="projects"
											hint="scroll to projects"
											onSelect={() =>
												runNavigate("projects")
											}
										/>
										<PaletteItem
											icon={<Mail className="h-4 w-4" />}
											label="contact"
											hint="open email"
											onSelect={handleContact}
										/>
									</Command.Group>

									<Command.Group
										heading="easter eggs"
										className="[&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:pt-2 [&_[cmdk-group-heading]]:pb-1 [&_[cmdk-group-heading]]:font-mono [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:tracking-widest [&_[cmdk-group-heading]]:uppercase"
									>
										<PaletteItem
											icon={
												<Castle className="h-4 w-4" />
											}
											label="play chess"
											hint="/chess"
											onSelect={handleChess}
										/>
										<PaletteItem
											icon={
												<TerminalSquare className="h-4 w-4" />
											}
											label="open terminal"
											hint="/terminal"
											onSelect={handleTerminal}
										/>
										<PaletteItem
											icon={
												<MousePointer2 className="h-4 w-4" />
											}
											label="toggle cursor trail"
											hint="sparkles for your mouse"
											onSelect={handleCursorTrail}
										/>
										<PaletteItem
											icon={<Flame className="h-4 w-4" />}
											label="roast me"
											hint="brace yourself"
											onSelect={handleRoast}
										/>
									</Command.Group>
								</Command.List>

								<div className="border-border text-muted-foreground flex items-center justify-between border-t px-3 py-2 font-mono text-[10px]">
									<span className="inline-flex items-center gap-1">
										<Sparkles className="h-3 w-3" />
										mohiwalla
									</span>
									<span>⌘K to close</span>
								</div>
							</Command>
						</motion.div>
					</motion.div>
				) : null}
			</AnimatePresence>

			<AnimatePresence>
				{toast ? (
					<motion.div
						key="cmdk-toast"
						initial={{ opacity: 0, y: 16 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: 16 }}
						transition={{ duration: 0.2 }}
						className="fixed bottom-8 left-1/2 z-120 -translate-x-1/2"
					>
						<div className="border-border bg-card text-foreground rounded-full border px-4 py-2 font-mono text-xs shadow-xl">
							{toast}
						</div>
					</motion.div>
				) : null}
			</AnimatePresence>
		</>
	)
}

interface PaletteItemProps {
	icon: React.ReactNode
	label: string
	hint?: string
	onSelect: () => void
}

function PaletteItem({ icon, label, hint, onSelect }: PaletteItemProps) {
	return (
		<Command.Item
			onSelect={onSelect}
			className="text-foreground/80 aria-selected:bg-secondary aria-selected:text-foreground data-[selected=true]:bg-secondary data-[selected=true]:text-foreground flex cursor-pointer items-center gap-3 rounded-md px-3 py-2 font-mono text-sm"
		>
			<span className="text-muted-foreground">{icon}</span>
			<span className="flex-1">{label}</span>
			{hint ? (
				<span className="text-muted-foreground text-[10px] tracking-wider uppercase">
					{hint}
				</span>
			) : null}
		</Command.Item>
	)
}
