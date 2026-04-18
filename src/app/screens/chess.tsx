import { Link } from "react-router"
import ChessBoard from "@/components/chess-board"

export default function Chess() {
	return (
		<div className="bg-background relative min-h-dvh overflow-hidden px-4 py-16">
			<div className="absolute top-6 left-6 z-10">
				<Link
					to="/"
					className="text-muted-foreground hover:text-foreground inline-flex items-center gap-2 font-mono text-sm transition-colors"
				>
					<span aria-hidden>←</span> home
				</Link>
			</div>

			<div className="relative mx-auto flex max-w-[720px] flex-col items-center gap-6 pt-4 text-center">
				<h1 className="text-mega font-display">gg wp</h1>
				<p className="text-muted-foreground max-w-md font-mono text-sm md:text-base">
					mate in 1. obvious in hindsight. right?
				</p>
				<ChessBoard />
			</div>
		</div>
	)
}
