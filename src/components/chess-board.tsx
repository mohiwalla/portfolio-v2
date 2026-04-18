import * as React from "react";
import { Chess, type Square, type PieceSymbol, type Color } from "chess.js";
import confetti from "canvas-confetti";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useEasterEggs } from "@/stores/easter-eggs";
import { cn } from "@/lib/utils";

const STARTING_FEN = "6k1/5ppp/8/8/8/8/5PPP/4R1K1 w - - 0 1";

const FILES = ["a", "b", "c", "d", "e", "f", "g", "h"] as const;
const RANKS = [8, 7, 6, 5, 4, 3, 2, 1] as const;

type FileChar = (typeof FILES)[number];

const GLYPH: Record<PieceSymbol, string> = {
    k: "\u265A",
    q: "\u265B",
    r: "\u265C",
    b: "\u265D",
    n: "\u265E",
    p: "\u265F",
};

function toSquare(file: FileChar, rank: number): Square {
    return `${file}${rank}` as Square;
}

function isLightSquare(file: FileChar, rank: number): boolean {
    const fileIndex = FILES.indexOf(file);
    return (fileIndex + rank) % 2 === 1;
}

interface BoardPiece {
    square: Square;
    type: PieceSymbol;
    color: Color;
}

export default function ChessBoard() {
    const { markFound } = useEasterEggs();
    const gameRef = React.useRef<Chess>(new Chess(STARTING_FEN));
    const [selected, setSelected] = React.useState<Square | null>(null);
    const [solved, setSolved] = React.useState(false);
    const [tick, bump] = React.useReducer((x: number) => x + 1, 0);

    const game = gameRef.current;

    const legalTargets = React.useMemo<Set<Square>>(() => {
        if (!selected) return new Set();
        const moves = game.moves({ square: selected, verbose: true });
        return new Set(moves.map((m) => m.to as Square));
    }, [selected, game, tick]);

    const board = game.board();
    const turnSide = game.turn();

    const handleSquareClick = (sq: Square) => {
        if (solved) return;

        if (selected && legalTargets.has(sq)) {
            try {
                game.move({ from: selected, to: sq, promotion: "q" });
            } catch {
                setSelected(null);
                return;
            }
            setSelected(null);
            bump();
            if (game.isCheckmate()) {
                setSolved(true);
                markFound("chess");
                void confetti({
                    particleCount: 220,
                    spread: 100,
                    startVelocity: 45,
                    origin: { y: 0.55 },
                    colors: [
                        "#ffc24d",
                        "#ffe8b3",
                        "#ffffff",
                        "#ffb020",
                        "#f59e0b",
                    ],
                });
            }
            return;
        }

        const piece = game.get(sq);
        if (piece && piece.color === turnSide) {
            setSelected(sq);
        } else {
            setSelected(null);
        }
    };

    const reset = () => {
        gameRef.current = new Chess(STARTING_FEN);
        setSelected(null);
        setSolved(false);
        bump();
    };

    return (
        <div className="flex w-full flex-col items-center gap-5">
            <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                white to move. mate in one.
            </div>

            <div className="relative aspect-square w-full max-w-[560px] select-none overflow-hidden rounded-lg border border-border shadow-2xl shadow-black/60">
                <div className="grid h-full w-full grid-cols-8 grid-rows-8">
                    {RANKS.map((rank) =>
                        FILES.map((file) => {
                            const sq = toSquare(file, rank);
                            const light = isLightSquare(file, rank);
                            const rowIdx = 8 - rank;
                            const colIdx = FILES.indexOf(file);
                            const cell: BoardPiece | null = board[rowIdx][colIdx];
                            const isSelected = selected === sq;
                            const isTarget = legalTargets.has(sq);
                            const isCapture = isTarget && cell !== null;

                            return (
                                <button
                                    key={sq}
                                    type="button"
                                    aria-label={`square ${sq}`}
                                    onClick={() => handleSquareClick(sq)}
                                    className={cn(
                                        "relative flex items-center justify-center transition-colors",
                                        light
                                            ? "bg-[oklch(0.42_0_0)]"
                                            : "bg-[oklch(0.22_0_0)]",
                                        isSelected &&
                                            "ring-2 ring-accent ring-inset z-10"
                                    )}
                                >
                                    {isTarget && !isCapture && (
                                        <span className="absolute h-3 w-3 rounded-full bg-accent/70" />
                                    )}
                                    {isCapture && (
                                        <span className="absolute inset-1 rounded-md ring-2 ring-accent/80" />
                                    )}
                                    {cell && (
                                        <span
                                            aria-hidden
                                            className={cn(
                                                "relative select-none font-sans leading-none",
                                                cell.color === "w"
                                                    ? "text-neutral-50 [text-shadow:0_2px_0_rgba(0,0,0,0.7),0_0_2px_rgba(0,0,0,0.9)]"
                                                    : "text-neutral-950 [text-shadow:0_2px_0_rgba(255,255,255,0.25),0_0_2px_rgba(255,255,255,0.35)]"
                                            )}
                                            style={{ fontSize: 48 }}
                                        >
                                            {GLYPH[cell.type]}
                                        </span>
                                    )}
                                </button>
                            );
                        })
                    )}
                </div>
            </div>

            <div className="flex items-center gap-3">
                <Button variant="outline" size="sm" onClick={reset}>
                    reset
                </Button>
                <span className="font-mono text-xs text-muted-foreground">
                    moves played: {game.history().length}
                </span>
            </div>

            <AnimatePresence>
                {solved && (
                    <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.98 }}
                        transition={{
                            duration: 0.4,
                            ease: [0.22, 1, 0.36, 1],
                        }}
                        className="rounded-full border border-accent/50 bg-accent/10 px-5 py-2 font-mono text-sm text-foreground backdrop-blur"
                    >
                        gg. you found it.
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
