import * as React from "react"
import { useNavigate } from "react-router"
import { FitAddon } from "@xterm/addon-fit"
import { Terminal as XTerm } from "@xterm/xterm"
import siteData from "@/lib/site-data"
import {
	EMPTY_TERMINAL_EDITOR_STATE,
	appendPrintable,
	acceptSuggestion,
	clearLine,
	deleteChar,
	deleteWord,
	getCommandStatus,
	historyDown,
	historyUp,
	pushHistory,
	type TerminalEditorState,
} from "@/lib/terminal-editor"
import {
	hasPrimaryLinkModifier,
	linkifyTerminalText,
	normalizeTerminalHref,
} from "@/lib/terminal-links"
import { useEasterEggs } from "@/stores/easter-eggs"
import { cn } from "@/lib/utils"

type LineKind = "info" | "input" | "output"

interface Line {
	kind: LineKind
	text: string
}

const MAILTO = "mailto:kamal@mohiwalla.com"
const PROMPT_SYMBOL = "➜"

const ANSI = {
	info: "\u001b[38;2;153;153;153m",
	output: "\u001b[38;2;232;232;232m",
	prompt: "\u001b[38;2;134;239;172m",
	input: "\u001b[38;2;245;245;245m",
	valid: "\u001b[38;2;134;239;172m",
	invalid: "\u001b[38;2;252;165;165m",
	suggestion: "\u001b[38;2;115;115;115m",
	reset: "\u001b[0m",
} as const

function greetingLines(): Line[] {
	return siteData.terminal.greeting.map<Line>(t => ({
		kind: "info",
		text: t,
	}))
}

interface TerminalShellProps {
	className?: string
	isOpen?: boolean
	focusToken?: number
}

const COMMANDS = siteData.terminal.commands.map(command => command.cmd)

function isPrintable(data: string) {
	return (
		data >= " " &&
		!data.startsWith("\u001b") &&
		data !== "\u007f" &&
		data !== "\r"
	)
}

