import { useEffect, useMemo } from "react"
import { Link } from "react-router"
import { TerminalSquare } from "lucide-react"
import { useGlobal } from "@/stores/global"

export default function Terminal() {
	const { openTerminalPanel } = useGlobal()
	const shortcutLabel = useMemo(() => {
		if (typeof navigator === "undefined") return "Ctrl+J"
		return /Mac|iPhone|iPad|iPod/.test(navigator.platform)
			? "Cmd+J"
			: "Ctrl+J"
	}, [])

	useEffect(() => {
		openTerminalPanel()
	}, [openTerminalPanel])

	return (
		<div className="bg-background relative min-h-dvh overflow-hidden px-4 py-16">
			<div className="scanlines pointer-events-none absolute inset-0" />

			<div className="absolute top-6 left-6 z-10">
				<Link
					to="/"
					className="text-muted-foreground hover:text-foreground inline-flex items-center gap-2 font-mono text-sm transition-colors"
				>
					<span aria-hidden>←</span> home
				</Link>
			</div>

			<div className="relative mx-auto mt-12 max-w-3xl">
				<div className="border-border bg-card/60 rounded-3xl border p-8 shadow-2xl backdrop-blur">
					<div className="text-accent mb-6 flex items-center gap-3">
						<TerminalSquare className="h-5 w-5" />
						<p className="font-mono text-xs tracking-[0.28em] uppercase">
							global terminal dock
						</p>
					</div>

					<h1 className="font-display text-foreground text-5xl sm:text-6xl">
						terminal is docked below.
					</h1>

					<p className="text-muted-foreground mt-5 max-w-2xl text-base">
						The shared xterm panel is now available on every page in
						a bottom dock. Use{" "}
						<span className="text-foreground font-mono">
							{shortcutLabel}
						</span>{" "}
						to toggle it from anywhere.
					</p>

					<div className="mt-8 flex flex-wrap gap-3">
						<button
							type="button"
							onClick={openTerminalPanel}
							className="border-accent/40 bg-accent/10 text-accent hover:bg-accent/20 inline-flex items-center rounded-full border px-4 py-2 font-mono text-sm transition-colors"
						>
							refocus terminal
						</button>
						<Link
							to="/"
							className="border-border text-muted-foreground hover:text-foreground inline-flex items-center rounded-full border px-4 py-2 font-mono text-sm transition-colors"
						>
							back to home
						</Link>
					</div>
				</div>
			</div>
		</div>
	)
}
