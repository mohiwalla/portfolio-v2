import * as React from "react"
import { ChevronDown, ChevronUp, TerminalSquare } from "lucide-react"
import TerminalShell from "@/components/terminal-shell"
import { useGlobal } from "@/stores/global"

const DEFAULT_PANEL_HEIGHT = "40vh"
const PANEL_HEIGHT = "var(--terminal-panel-height, 40vh)"
const MIN_PANEL_HEIGHT = 180

export const TERMINAL_PANEL_HEIGHT = PANEL_HEIGHT
export const TERMINAL_PANEL_COLLAPSED_HEIGHT = "0px"

export default function TerminalPanel() {
	const {
		terminalPanelOpen,
		terminalFocusToken,
		toggleTerminalPanel,
		openTerminalPanel,
	} = useGlobal()
	const panelRef = React.useRef<HTMLDivElement>(null)
	const customHeightRef = React.useRef<number | null>(null)

	React.useEffect(() => {
		const nextHeight =
			customHeightRef.current === null
				? DEFAULT_PANEL_HEIGHT
				: `${customHeightRef.current}px`
		document.documentElement.style.setProperty(
			"--terminal-panel-height",
			nextHeight,
		)

		return () => {
			document.documentElement.style.setProperty(
				"--terminal-panel-height",
				DEFAULT_PANEL_HEIGHT,
			)
		}
	}, [])

	const handleResizeStart = React.useCallback(
		(event: React.PointerEvent<HTMLElement>) => {
			if (!terminalPanelOpen) return

			event.preventDefault()

			const startY = event.clientY
			const startHeight =
				panelRef.current?.getBoundingClientRect().height ??
				window.innerHeight * 0.4
			const maxHeight = Math.max(
				MIN_PANEL_HEIGHT,
				Math.floor(window.innerHeight * 0.8),
			)

			document.body.style.userSelect = "none"
			document.body.style.cursor = "ns-resize"

			const handlePointerMove = (moveEvent: PointerEvent) => {
				const delta = startY - moveEvent.clientY
				const nextHeight = Math.min(
					maxHeight,
					Math.max(MIN_PANEL_HEIGHT, Math.round(startHeight + delta)),
				)
				customHeightRef.current = nextHeight
				document.documentElement.style.setProperty(
					"--terminal-panel-height",
					`${nextHeight}px`,
				)
			}

			const handlePointerEnd = () => {
				document.body.style.removeProperty("user-select")
				document.body.style.removeProperty("cursor")
				window.removeEventListener("pointermove", handlePointerMove)
				window.removeEventListener("pointerup", handlePointerEnd)
				window.removeEventListener("pointercancel", handlePointerEnd)
			}

			window.addEventListener("pointermove", handlePointerMove)
			window.addEventListener("pointerup", handlePointerEnd)
			window.addEventListener("pointercancel", handlePointerEnd)
		},
		[terminalPanelOpen],
	)

	return (
		<div className="pointer-events-none fixed inset-x-0 bottom-0 z-95 px-2 sm:px-4">
			<div
				ref={panelRef}
				aria-hidden={!terminalPanelOpen}
				className="border-border bg-card/95 mx-auto flex w-full max-w-480 flex-col overflow-hidden rounded-t-2xl border shadow-[0_-24px_60px_rgba(0,0,0,0.4)] backdrop-blur transition-transform"
				style={{
					height: PANEL_HEIGHT,
					transform: terminalPanelOpen
						? "translateY(0)"
						: "translateY(calc(100% + 1rem))",
					transitionDuration: "250ms",
					transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
					pointerEvents: terminalPanelOpen ? "auto" : "none",
				}}
			>
				<div className="border-border/80 bg-secondary/70 relative flex h-9 items-center justify-between border-b px-3.5 pt-1">
					<div
						aria-hidden
						onPointerDown={handleResizeStart}
						className="absolute inset-x-0 top-0 h-3.5 cursor-ns-resize"
					/>
					<span className="flex items-center gap-2.5">
						<span className="text-foreground flex items-center gap-2 font-mono text-[11px] tracking-[0.22em] uppercase">
							<TerminalSquare className="text-accent h-3.5 w-3.5" />
							terminal
						</span>
						<span className="text-muted-foreground hidden font-mono text-[11px] sm:inline">
							mohiwalla@portfolio
						</span>
					</span>

					<button
						type="button"
						onClick={
							terminalPanelOpen
								? toggleTerminalPanel
								: openTerminalPanel
						}
						aria-expanded={terminalPanelOpen}
						aria-label={
							terminalPanelOpen
								? "collapse terminal"
								: "open terminal"
						}
						className="text-muted-foreground hover:text-foreground relative z-10 inline-flex h-6 w-6 items-center justify-center transition-colors"
					>
						{terminalPanelOpen ? (
							<ChevronDown className="h-4 w-4" />
						) : (
							<ChevronUp className="h-4 w-4" />
						)}
					</button>
				</div>

				<div className="min-h-0 flex-1">
					<TerminalShell
						isOpen={terminalPanelOpen}
						focusToken={terminalFocusToken}
					/>
				</div>
			</div>
		</div>
	)
}
