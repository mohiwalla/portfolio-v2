import * as React from "react";
import { useNavigate } from "react-router";
import siteData from "@/lib/site-data";
import { useEasterEggs } from "@/stores/easter-eggs";
import { cn } from "@/lib/utils";

type LineKind = "info" | "input" | "output";

interface Line {
    kind: LineKind;
    text: string;
}

const MAILTO = "mailto:kamal@mohiwalla.com";

function greetingLines(): Line[] {
    return siteData.terminal.greeting.map<Line>((t) => ({
        kind: "info",
        text: t,
    }));
}

export default function TerminalShell() {
    const navigate = useNavigate();
    const { markFound } = useEasterEggs();
    const markedRef = React.useRef(false);
    const bsodTimerRef = React.useRef<number | null>(null);

    const [lines, setLines] = React.useState<Line[]>(() => greetingLines());
    const [input, setInput] = React.useState("");
    const [history, setHistory] = React.useState<string[]>([]);
    const [historyIdx, setHistoryIdx] = React.useState<number>(-1);
    const [bsod, setBsod] = React.useState(false);

    const inputRef = React.useRef<HTMLInputElement>(null);
    const scrollRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        inputRef.current?.focus();
        if (!markedRef.current) {
            markedRef.current = true;
            markFound("terminal");
        }
    }, [markFound]);

    React.useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;
        el.scrollTop = el.scrollHeight;
    }, [lines]);

    React.useEffect(() => {
        return () => {
            if (bsodTimerRef.current !== null) {
                window.clearTimeout(bsodTimerRef.current);
                bsodTimerRef.current = null;
            }
        };
    }, []);

    const findResponse = (cmd: string): string[] | null => {
        const target = cmd.trim().toLowerCase();
        const match = siteData.terminal.commands.find(
            (c) => c.cmd.trim().toLowerCase() === target
        );
        return match ? match.response : null;
    };

    const runCommand = (raw: string) => {
        const cmd = raw.trim();
        const echoed: Line = { kind: "input", text: raw };

        if (!cmd) {
            setLines((prev) => [...prev, echoed]);
            return;
        }

        const low = cmd.toLowerCase();

        if (low === "clear") {
            setLines([]);
            return;
        }

        const response = findResponse(cmd);
        const outputs: Line[] = (response ?? [siteData.terminal.fallback]).map(
            (t) => ({ kind: "output", text: t })
        );

        setLines((prev) => [...prev, echoed, ...outputs]);

        if (low === "hire") {
            markFound("terminal");
            window.setTimeout(() => {
                window.location.href = MAILTO;
            }, 150);
        } else if (low === "chess") {
            window.setTimeout(() => navigate("/chess"), 350);
        } else if (low === "konami") {
            window.setTimeout(() => navigate("/konami"), 350);
        } else if (low === "sudo rm -rf /") {
            setBsod(true);
            markFound("bsod");
            if (bsodTimerRef.current !== null) {
                window.clearTimeout(bsodTimerRef.current);
            }
            bsodTimerRef.current = window.setTimeout(() => {
                setBsod(false);
                bsodTimerRef.current = null;
            }, 3000);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.ctrlKey && (e.key === "l" || e.key === "L")) {
            e.preventDefault();
            setLines([]);
            return;
        }

        if (e.key === "Enter") {
            e.preventDefault();
            const raw = input;
            if (raw.trim().length > 0) {
                setHistory((h) => [...h, raw]);
            }
            setHistoryIdx(-1);
            setInput("");
            runCommand(raw);
            return;
        }

        if (e.key === "ArrowUp") {
            e.preventDefault();
            if (history.length === 0) return;
            const nextIdx =
                historyIdx < 0
                    ? history.length - 1
                    : Math.max(0, historyIdx - 1);
            setHistoryIdx(nextIdx);
            setInput(history[nextIdx]);
            return;
        }

        if (e.key === "ArrowDown") {
            e.preventDefault();
            if (history.length === 0 || historyIdx < 0) return;
            const nextIdx = historyIdx + 1;
            if (nextIdx >= history.length) {
                setHistoryIdx(-1);
                setInput("");
            } else {
                setHistoryIdx(nextIdx);
                setInput(history[nextIdx]);
            }
        }
    };

    return (
        <div className="w-full overflow-hidden rounded-xl border border-border shadow-2xl shadow-black/40">
            <div className="flex items-center gap-2 border-b border-border bg-secondary/70 px-3 py-2">
                <span className="h-3 w-3 rounded-full bg-red-500/80" />
                <span className="h-3 w-3 rounded-full bg-yellow-500/80" />
                <span className="h-3 w-3 rounded-full bg-green-500/80" />
                <span className="ml-3 font-mono text-xs text-muted-foreground">
                    mohiwalla@portfolio ~ %
                </span>
            </div>

            <div
                ref={scrollRef}
                onClick={() => inputRef.current?.focus()}
                className="max-h-[60vh] min-h-[300px] cursor-text rounded-b-xl border border-border border-t-0 bg-black/60 p-4 font-mono text-sm leading-6 overflow-y-auto"
            >
                {lines.map((l, i) => (
                    <div
                        key={i}
                        className={cn(
                            "whitespace-pre-wrap",
                            l.kind === "info" && "text-muted-foreground",
                            l.kind === "output" && "text-foreground/90",
                            l.kind === "input" && "text-foreground"
                        )}
                    >
                        {l.kind === "input" ? (
                            <>
                                <span className="text-accent">$ </span>
                                {l.text}
                            </>
                        ) : (
                            l.text
                        )}
                    </div>
                ))}

                <div className="flex items-center">
                    <span className="mr-2 text-accent">$</span>
                    <input
                        ref={inputRef}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        spellCheck={false}
                        autoCorrect="off"
                        autoCapitalize="off"
                        autoComplete="off"
                        aria-label="terminal input"
                        className="flex-1 border-0 bg-transparent font-mono text-foreground caret-accent outline-none"
                    />
                </div>
            </div>

            {bsod && (
                <div
                    role="dialog"
                    aria-label="blue screen of death"
                    className="fixed inset-0 z-9999 flex items-center justify-center px-8 py-12 font-mono text-white"
                    style={{ backgroundColor: "#1e3a8a" }}
                >
                    <div className="max-w-xl">
                        <div className="mb-6 font-display text-6xl leading-none">
                            :(
                        </div>
                        <p className="text-lg leading-snug">
                            your portfolio ran into a problem and needs to
                            restart. we're just collecting some error info, and
                            then we'll restart for you.
                        </p>
                        <p className="mt-8 text-3xl font-bold tracking-tight">
                            JUST KIDDING :)
                        </p>
                        <p className="mt-3 text-sm opacity-80">
                            returning you to the terminal…
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
