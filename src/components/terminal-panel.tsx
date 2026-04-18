import { ChevronDown, ChevronUp, TerminalSquare } from "lucide-react";
import TerminalShell from "@/components/terminal-shell";
import { useGlobal } from "@/stores/global";

const PANEL_HEIGHT = "min(52vh, 30rem)";

export const TERMINAL_PANEL_HEIGHT = PANEL_HEIGHT;
export const TERMINAL_PANEL_COLLAPSED_HEIGHT = "0px";

export default function TerminalPanel() {
    const {
        terminalPanelOpen,
        terminalFocusToken,
        toggleTerminalPanel,
        openTerminalPanel,
    } = useGlobal();

    return (
        <div className="pointer-events-none fixed inset-x-0 bottom-0 z-[95] px-2 pb-2 sm:px-4 sm:pb-4">
            <div
                className="pointer-events-auto mx-auto flex h-[min(52vh,30rem)] w-full max-w-[120rem] flex-col overflow-hidden rounded-t-2xl border border-border bg-card/95 shadow-[0_-24px_60px_rgba(0,0,0,0.4)] backdrop-blur transition-transform duration-300 ease-out"
                style={{
                    transform: terminalPanelOpen
                        ? "translateY(0)"
                        : "translateY(calc(100% + 1rem))",
                }}
            >
                <button
                    type="button"
                    onClick={terminalPanelOpen ? toggleTerminalPanel : openTerminalPanel}
                    aria-expanded={terminalPanelOpen}
                    className="flex h-12 w-full items-center justify-between border-b border-border/80 bg-secondary/70 px-4 text-left transition-colors hover:bg-secondary/90"
                >
                    <span className="flex items-center gap-3">
                        <span className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.24em] text-foreground">
                            <TerminalSquare className="h-4 w-4 text-accent" />
                            terminal
                        </span>
                        <span className="hidden font-mono text-[11px] text-muted-foreground sm:inline">
                            mohiwalla@portfolio
                        </span>
                    </span>

                    <span className="flex items-center gap-3">
                        {terminalPanelOpen ? (
                            <ChevronDown className="h-4 w-4 text-muted-foreground" />
                        ) : (
                            <ChevronUp className="h-4 w-4 text-muted-foreground" />
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
    );
}
