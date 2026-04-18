import * as React from "react"

interface GlobalState {
	cursorTrailOn: boolean
	terminalModeUntil: number
	terminalPanelOpen: boolean
	terminalFocusToken: number
	konamiUnlocked: boolean
	heroClicks: number
}

interface GlobalStore extends GlobalState {
	toggleCursorTrail: () => void
	setCursorTrail: (value: boolean) => void
	triggerTerminalMode: (ms?: number) => void
	openTerminalPanel: () => void
	closeTerminalPanel: () => void
	toggleTerminalPanel: () => void
	focusTerminalPanel: () => void
	bumpHeroClicks: () => void
	resetHeroClicks: () => void
	markKonamiUnlocked: () => void
}

const GlobalCtx = React.createContext<GlobalStore | null>(null)

export function GlobalProvider({ children }: { children: React.ReactNode }) {
	const [state, setState] = React.useState<GlobalState>({
		cursorTrailOn: false,
		terminalModeUntil: 0,
		terminalPanelOpen: false,
		terminalFocusToken: 0,
		konamiUnlocked: false,
		heroClicks: 0,
	})

	const toggleCursorTrail = React.useCallback(
		() => setState(s => ({ ...s, cursorTrailOn: !s.cursorTrailOn })),
		[],
	)
	const setCursorTrail = React.useCallback(
		(value: boolean) => setState(s => ({ ...s, cursorTrailOn: value })),
		[],
	)
	const triggerTerminalMode = React.useCallback(
		(ms = 5000) =>
			setState(s => ({
				...s,
				terminalModeUntil: Date.now() + ms,
				terminalPanelOpen: true,
				terminalFocusToken: s.terminalFocusToken + 1,
			})),
		[],
	)
	const openTerminalPanel = React.useCallback(
		() =>
			setState(s => ({
				...s,
				terminalPanelOpen: true,
				terminalFocusToken: s.terminalFocusToken + 1,
			})),
		[],
	)
	const closeTerminalPanel = React.useCallback(
		() => setState(s => ({ ...s, terminalPanelOpen: false })),
		[],
	)
	const toggleTerminalPanel = React.useCallback(
		() =>
			setState(s => ({
				...s,
				terminalPanelOpen: !s.terminalPanelOpen,
				terminalFocusToken: s.terminalPanelOpen
					? s.terminalFocusToken
					: s.terminalFocusToken + 1,
			})),
		[],
	)
	const focusTerminalPanel = React.useCallback(
		() =>
			setState(s => ({
				...s,
				terminalFocusToken: s.terminalFocusToken + 1,
			})),
		[],
	)
	const bumpHeroClicks = React.useCallback(
		() => setState(s => ({ ...s, heroClicks: s.heroClicks + 1 })),
		[],
	)
	const resetHeroClicks = React.useCallback(
		() => setState(s => ({ ...s, heroClicks: 0 })),
		[],
	)
	const markKonamiUnlocked = React.useCallback(
		() => setState(s => ({ ...s, konamiUnlocked: true })),
		[],
	)

	const value = React.useMemo<GlobalStore>(
		() => ({
			...state,
			toggleCursorTrail,
			setCursorTrail,
			triggerTerminalMode,
			openTerminalPanel,
			closeTerminalPanel,
			toggleTerminalPanel,
			focusTerminalPanel,
			bumpHeroClicks,
			resetHeroClicks,
			markKonamiUnlocked,
		}),
		[
			state,
			toggleCursorTrail,
			setCursorTrail,
			triggerTerminalMode,
			openTerminalPanel,
			closeTerminalPanel,
			toggleTerminalPanel,
			focusTerminalPanel,
			bumpHeroClicks,
			resetHeroClicks,
			markKonamiUnlocked,
		],
	)

	return <GlobalCtx.Provider value={value}>{children}</GlobalCtx.Provider>
}

export function useGlobal() {
	const ctx = React.useContext(GlobalCtx)
	if (!ctx) throw new Error("useGlobal must be used within <GlobalProvider>")
	return ctx
}
