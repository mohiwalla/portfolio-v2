import { ChevronDown, ChevronUp, TerminalSquare } from "lucide-react"
import TerminalShell from "@/components/terminal-shell"
import { useGlobal } from "@/stores/global"

const PANEL_HEIGHT = "min(52vh, 30rem)"

export const TERMINAL_PANEL_HEIGHT = PANEL_HEIGHT
export const TERMINAL_PANEL_COLLAPSED_HEIGHT = "0px"

export default function TerminalPanel() {
	const {
		terminalPanelOpen,
		terminalFocusToken,
		toggleTerminalPanel,
		openTerminalPanel,
	} = useGlobal()

	return (
		<div className="pointer-events-none fixed inset-x-0 bottom-0 z-[95] px-2 pb-2 sm:px-4 sm:pb-4">
			<div
				className="border-border bg-card/95 pointer-events-auto mx-auto flex h-[min(52vh,30rem)] w-full max-w-[120rem] flex-col overflow-hidden rounded-t-2xl border shadow-[0_-24px_60px_rgba(0,0,0,0.4)] backdrop-blur transition-transform duration-300 ease-out"
				style={{
					transform: terminalPanelOpen
						? "translateY(0)"
						: "translateY(calc(100% + 1rem))",
				}}
			>
				<button
					type="button"
					onClick={
						terminalPanelOpen
							? toggleTerminalPanel
							: openTerminalPanel
					}
					aria-expanded={terminalPanelOpen}
					className="border-border/80 bg-secondary/70 hover:bg-secondary/90 flex h-12 w-full items-center justify-between border-b px-4 text-left transition-colors"
				>
					<span className="flex items-center gap-3">
						<span className="text-foreground flex items-center gap-2 font-mono text-xs tracking-[0.24em] uppercase">
							<TerminalSquare className="text-accent h-4 w-4" />
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
