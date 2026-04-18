import { useEffect, useMemo } from "react";
import { Link } from "react-router";
import { TerminalSquare } from "lucide-react";
import { useGlobal } from "@/stores/global";

export default function Terminal() {
    const { openTerminalPanel } = useGlobal();
    const shortcutLabel = useMemo(() => {
        if (typeof navigator === "undefined") return "Ctrl+J";
        return /Mac|iPhone|iPad|iPod/.test(navigator.platform)
            ? "Cmd+J"
            : "Ctrl+J";
    }, []);

    useEffect(() => {
        openTerminalPanel();
    }, [openTerminalPanel]);

    return (
        <div className="relative min-h-dvh overflow-hidden bg-background px-4 py-16">
            <div className="scanlines pointer-events-none absolute inset-0" />

            <div className="absolute left-6 top-6 z-10">
                <Link
                    to="/"
                    className="inline-flex items-center gap-2 font-mono text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                    <span aria-hidden>←</span> home
                </Link>
            </div>

            <div className="relative mx-auto mt-12 max-w-3xl">
                <div className="rounded-3xl border border-border bg-card/60 p-8 shadow-2xl backdrop-blur">
                    <div className="mb-6 flex items-center gap-3 text-accent">
                        <TerminalSquare className="h-5 w-5" />
                        <p className="font-mono text-xs uppercase tracking-[0.28em]">
                            global terminal dock
                        </p>
                    </div>

                    <h1 className="font-display text-5xl text-foreground sm:text-6xl">
                        terminal is docked below.
                    </h1>

                    <p className="mt-5 max-w-2xl text-base text-muted-foreground">
                        The shared xterm panel is now available on every page in
                        a bottom dock. Use <span className="font-mono text-foreground">{shortcutLabel}</span> to
                        toggle it from anywhere.
                    </p>

                    <div className="mt-8 flex flex-wrap gap-3">
                        <button
                            type="button"
                            onClick={openTerminalPanel}
                            className="inline-flex items-center rounded-full border border-accent/40 bg-accent/10 px-4 py-2 font-mono text-sm text-accent transition-colors hover:bg-accent/20"
                        >
                            refocus terminal
                        </button>
                        <Link
                            to="/"
                            className="inline-flex items-center rounded-full border border-border px-4 py-2 font-mono text-sm text-muted-foreground transition-colors hover:text-foreground"
                        >
                            back to home
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
