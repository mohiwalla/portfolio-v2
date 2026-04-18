import * as React from "react";
import { useNavigate } from "react-router";
import { FitAddon } from "@xterm/addon-fit";
import { Terminal as XTerm } from "@xterm/xterm";
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

interface TerminalShellProps {
    className?: string;
    isOpen?: boolean;
    focusToken?: number;
}

interface ShellState {
    input: string;
    draft: string;
    history: string[];
    historyIdx: number;
    suggestion: string;
}

const COMMANDS = siteData.terminal.commands.map((command) => command.cmd);

function isPrintable(data: string) {
    return (
        data >= " " &&
        !data.startsWith("\u001b") &&
        data !== "\u007f" &&
        data !== "\r"
    );
}

export default function TerminalShell({
    className,
    isOpen = true,
    focusToken = 0,
}: TerminalShellProps) {
    const navigate = useNavigate();
    const { markFound } = useEasterEggs();
    const markedRef = React.useRef(false);
    const bsodTimerRef = React.useRef<number | null>(null);
    const [bsod, setBsod] = React.useState(false);

    const containerRef = React.useRef<HTMLDivElement>(null);
    const terminalRef = React.useRef<XTerm | null>(null);
    const fitAddonRef = React.useRef<FitAddon | null>(null);
    const shellStateRef = React.useRef<ShellState>({
        input: "",
        draft: "",
        history: [],
        historyIdx: -1,
        suggestion: "",
    });

    React.useEffect(() => {
        if (!markedRef.current) {
            markedRef.current = true;
            markFound("terminal");
        }
    }, [markFound]);

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

    const focusTerminal = React.useCallback(() => {
        window.requestAnimationFrame(() => {
            fitAddonRef.current?.fit();
            terminalRef.current?.focus();
        });
    }, []);

    const writeLine = React.useCallback((text: string, kind: LineKind) => {
        const terminal = terminalRef.current;
        if (!terminal) return;

        const color =
            kind === "info"
                ? "\u001b[38;2;153;153;153m"
                : kind === "output"
                  ? "\u001b[38;2;232;232;232m"
                  : "\u001b[38;2;255;255;255m";

        terminal.write(`\r\n${color}${text}\u001b[0m`);
    }, []);

    const replaceInput = React.useCallback((nextInput: string) => {
        const shellState = shellStateRef.current;
        shellState.input = nextInput;
    }, []);

    const getSuggestion = React.useCallback((input: string) => {
        if (!input.trim()) return "";

        const lowerInput = input.toLowerCase();
        const match = COMMANDS.find((command) =>
            command.toLowerCase().startsWith(lowerInput)
        );

        if (!match || match.length <= input.length) return "";
        return match.slice(input.length);
    }, []);

    const renderInputLine = React.useCallback(() => {
        const terminal = terminalRef.current;
        const shellState = shellStateRef.current;
        if (!terminal) return;

        shellState.suggestion = getSuggestion(shellState.input);

        terminal.write("\x1b[2K\r");
        terminal.write("\u001b[38;2;245;158;11m$\u001b[0m ");
        terminal.write(shellState.input);

        if (shellState.suggestion.length > 0) {
            terminal.write(
                `\u001b[38;2;115;115;115m${shellState.suggestion}\u001b[0m`
            );
            terminal.write(`\x1b[${shellState.suggestion.length}D`);
        }
    }, [getSuggestion]);

    const writePrompt = React.useCallback((newLine = true) => {
        const shellState = shellStateRef.current;
        shellState.input = "";
        shellState.draft = "";
        shellState.historyIdx = -1;
        shellState.suggestion = "";

        if (newLine) {
            terminalRef.current?.write("\r\n");
        }
        renderInputLine();
    }, [renderInputLine]);

    const runCommand = React.useCallback((raw: string) => {
        const cmd = raw.trim();

        if (!cmd) {
            writePrompt(false);
            return;
        }

        const low = cmd.toLowerCase();

        if (low === "clear") {
            terminalRef.current?.clear();
            writePrompt(false);
            return;
        }

        const response = findResponse(cmd);
        (response ?? [siteData.terminal.fallback]).forEach((text) =>
            writeLine(text, "output")
        );

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
        writePrompt(true);
    }, [markFound, navigate, writeLine, writePrompt]);

    const handleTerminalData = React.useCallback((data: string) => {
        const terminal = terminalRef.current;
        const shellState = shellStateRef.current;
        if (!terminal) return;

        if (data === "\r") {
            const raw = shellState.input;
            const normalized = raw.trim().toLowerCase();

            if (normalized !== "clear") {
                terminal.write("\x1b[2K\r");
                terminal.write("\u001b[38;2;245;158;11m$\u001b[0m ");
                terminal.write(raw);
                terminal.write("\r\n");
            }

            if (raw.trim().length > 0) {
                shellState.history.push(raw);
            }

            runCommand(raw);
            return;
        }

        if (data === "\u0003") {
            terminal.write("^C");
            shellState.input = "";
            shellState.draft = "";
            shellState.historyIdx = -1;
            shellState.suggestion = "";
            writePrompt(true);
            return;
        }

        if (data === "\u000c") {
            terminal.clear();
            writePrompt(false);
            return;
        }

        if (data === "\t") {
            if (shellState.suggestion.length === 0) return;
            shellState.input += shellState.suggestion;
            renderInputLine();
            return;
        }

        if (data === "\u007f") {
            if (shellState.input.length === 0) return;
            shellState.input = shellState.input.slice(0, -1);
            renderInputLine();
            return;
        }

        if (data === "\u001b[A") {
            if (shellState.history.length === 0) return;

            if (shellState.historyIdx === -1) {
                shellState.draft = shellState.input;
            }

            const nextIdx =
                shellState.historyIdx < 0
                    ? shellState.history.length - 1
                    : Math.max(0, shellState.historyIdx - 1);

            shellState.historyIdx = nextIdx;
            replaceInput(shellState.history[nextIdx] ?? "");
            renderInputLine();
            return;
        }

        if (data === "\u001b[B") {
            if (shellState.history.length === 0 || shellState.historyIdx < 0) {
                return;
            }

            const nextIdx = shellState.historyIdx + 1;
            if (nextIdx >= shellState.history.length) {
                shellState.historyIdx = -1;
                replaceInput(shellState.draft);
            } else {
                shellState.historyIdx = nextIdx;
                replaceInput(shellState.history[nextIdx] ?? "");
            }
            renderInputLine();
            return;
        }

        if (!isPrintable(data)) return;

        shellState.input += data;
        renderInputLine();
    }, [renderInputLine, replaceInput, runCommand, writePrompt]);

    React.useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const terminal = new XTerm({
            allowTransparency: true,
            convertEol: true,
            cursorBlink: true,
            cursorStyle: "block",
            fontFamily:
                '"Geist Mono Variable", ui-monospace, SFMono-Regular, monospace',
            fontSize: 13,
            letterSpacing: 0.2,
            lineHeight: 1.35,
            theme: {
                background: "rgba(0, 0, 0, 0)",
                foreground: "#f5f5f5",
                cursor: "#f59e0b",
                selectionBackground: "rgba(245, 158, 11, 0.28)",
                black: "#0a0a0a",
                brightBlack: "#737373",
                brightBlue: "#93c5fd",
                brightCyan: "#67e8f9",
                brightGreen: "#86efac",
                brightMagenta: "#f0abfc",
                brightRed: "#fca5a5",
                brightWhite: "#fafafa",
                brightYellow: "#fde68a",
            },
        });
        const fitAddon = new FitAddon();
        const resizeObserver = new ResizeObserver(() => {
            focusTerminal();
        });

        terminal.loadAddon(fitAddon);
        terminal.attachCustomKeyEventHandler((event) => {
            if (
                (event.metaKey || event.ctrlKey) &&
                event.key.toLowerCase() === "j"
            ) {
                return false;
            }
            return true;
        });
        terminal.open(container);

        terminalRef.current = terminal;
        fitAddonRef.current = fitAddon;

        greetingLines().forEach((line) => writeLine(line.text, line.kind));
        writePrompt(false);
        focusTerminal();

        const inputDisposable = terminal.onData(handleTerminalData);
        const viewport = container.querySelector(".xterm-viewport");
        const handleWheel = (event: WheelEvent) => {
            if (!(viewport instanceof HTMLElement)) return;
            event.preventDefault();
            event.stopPropagation();
            viewport.scrollTop += event.deltaY;
            viewport.scrollLeft += event.deltaX;
        };

        container.addEventListener("wheel", handleWheel, { passive: false });
        resizeObserver.observe(container);

        return () => {
            inputDisposable.dispose();
            container.removeEventListener("wheel", handleWheel);
            resizeObserver.disconnect();
            fitAddonRef.current = null;
            terminalRef.current = null;
            terminal.dispose();
        };
    }, [focusTerminal, handleTerminalData, writeLine, writePrompt]);

    React.useEffect(() => {
        if (!isOpen) return;
        focusTerminal();
    }, [focusTerminal, isOpen]);

    React.useEffect(() => {
        if (focusToken === 0) return;
        focusTerminal();
    }, [focusTerminal, focusToken]);

    return (
        <div
            className={cn(
                "relative h-full min-h-0 overflow-hidden bg-black/70",
                className
            )}
        >
            <div
                onClick={focusTerminal}
                className="h-full cursor-text p-4 sm:p-5"
            >
                <div ref={containerRef} className="terminal-xterm h-full w-full" />
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
