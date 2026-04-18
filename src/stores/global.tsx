import * as React from "react";

interface GlobalState {
    cursorTrailOn: boolean;
    terminalModeUntil: number;
    konamiUnlocked: boolean;
    heroClicks: number;
}

interface GlobalStore extends GlobalState {
    toggleCursorTrail: () => void;
    setCursorTrail: (value: boolean) => void;
    triggerTerminalMode: (ms?: number) => void;
    bumpHeroClicks: () => void;
    resetHeroClicks: () => void;
    markKonamiUnlocked: () => void;
}

const GlobalCtx = React.createContext<GlobalStore | null>(null);

export function GlobalProvider({ children }: { children: React.ReactNode }) {
    const [state, setState] = React.useState<GlobalState>({
        cursorTrailOn: false,
        terminalModeUntil: 0,
        konamiUnlocked: false,
        heroClicks: 0,
    });

    const value = React.useMemo<GlobalStore>(
        () => ({
            ...state,
            toggleCursorTrail: () =>
                setState((s) => ({ ...s, cursorTrailOn: !s.cursorTrailOn })),
            setCursorTrail: (value) =>
                setState((s) => ({ ...s, cursorTrailOn: value })),
            triggerTerminalMode: (ms = 5000) =>
                setState((s) => ({
                    ...s,
                    terminalModeUntil: Date.now() + ms,
                })),
            bumpHeroClicks: () =>
                setState((s) => ({ ...s, heroClicks: s.heroClicks + 1 })),
            resetHeroClicks: () =>
                setState((s) => ({ ...s, heroClicks: 0 })),
            markKonamiUnlocked: () =>
                setState((s) => ({ ...s, konamiUnlocked: true })),
        }),
        [state]
    );

    return <GlobalCtx.Provider value={value}>{children}</GlobalCtx.Provider>;
}

export function useGlobal() {
    const ctx = React.useContext(GlobalCtx);
    if (!ctx) throw new Error("useGlobal must be used within <GlobalProvider>");
    return ctx;
}
