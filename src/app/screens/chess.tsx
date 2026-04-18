import { Link } from "react-router";
import ChessBoard from "@/components/chess-board";

export default function Chess() {
    return (
        <div className="relative min-h-dvh overflow-hidden bg-background px-4 py-16">
            <div className="absolute left-6 top-6 z-10">
                <Link
                    to="/"
                    className="inline-flex items-center gap-2 font-mono text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                    <span aria-hidden>←</span> home
                </Link>
            </div>

            <div className="relative mx-auto flex max-w-[720px] flex-col items-center gap-6 pt-4 text-center">
                <h1 className="text-mega font-display">gg wp</h1>
                <p className="max-w-md font-mono text-sm text-muted-foreground md:text-base">
                    mate in 1. obvious in hindsight. right?
                </p>
                <ChessBoard />
            </div>
        </div>
    );
}
