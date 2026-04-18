import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router";
import { AnimatePresence, motion } from "framer-motion";
import confetti from "canvas-confetti";
import CommandPalette from "@/components/command-palette";
import CursorTrail from "@/components/cursor-trail";
import { EasterEggProvider, useEasterEggs } from "@/stores/easter-eggs";
import { GlobalProvider, useGlobal } from "@/stores/global";
import { createKonamiDetector } from "@/lib/konami";
import { createTypedTrigger } from "@/lib/typed-trigger";

const HIDDEN_HINT_ROUTES = new Set(["/konami", "/chess", "/terminal"]);

function fireKonamiConfetti() {
    if (typeof window === "undefined") return;
    confetti({
        particleCount: 180,
        spread: 90,
        startVelocity: 50,
        origin: { y: 0.7 },
        colors: ["#FFFFFF", "#FCEABB", "#F8B400", "#F59E0B", "#FDE68A"],
    });
}

function LayoutShell() {
    const navigate = useNavigate();
    const location = useLocation();
    const { toggleCursorTrail, markKonamiUnlocked } = useGlobal();
    const { markFound } = useEasterEggs();

    const [toast, setToast] = useState<string | null>(null);
    const toastTimer = useRef<number | null>(null);

    const showToast = useCallback((msg: string) => {
        setToast(msg);
        if (toastTimer.current !== null) {
            window.clearTimeout(toastTimer.current);
        }
        toastTimer.current = window.setTimeout(() => {
            setToast(null);
            toastTimer.current = null;
        }, 2500);
    }, []);

    useEffect(() => {
        return () => {
            if (toastTimer.current !== null) {
                window.clearTimeout(toastTimer.current);
            }
        };
    }, []);

    useEffect(() => {
        const konami = createKonamiDetector(() => {
            markKonamiUnlocked();
            markFound("konami");
            fireKonamiConfetti();
            navigate("/konami");
        });

        const typed = createTypedTrigger("mohiwalla", () => {
            toggleCursorTrail();
            markFound("type-mohiwalla");
            showToast("cursor trail toggled.");
        });

        window.addEventListener("keydown", konami);
        window.addEventListener("keydown", typed);
        return () => {
            window.removeEventListener("keydown", konami);
            window.removeEventListener("keydown", typed);
        };
    }, [
        markFound,
        markKonamiUnlocked,
        navigate,
        showToast,
        toggleCursorTrail,
    ]);

    useEffect(() => {
        if (location.pathname !== "/") return;
        const handleHash = () => {
            const id = window.location.hash.replace("#", "");
            if (!id) return;
            const el = document.getElementById(id);
            if (!el) return;
            el.scrollIntoView({ behavior: "smooth", block: "start" });
        };
        handleHash();
        window.addEventListener("hashchange", handleHash);
        return () => window.removeEventListener("hashchange", handleHash);
    }, [location.pathname, location.hash]);

    const showHint = useMemo(
        () => !HIDDEN_HINT_ROUTES.has(location.pathname),
        [location.pathname]
    );

    return (
        <div className="relative min-h-screen bg-background text-foreground">
            <CursorTrail />
            <CommandPalette />

            <Link
                to="/"
                className="fixed top-4 left-4 z-40 font-mono text-xs tracking-wider text-foreground/80 transition-colors hover:text-accent sm:top-6 sm:left-6"
            >
                mohiwalla
            </Link>

            {showHint ? (
                <div className="pointer-events-none fixed top-4 right-4 z-40 hidden sm:top-6 sm:right-6 md:block">
                    <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/80 px-3 py-1.5 font-mono text-[11px] tracking-wider text-muted-foreground backdrop-blur">
                        <kbd className="font-mono text-foreground">⌘K</kbd>
                        <span>command menu</span>
                    </span>
                </div>
            ) : null}

            <Outlet />

            <AnimatePresence>
                {toast ? (
                    <motion.div
                        key="layout-toast"
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 16 }}
                        transition={{ duration: 0.2 }}
                        className="pointer-events-none fixed bottom-8 left-1/2 z-[120] -translate-x-1/2"
                    >
                        <div className="rounded-full border border-border bg-card px-4 py-2 font-mono text-xs text-foreground shadow-xl">
                            {toast}
                        </div>
                    </motion.div>
                ) : null}
            </AnimatePresence>
        </div>
    );
}

export default function Layout() {
    return (
        <GlobalProvider>
            <EasterEggProvider>
                <LayoutShell />
            </EasterEggProvider>
        </GlobalProvider>
    );
}
