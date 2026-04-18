import siteData from "@/lib/site-data";
import { cn } from "@/lib/utils";

interface MarqueeRowProps {
    reverse?: boolean;
    items: string[];
    duration?: string;
}

function MarqueeRow({ reverse = false, items, duration }: MarqueeRowProps) {
    const track = [...items, ...items];
    return (
        <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
            <div
                className={cn(
                    "flex w-max animate-marquee",
                    reverse && "[animation-direction:reverse]"
                )}
                style={duration ? { animationDuration: duration } : undefined}
            >
                {track.map((skill, i) => (
                    <span
                        key={`${skill}-${i}`}
                        className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-border text-sm font-mono mx-2 whitespace-nowrap hover:border-accent hover:text-accent transition-colors"
                    >
                        <span className="h-1 w-1 rounded-full bg-accent/60" />
                        {skill}
                    </span>
                ))}
            </div>
        </div>
    );
}

export default function Skills() {
    const { skills } = siteData;

    return (
        <section id="skills" className="relative w-full py-32 overflow-hidden">
            <div className="relative mx-auto max-w-7xl px-6">
                <div className="relative">
                    <span
                        aria-hidden
                        className="pointer-events-none absolute inset-0 flex items-center justify-center font-display text-foreground/[0.04] text-mega select-none whitespace-nowrap"
                    >
                        stack
                    </span>
                    <h2 className="relative font-display text-mega leading-none text-foreground">
                        stack
                    </h2>
                </div>

                <p className="mt-6 max-w-xl font-mono text-sm text-muted-foreground">
                    the usual suspects. some by choice, some by necessity.
                </p>
            </div>

            <div className="mt-16 space-y-6">
                <MarqueeRow items={skills} duration="32s" />
                <MarqueeRow items={skills} reverse duration="40s" />
                <MarqueeRow items={skills} duration="28s" />
            </div>
        </section>
    );
}
