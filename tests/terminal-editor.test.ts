import { expect, test } from "bun:test"
import {
	EMPTY_TERMINAL_EDITOR_STATE,
	appendPrintable,
	acceptSuggestion,
	clearInput,
	clearLine,
	deleteChar,
	deletePreviousWord,
	deleteWord,
	historyDown,
	historyUp,
	pushHistory,
	setInput,
	type TerminalEditorState,
} from "../src/lib/terminal-editor.ts"

const COMMANDS = [
	"help",
	"hire",
	"whoami",
	"clear",
	"cat contact",
]

function createState(
	overrides: Partial<TerminalEditorState> = {},
): TerminalEditorState {
	return {
		...EMPTY_TERMINAL_EDITOR_STATE,
		history: [],
		...overrides,
	}
}

test("deletePreviousWord removes trailing word and surrounding space", () => {
	expect(deletePreviousWord("cat contact")).toBe("cat")
	expect(deletePreviousWord("cat ")).toBe("cat")
	expect(deletePreviousWord("")).toBe("")
})

test("appendPrintable updates suggestion incrementally", () => {
	const state = createState()

	const first = appendPrintable(state, COMMANDS, "h")
	expect(state.input).toBe("h")
	expect(state.suggestion).toBe("elp")
	expect(first.previousSuggestion).toBe("")

	const second = appendPrintable(state, COMMANDS, "e")
	expect(state.input).toBe("he")
	expect(state.suggestion).toBe("lp")
	expect(second.previousSuggestion).toBe("elp")
})

test("acceptSuggestion consumes inline completion", () => {
	const state = createState()
	setInput(state, COMMANDS, "cl")

	expect(state.suggestion).toBe("ear")
	expect(acceptSuggestion(state)).toBe(true)
	expect(state.input).toBe("clear")
	expect(state.suggestion).toBe("")
})

test("deleteChar updates suggestion without resetting whole state", () => {
	const state = createState()
	setInput(state, COMMANDS, "cle")

	expect(deleteChar(state, COMMANDS)).toBe(true)
	expect(state.input).toBe("cl")
	expect(state.suggestion).toBe("ear")
})

test("deleteWord supports ctrl+w and option+delete style behavior", () => {
	const state = createState()
	setInput(state, COMMANDS, "cat contact")

	expect(deleteWord(state, COMMANDS)).toBe(true)
	expect(state.input).toBe("cat")
	expect(state.suggestion).toBe(" contact")
})

test("clearLine clears current input", () => {
	const state = createState()
	setInput(state, COMMANDS, "who")

	expect(clearLine(state)).toBe(true)
	expect(state.input).toBe("")
	expect(state.suggestion).toBe("")

	clearInput(state)
	expect(state.input).toBe("")
})

test("history navigation preserves draft and moves through entries", () => {
	const state = createState()

	pushHistory(state, "help")
	pushHistory(state, "whoami")
	setInput(state, COMMANDS, "hi")

	expect(historyUp(state, COMMANDS)).toBe(true)
	expect(state.input).toBe("whoami")

	expect(historyUp(state, COMMANDS)).toBe(true)
	expect(state.input).toBe("help")

	expect(historyDown(state, COMMANDS)).toBe(true)
	expect(state.input).toBe("whoami")

	expect(historyDown(state, COMMANDS)).toBe(true)
	expect(state.input).toBe("hi")
})

test("pushHistory ignores blank commands", () => {
	const state = createState()

	pushHistory(state, "   ")
	pushHistory(state, "help")

	expect(state.history).toEqual(["help"])
	expect(state.historyIdx).toBe(-1)
})