export default function TerminalShell({
	className,
	isOpen = true,
	focusToken = 0,
}: TerminalShellProps) {
	const navigate = useNavigate()
	const { markFound } = useEasterEggs()
	const markedRef = React.useRef(false)
	const bsodTimerRef = React.useRef<number | null>(null)
	const [bsod, setBsod] = React.useState(false)

	const containerRef = React.useRef<HTMLDivElement>(null)
	const terminalRef = React.useRef<XTerm | null>(null)
	const fitAddonRef = React.useRef<FitAddon | null>(null)
	const suppressNextWordDeleteRef = React.useRef(false)
	const platformRef = React.useRef("unknown")
	const shellStateRef = React.useRef<TerminalEditorState>({
		...EMPTY_TERMINAL_EDITOR_STATE,
		history: [],
	})

	React.useEffect(() => {
		if (!markedRef.current) {
			markedRef.current = true
			markFound("terminal")
		}
	}, [markFound])

	React.useEffect(() => {
		const navigatorWithUAData = navigator as Navigator & {
			userAgentData?: { platform?: string }
		}

		platformRef.current =
			navigatorWithUAData.userAgentData?.platform ??
			navigator.platform ??
			navigator.userAgent
	}, [])

	React.useEffect(() => {
		return () => {
			if (bsodTimerRef.current !== null) {
				window.clearTimeout(bsodTimerRef.current)
				bsodTimerRef.current = null
			}
		}
	}, [])

	const findResponse = (cmd: string): string[] | null => {
		const target = cmd.trim().toLowerCase()
		const match = siteData.terminal.commands.find(
			c => c.cmd.trim().toLowerCase() === target,
		)
		return match ? match.response : null
	}

	const focusTerminal = React.useCallback(() => {
		window.requestAnimationFrame(() => {
			fitAddonRef.current?.fit()
			terminalRef.current?.focus()
		})
	}, [])

	const writeLine = React.useCallback(
		(text: string, kind: LineKind, leadingBreak = true) => {
			const terminal = terminalRef.current
			if (!terminal) return

			const color =
				kind === "info"
					? ANSI.info
					: kind === "output"
						? ANSI.output
						: ANSI.input

			terminal.write(
				`${leadingBreak ? "\r\n" : ""}${color}${linkifyTerminalText(text)}${ANSI.reset}`,
			)
		},
		[],
	)

	const getClearedInput = React.useCallback(() => "", [])

	const getInputColor = React.useCallback((input: string) => {
		const status = getCommandStatus(COMMANDS, input)

		if (status === "valid") return ANSI.valid
		if (status === "invalid") return ANSI.invalid
		return ANSI.input
	}, [])

	const renderInputLine = React.useCallback(() => {
		const terminal = terminalRef.current
		const shellState = shellStateRef.current
		if (!terminal) return

		terminal.write("\x1b[2K\r")
		terminal.write(`${ANSI.prompt}${PROMPT_SYMBOL}${ANSI.reset} `)
		terminal.write(`${getInputColor(shellState.input)}${shellState.input}${ANSI.reset}`)

		if (shellState.suggestion.length > 0) {
			terminal.write(`${ANSI.suggestion}${shellState.suggestion}${ANSI.reset}`)
			terminal.write(`\x1b[${shellState.suggestion.length}D`)
		}
	}, [getInputColor])

	const renderSuggestionTail = React.useCallback((suggestion: string) => {
		const terminal = terminalRef.current
		if (!terminal) return

		if (suggestion.length > 0) {
			terminal.write(`${ANSI.suggestion}${suggestion}${ANSI.reset}`)
		}

		terminal.write("\x1b[K")
		if (suggestion.length > 0) {
			terminal.write(`\x1b[${suggestion.length}D`)
		}
	}, [])

	const applyDeletion = React.useCallback(
		(previousInput: string, nextInput: string) => {
			const terminal = terminalRef.current
			const shellState = shellStateRef.current
			if (!terminal) return

			const previousStatus = getCommandStatus(COMMANDS, previousInput)
			const nextStatus = getCommandStatus(COMMANDS, nextInput)

			if (previousStatus !== nextStatus) {
				renderInputLine()
				return
			}

			const removedCount = previousInput.length - nextInput.length
			if (removedCount < 0) {
				renderInputLine()
				return
			}

			if (removedCount > 0) {
				terminal.write("\b".repeat(removedCount))
			}

			terminal.write("\x1b[K")
			renderSuggestionTail(shellState.suggestion)
		},
		[renderInputLine, renderSuggestionTail],
	)

	const writePrompt = React.useCallback(
		(newLine = true) => {
			const shellState = shellStateRef.current
			shellState.input = ""
			shellState.draft = ""
			shellState.historyIdx = -1
			shellState.suggestion = ""

			if (newLine) {
				terminalRef.current?.write("\r\n")
			}
			renderInputLine()
		},
		[renderInputLine],
	)

	const runCommand = React.useCallback(
		(raw: string) => {
			const cmd = raw.trim()

			if (!cmd) {
				writePrompt(false)
				return
			}

			const low = cmd.toLowerCase()

			if (low === "clear") {
				terminalRef.current?.clear()
				writePrompt(false)
				return
			}

			const response = findResponse(cmd)
			;(response ?? [siteData.terminal.fallback]).forEach(text =>
				writeLine(text, "output"),
			)

			if (low === "hire") {
				markFound("terminal")
				window.setTimeout(() => {
					window.location.href = MAILTO
				}, 150)
			} else if (low === "chess") {
				window.setTimeout(() => navigate("/chess"), 350)
			} else if (low === "konami") {
				window.setTimeout(() => navigate("/konami"), 350)
			} else if (low === "sudo rm -rf /") {
				setBsod(true)
				markFound("bsod")
				if (bsodTimerRef.current !== null) {
					window.clearTimeout(bsodTimerRef.current)
				}
				bsodTimerRef.current = window.setTimeout(() => {
					setBsod(false)
					bsodTimerRef.current = null
				}, 3000)
			}
			writePrompt(true)
		},
		[markFound, navigate, writeLine, writePrompt],
	)

	const handleTerminalData = React.useCallback(
		(data: string) => {
			const terminal = terminalRef.current
			const shellState = shellStateRef.current
			if (!terminal) return

			if (data === "\r") {
				const raw = shellState.input
				const normalized = raw.trim().toLowerCase()

				if (normalized !== "clear") {
					terminal.write("\x1b[2K\r")
					terminal.write(`${ANSI.prompt}${PROMPT_SYMBOL}${ANSI.reset} `)
					terminal.write(`${getInputColor(raw)}${raw}${ANSI.reset}`)
					terminal.write("\r\n")
				}

				pushHistory(shellState, raw)

				runCommand(raw)
				return
			}

			if (data === "\u0003") {
				terminal.write("^C")
				shellState.input = ""
				shellState.draft = ""
				shellState.historyIdx = -1
				shellState.suggestion = ""
				writePrompt(true)
				return
			}

			if (data === "\u000c") {
				terminal.clear()
				writePrompt(false)
				return
			}

			if (data === "\u0015") {
				const previousInput = shellState.input
				if (!clearLine(shellState)) return
				applyDeletion(previousInput, getClearedInput())
				return
			}

			if (data === "\u0017" || data === "\u001b\u007f") {
				if (suppressNextWordDeleteRef.current) {
					suppressNextWordDeleteRef.current = false
					return
				}
				const previousInput = shellState.input
				if (!deleteWord(shellState, COMMANDS)) return
				applyDeletion(previousInput, shellState.input)
				return
			}

			if (data === "\t") {
				if (!acceptSuggestion(shellState)) return
				renderInputLine()
				return
			}

			if (data === "\u001b[C") {
				if (!acceptSuggestion(shellState)) return
				renderInputLine()
				return
			}

			if (data === "\u007f") {
				const previousInput = shellState.input
				if (!deleteChar(shellState, COMMANDS)) return
				applyDeletion(previousInput, shellState.input)
				return
			}

			if (data === "\u001b[A") {
				if (!historyUp(shellState, COMMANDS)) return
				renderInputLine()
				return
			}

			if (data === "\u001b[B") {
				if (!historyDown(shellState, COMMANDS)) return
				renderInputLine()
				return
			}

			if (!isPrintable(data)) return

			const { previousSuggestion, nextSuggestion } = appendPrintable(
				shellState,
				COMMANDS,
				data,
			)
			const previousStatus = getCommandStatus(
				COMMANDS,
				shellState.input.slice(0, -data.length),
			)
			const nextStatus = getCommandStatus(COMMANDS, shellState.input)

			if (previousStatus !== nextStatus) {
				renderInputLine()
				return
			}

			terminal.write(`${getInputColor(shellState.input)}${data}${ANSI.reset}`)

			if (nextSuggestion !== previousSuggestion.slice(1)) {
				renderSuggestionTail(nextSuggestion)
			}
		},
		[
			applyDeletion,
			getInputColor,
			renderInputLine,
			renderSuggestionTail,
			runCommand,
			writePrompt,
		],
	)

	React.useEffect(() => {
		const container = containerRef.current
		if (!container) return

		const terminal = new XTerm({
			allowTransparency: true,
			convertEol: true,
			cursorBlink: true,
			cursorStyle: "block",
			fontFamily:
				'"Geist Mono Variable", ui-monospace, SFMono-Regular, monospace',
			fontSize: 13,
			letterSpacing: 0.2,
			linkHandler: {
				allowNonHttpProtocols: true,
				activate: (event, text) => {
					if (!hasPrimaryLinkModifier(event, platformRef.current)) return

					const href = normalizeTerminalHref(text)
					if (!href) return

					if (href.startsWith("mailto:")) {
						window.location.href = href
						return
					}

					window.open(href, "_blank", "noopener,noreferrer")
				},
			},
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
		})
		const fitAddon = new FitAddon()
		const resizeObserver = new ResizeObserver(() => {
			focusTerminal()
		})

		terminal.loadAddon(fitAddon)
		terminal.attachCustomKeyEventHandler(event => {
			if (event.metaKey && event.key === "Backspace") {
				event.preventDefault()
				const previousInput = shellStateRef.current.input
				if (!clearLine(shellStateRef.current)) return false
				applyDeletion(previousInput, "")
				return false
			}

			if (event.ctrlKey && event.key === "Backspace") {
				event.preventDefault()
				suppressNextWordDeleteRef.current = true
				const previousInput = shellStateRef.current.input
				if (!deleteWord(shellStateRef.current, COMMANDS)) return false
				applyDeletion(previousInput, shellStateRef.current.input)
				return false
			}

			if (event.ctrlKey && event.key.toLowerCase() === "u") {
				event.preventDefault()
				const previousInput = shellStateRef.current.input
				if (!clearLine(shellStateRef.current)) return false
				applyDeletion(previousInput, "")
				return false
			}

			if (
				(event.metaKey || event.ctrlKey) &&
				event.key.toLowerCase() === "j"
			) {
				return false
			}
			return true
		})
		terminal.open(container)

		terminalRef.current = terminal
		fitAddonRef.current = fitAddon

		greetingLines().forEach((line, index) =>
			writeLine(line.text, line.kind, index !== 0),
		)
		writePrompt(false)
		focusTerminal()

		const inputDisposable = terminal.onData(handleTerminalData)
		const viewport = container.querySelector(".xterm-viewport")
		const handleWheel = (event: WheelEvent) => {
			if (!(viewport instanceof HTMLElement)) return
			event.preventDefault()
			event.stopPropagation()
			viewport.scrollTop += event.deltaY
			viewport.scrollLeft += event.deltaX
		}

		container.addEventListener("wheel", handleWheel, { passive: false })
		resizeObserver.observe(container)

		return () => {
			inputDisposable.dispose()
			container.removeEventListener("wheel", handleWheel)
			resizeObserver.disconnect()
			fitAddonRef.current = null
			terminalRef.current = null
			terminal.dispose()
		}
	}, [
		applyDeletion,
		focusTerminal,
		handleTerminalData,
		writeLine,
		writePrompt,
	])

	React.useEffect(() => {
		if (!isOpen) return
		focusTerminal()
	}, [focusTerminal, isOpen])

	React.useEffect(() => {
		if (focusToken === 0) return
		focusTerminal()
	}, [focusTerminal, focusToken])

	return (
		<div
			className={cn(
				"relative h-full min-h-0 overflow-hidden bg-black/70",
				className,
			)}
		>
			<div
				onClick={focusTerminal}
				className="h-full cursor-text p-2 sm:p-3"
			>
				<div
					ref={containerRef}
					className="terminal-xterm h-full w-full"
				/>
			</div>
			{bsod && (
				<div
					role="dialog"
					aria-label="blue screen of death"
					className="fixed inset-0 z-9999 flex items-center justify-center px-8 py-12 font-mono text-white"
					style={{ backgroundColor: "#1e3a8a" }}
				>
					<div className="max-w-xl">
						<div className="font-display mb-6 text-6xl leading-none">
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
	)
}
