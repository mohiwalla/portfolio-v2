import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { useGSAP } from "@gsap/react";
import { registerGsap } from "@/lib/gsap";
import siteData from "@/lib/site-data";
import type { ExperienceItem } from "@/types/site";
import { cn } from "@/lib/utils";

const { gsap } = registerGsap();

export default function Experience() {
    const containerRef = useRef<HTMLDivElement>(null);
    const pinRef = useRef<HTMLDivElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);
    const items: ExperienceItem[] = siteData.experience;
    const count = items.length;
    const [activeIndex, setActiveIndex] = useState(0);

    useGSAP(
        () => {
            const track = trackRef.current;
            const pin = pinRef.current;
            if (!track || !pin || count <= 1) return;

            const getDistance = () => track.scrollWidth - window.innerWidth;

            const tween = gsap.to(track, {
                x: () => -getDistance(),
                ease: "none",
                scrollTrigger: {
                    trigger: pin,
                    pin: true,
                    scrub: 1,
                    start: "top top",
                    end: () => "+=" + getDistance(),
                    invalidateOnRefresh: true,
                    anticipatePin: 1,
                    onUpdate: (self) => {
                        const idx = Math.min(
                            count - 1,
                            Math.round(self.progress * (count - 1))
                        );
                        setActiveIndex(idx);
                    },
                },
            });

            return () => {
                tween.scrollTrigger?.kill();
                tween.kill();
            };
        },
        { scope: containerRef, dependencies: [count] }
    );

    return (
        <section
            id="experience"
            ref={containerRef}
            className="relative bg-background text-foreground"
            style={{ height: `${count * 100}vh` }}
        >
            <div
                ref={pinRef}
                className="relative h-screen w-screen overflow-hidden"
            >
                <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-start justify-between px-6 pt-10 md:px-12 md:pt-14">
                    <motion.h2
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.4 }}
                        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                        className="text-mega font-display leading-none text-foreground/95"
                    >
                        experience
                        <motion.span
                            initial={{ scaleX: 0 }}
                            whileInView={{ scaleX: 1 }}
                            viewport={{ once: true, amount: 0.4 }}
                            transition={{
                                duration: 1.1,
                                ease: [0.22, 1, 0.36, 1],
                                delay: 0.2,
                            }}
                            className="block h-2 w-40 origin-left bg-accent md:h-3 md:w-64"
                        />
                    </motion.h2>
                    <div className="hidden font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground md:block">
                        <span className="text-accent">»</span> scroll
                    </div>
                </div>

                <div
                    ref={trackRef}
                    className="flex h-full w-max will-change-transform"
                >
                    {items.map((item, i) => (
                        <ExperienceCard
                            key={`${item.company}-${i}`}
                            item={item}
                            index={i}
                            total={count}
                        />
                    ))}
                </div>

                <div className="pointer-events-none absolute inset-x-0 bottom-10 z-20 flex items-center justify-center gap-3">
                    {items.map((_, i) => (
                        <span
                            key={i}
                            className={cn(
                                "relative h-1.5 w-10 overflow-hidden rounded-full bg-border/60 transition-colors",
                                i === activeIndex && "bg-border"
                            )}
                        >
                            <span
                                className={cn(
                                    "absolute inset-y-0 left-0 bg-accent transition-all duration-500 ease-out",
                                    i < activeIndex && "w-full",
                                    i === activeIndex && "w-1/2",
                                    i > activeIndex && "w-0"
                                )}
                            />
                        </span>
                    ))}
                </div>
            </div>
        </section>
    );
}

function ExperienceCard({
    item,
    index,
    total,
}: {
    item: ExperienceItem;
    index: number;
    total: number;
}) {
    const bullets = item.bullets.slice(0, 4);
    return (
        <article
            className="relative flex h-screen w-screen shrink-0 flex-col justify-end px-6 pb-28 pt-[40vh] md:px-20 md:pt-[34vh]"
            aria-label={`${item.company}, ${item.role}`}
        >
            <div className="pointer-events-none absolute right-6 top-10 font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground md:right-20 md:top-16">
                {String(index + 1).padStart(2, "0")} /{" "}
                {String(total).padStart(2, "0")}
            </div>

            <div className="mb-5 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
                <span className="inline-block h-px w-8 bg-accent" />
                <span>{item.period}</span>
                <span className="text-border">·</span>
                <span>{item.location}</span>
            </div>

            <h3 className="text-mega font-display wrap-break-word leading-[0.82] text-foreground">
                {item.company}
            </h3>

            <p className="mt-4 text-xl font-medium text-foreground/90 md:text-2xl">
                {item.role}
            </p>

            <ul className="mt-8 grid max-w-3xl gap-2 text-base text-foreground/80 md:text-lg">
                {bullets.map((b, i) => (
                    <li
                        key={i}
                        className="flex items-start gap-3 leading-relaxed"
                    >
                        <span
                            aria-hidden
                            className="mt-[0.35em] shrink-0 font-mono text-accent"
                        >
                            »
                        </span>
                        <span>{b}</span>
                    </li>
                ))}
            </ul>

            <p className="mt-8 max-w-2xl font-mono text-sm italic text-muted-foreground md:text-base">
                {item.punchline}
            </p>
        </article>
    );
}
