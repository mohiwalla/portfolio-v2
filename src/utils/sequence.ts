export function endsWith<T>(buffer: T[], sequence: T[]): boolean {
    if (sequence.length === 0 || buffer.length < sequence.length) return false;
    const start = buffer.length - sequence.length;
    for (let i = 0; i < sequence.length; i++) {
        if (buffer[start + i] !== sequence[i]) return false;
    }
    return true;
}

export function pushBounded<T>(buffer: T[], value: T, max: number): T[] {
    const next = buffer.length >= max ? buffer.slice(1) : buffer.slice();
    next.push(value);
    return next;
}
