import * as React from "react"
import {
	ChevronDown,
	ChevronUp,
	GripHorizontal,
	TerminalSquare,
} from "lucide-react"
import TerminalShell from "@/components/terminal-shell"
import { useGlobal } from "@/stores/global"

const DEFAULT_PANEL_HEIGHT = "32vh"
const PANEL_HEIGHT = "var(--terminal-panel-height, 32vh)"
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
	const [customHeight, setCustomHeight] = React.useState<number | null>(null)

	React.useEffect(() => {
		const nextHeight =
			customHeight === null ? DEFAULT_PANEL_HEIGHT : `${customHeight}px`
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
	}, [customHeight])

	const handleResizeStart = React.useCallback(
		(event: React.PointerEvent<HTMLButtonElement>) => {
			if (!terminalPanelOpen) return

			event.preventDefault()

			const startY = event.clientY
			const startHeight =
				panelRef.current?.getBoundingClientRect().height ??
				window.innerHeight * 0.32
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
				setCustomHeight(nextHeight)
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
		<div className="fixed inset-x-0 bottom-0 z-95 px-2 pb-2 sm:px-4 sm:pb-4">
			<div
				ref={panelRef}
				className="border-border bg-card/95 mx-auto flex w-full max-w-480 flex-col overflow-hidden rounded-t-2xl border shadow-[0_-24px_60px_rgba(0,0,0,0.4)] backdrop-blur transition-transform duration-150 ease-out"
				style={{
					height: PANEL_HEIGHT,
					transform: terminalPanelOpen
						? "translateY(0)"
						: "translateY(calc(100% + 1rem))",
				}}
			>
				<div className="border-border/70 bg-card/90 flex h-5 items-center justify-center border-b">
					<button
						type="button"
						aria-label="resize terminal"
						onPointerDown={handleResizeStart}
						className="text-muted-foreground hover:text-foreground inline-flex h-4 w-16 cursor-ns-resize items-center justify-center transition-colors"
					>
						<GripHorizontal className="h-3.5 w-3.5" />
					</button>
				</div>
				<button
					type="button"
					onClick={
						terminalPanelOpen
							? toggleTerminalPanel
							: openTerminalPanel
					}
					aria-expanded={terminalPanelOpen}
					className="border-border/80 bg-secondary/70 hover:bg-secondary/90 flex h-10 w-full items-center justify-between border-b px-3.5 text-left transition-colors"
				>
					<span className="flex items-center gap-2.5">
						<span className="text-foreground flex items-center gap-2 font-mono text-[11px] tracking-[0.22em] uppercase">
							<TerminalSquare className="text-accent h-3.5 w-3.5" />
							terminal
						</span>
						<span className="text-muted-foreground hidden font-mono text-[11px] sm:inline">
							mohiwalla@portfolio
						</span>
					</span>

					<span className="flex items-center gap-3">
						{terminalPanelOpen ? (
							<ChevronDown className="text-muted-foreground h-4 w-4" />
						) : (
							<ChevronUp className="text-muted-foreground h-4 w-4" />
						)}
					</span>
				</button>

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
