export function createTypedTrigger(word: string, onMatch: () => void) {
    const target = word.toLowerCase();
    let buffer = "";
    const handler = (event: KeyboardEvent) => {
        const active = document.activeElement;
        if (
            active instanceof HTMLInputElement ||
            active instanceof HTMLTextAreaElement ||
            (active instanceof HTMLElement && active.isContentEditable)
        ) {
            return;
        }
        if (event.key.length !== 1) return;
        buffer = (buffer + event.key.toLowerCase()).slice(-target.length);
        if (buffer === target) {
            buffer = "";
            onMatch();
        }
    };
    return handler;
}
