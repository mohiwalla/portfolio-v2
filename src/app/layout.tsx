import { useCallback, useEffect, useRef, useState } from "react"
import { Link, Outlet, useLocation, useNavigate } from "react-router"
import { AnimatePresence, motion } from "framer-motion"
import confetti from "canvas-confetti"
import CommandPalette from "@/components/command-palette"
import CursorTrail from "@/components/cursor-trail"
import TerminalPanel, {
	TERMINAL_PANEL_COLLAPSED_HEIGHT,
	TERMINAL_PANEL_HEIGHT,
} from "@/components/terminal-panel"
import { EasterEggProvider, useEasterEggs } from "@/stores/easter-eggs"
import { GlobalProvider, useGlobal } from "@/stores/global"
import { createKonamiDetector } from "@/lib/konami"
import { createTypedTrigger } from "@/lib/typed-trigger"

function fireKonamiConfetti() {
	if (typeof window === "undefined") return
	confetti({
		particleCount: 180,
		spread: 90,
		startVelocity: 50,
		origin: { y: 0.7 },
		colors: ["#FFFFFF", "#FCEABB", "#F8B400", "#F59E0B", "#FDE68A"],
	})
}

function LayoutShell() {
	const navigate = useNavigate()
	const location = useLocation()
	const {
		toggleCursorTrail,
		markKonamiUnlocked,
		terminalPanelOpen,
		toggleTerminalPanel,
	} = useGlobal()
	const { markFound } = useEasterEggs()

	const [toast, setToast] = useState<string | null>(null)
	const toastTimer = useRef<number | null>(null)

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

	useEffect(() => {
		return () => {
			if (toastTimer.current !== null) {
				window.clearTimeout(toastTimer.current)
			}
		}
	}, [])

	useEffect(() => {
		const konami = createKonamiDetector(() => {
			markKonamiUnlocked()
			markFound("konami")
			fireKonamiConfetti()
			navigate("/konami")
		})

		const typed = createTypedTrigger("mohiwalla", () => {
			toggleCursorTrail()
			markFound("type-mohiwalla")
			showToast("cursor trail toggled.")
		})

		window.addEventListener("keydown", konami)
		window.addEventListener("keydown", typed)
		return () => {
			window.removeEventListener("keydown", konami)
			window.removeEventListener("keydown", typed)
		}
	}, [markFound, markKonamiUnlocked, navigate, showToast, toggleCursorTrail])

	useEffect(() => {
		const handleTerminalToggle = (event: KeyboardEvent) => {
			if (
				(event.metaKey || event.ctrlKey) &&
				event.key.toLowerCase() === "j"
			) {
				event.preventDefault()
				toggleTerminalPanel()
			}
		}

		window.addEventListener("keydown", handleTerminalToggle, {
			capture: true,
		})
		return () => {
			window.removeEventListener("keydown", handleTerminalToggle, {
				capture: true,
			})
		}
	}, [toggleTerminalPanel])

	useEffect(() => {
		if (location.pathname !== "/") return
		const handleHash = () => {
			const id = window.location.hash.replace("#", "")
			if (!id) return
			const el = document.getElementById(id)
			if (!el) return
			el.scrollIntoView({ behavior: "smooth", block: "start" })
		}
		handleHash()
		window.addEventListener("hashchange", handleHash)
		return () => window.removeEventListener("hashchange", handleHash)
	}, [location.pathname, location.hash])

	return (
		<div
			className="bg-background text-foreground relative min-h-screen transition-[padding] duration-300"
			style={{
				paddingBottom: terminalPanelOpen
					? TERMINAL_PANEL_HEIGHT
					: TERMINAL_PANEL_COLLAPSED_HEIGHT,
			}}
		>
			<CursorTrail />
			<CommandPalette />

			<Link
				to="/"
				className="text-foreground/80 hover:text-accent fixed top-4 left-4 z-40 font-mono text-xs tracking-wider transition-colors sm:top-6 sm:left-6"
			>
				mohiwalla
			</Link>

			<Outlet />
			<TerminalPanel />

			<AnimatePresence>
				{toast ? (
					<motion.div
						key="layout-toast"
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
		</div>
	)
}

export default function Layout() {
	return (
		<GlobalProvider>
			<EasterEggProvider>
				<LayoutShell />
			</EasterEggProvider>
		</GlobalProvider>
	)
}
