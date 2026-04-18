import { Link } from "react-router";
import TerminalShell from "@/components/terminal-shell";

export default function Terminal() {
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

            <div className="relative mx-auto mt-8 max-w-3xl">
                <div className="mb-6 text-center">
                    <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                        // shell. type `help` to get started
                    </p>
                </div>
                <TerminalShell />
            </div>
        </div>
    );
}
