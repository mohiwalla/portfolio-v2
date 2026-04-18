export interface TerminalEditorState {
	input: string
	draft: string
	history: string[]
	historyIdx: number
	suggestion: string
}

export const EMPTY_TERMINAL_EDITOR_STATE: TerminalEditorState = {
	input: "",
	draft: "",
	history: [],
	historyIdx: -1,
	suggestion: "",
}

export function deletePreviousWord(input: string) {
	if (!input) return ""

	if (/\s+$/.test(input)) {
		return input.replace(/\s+$/, "")
	}

	return input.replace(/\s*\S+$/, "")
}

export function getSuggestion(commands: string[], input: string) {
	if (!input.trim()) return ""

	const lowerInput = input.toLowerCase()
	const match = commands.find(command =>
		command.toLowerCase().startsWith(lowerInput),
	)

	if (!match || match.length <= input.length) return ""
	return match.slice(input.length)
}

export function setInput(
	state: TerminalEditorState,
	commands: string[],
	input: string,
) {
	state.input = input
	state.suggestion = getSuggestion(commands, input)
}

export function clearInput(state: TerminalEditorState) {
	state.input = ""
	state.suggestion = ""
}

export function acceptSuggestion(state: TerminalEditorState) {
	if (!state.suggestion) return false

	state.input += state.suggestion
	state.suggestion = ""
	return true
}

export function deleteChar(state: TerminalEditorState, commands: string[]) {
	if (!state.input.length) return false

	setInput(state, commands, state.input.slice(0, -1))
	return true
}

export function deleteWord(state: TerminalEditorState, commands: string[]) {
	const nextInput = deletePreviousWord(state.input)
	if (nextInput === state.input) return false

	setInput(state, commands, nextInput)
	return true
}

export function clearLine(state: TerminalEditorState) {
	if (!state.input.length) return false

	clearInput(state)
	return true
}

export function pushHistory(state: TerminalEditorState, raw: string) {
	if (raw.trim().length > 0) {
		state.history.push(raw)
	}
	state.draft = ""
	state.historyIdx = -1
	state.suggestion = ""
}

export function historyUp(
	state: TerminalEditorState,
	commands: string[],
) {
	if (!state.history.length) return false

	if (state.historyIdx === -1) {
		state.draft = state.input
	}

	const nextIdx =
		state.historyIdx < 0
			? state.history.length - 1
			: Math.max(0, state.historyIdx - 1)

	state.historyIdx = nextIdx
	setInput(state, commands, state.history[nextIdx] ?? "")
	return true
}

export function historyDown(
	state: TerminalEditorState,
	commands: string[],
) {
	if (!state.history.length || state.historyIdx < 0) return false

	const nextIdx = state.historyIdx + 1
	if (nextIdx >= state.history.length) {
		state.historyIdx = -1
		setInput(state, commands, state.draft)
		return true
	}

	state.historyIdx = nextIdx
	setInput(state, commands, state.history[nextIdx] ?? "")
	return true
}

export function appendPrintable(
	state: TerminalEditorState,
	commands: string[],
	data: string,
) {
	const previousSuggestion = state.suggestion
	state.input += data
	state.suggestion = getSuggestion(commands, state.input)

	return {
		previousSuggestion,
		nextSuggestion: state.suggestion,
	}
}
