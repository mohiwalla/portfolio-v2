import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useGSAP } from "@gsap/react";
import { registerGsap } from "@/lib/gsap";
import siteData from "@/lib/site-data";
import type { ProjectItem } from "@/types/site";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const { gsap } = registerGsap();

const statusStyles: Record<NonNullable<ProjectItem["status"]>, string> = {
    shipped: "border-accent/50 bg-accent/15 text-accent",
    "in-progress":
        "border-foreground/40 bg-transparent text-foreground/80",
    legacy: "border-border bg-muted/40 text-muted-foreground",
};

const statusLabel: Record<NonNullable<ProjectItem["status"]>, string> = {
    shipped: "shipped",
    "in-progress": "in progress",
    legacy: "legacy",
};

export default function Projects() {
    const containerRef = useRef<HTMLDivElement>(null);
    const stageRef = useRef<HTMLDivElement>(null);
    const stackRef = useRef<HTMLDivElement>(null);
    const progressRef = useRef<HTMLSpanElement>(null);
    const cardRefs = useRef<Array<HTMLDivElement | null>>([]);
    const projects: ProjectItem[] = siteData.projects;
    const count = projects.length;
    const [activeIndex, setActiveIndex] = useState(0);

    useGSAP(
        () => {
            const stage = stageRef.current;
            const cards = cardRefs.current.filter(
                (c): c is HTMLDivElement => Boolean(c)
            );
            const progress = progressRef.current;
            if (!stage || cards.length === 0) return;

            gsap.set(cards, {
                y: (i) => (i === 0 ? 0 : 60),
                scale: (i) => (i === 0 ? 1 : 0.9),
                opacity: (i) => (i === 0 ? 1 : 0),
                rotate: 0,
                transformOrigin: "50% 50%",
            });

            const tl = gsap.timeline({
                defaults: { ease: "power2.out" },
                scrollTrigger: {
                    trigger: stage,
                    pin: true,
                    scrub: 1,
                    start: "top top",
                    end: () => "+=" + window.innerHeight * (cards.length - 1),
                    invalidateOnRefresh: true,
                    anticipatePin: 1,
                    onUpdate: (self) => {
                        if (progress) {
                            progress.style.transform = `scaleX(${self.progress})`;
                        }
                        const idx = Math.min(
                            cards.length - 1,
                            Math.round(self.progress * (cards.length - 1))
                        );
                        setActiveIndex(idx);
                    },
                },
            });

            for (let i = 0; i < cards.length - 1; i++) {
                const outgoing = cards[i];
                const incoming = cards[i + 1];
                tl.to(
                    outgoing,
                    {
                        y: -40,
                        rotate: -4,
                        opacity: 0,
                        duration: 1,
                        ease: "power2.in",
                    },
                    i
                ).to(
                    incoming,
                    {
                        y: 0,
                        scale: 1,
                        opacity: 1,
                        duration: 1,
                        ease: "power2.out",
                    },
                    i
                );
            }

            return () => {
                tl.scrollTrigger?.kill();
                tl.kill();
            };
        },
        { scope: containerRef, dependencies: [count] }
    );

    return (
        <section
            id="projects"
            ref={containerRef}
            className="relative bg-background text-foreground"
            style={{ height: `${Math.max(count, 1) * 120}vh` }}
        >
            <div
                ref={stageRef}
                className="relative h-screen w-full overflow-hidden"
            >
                <div className="pointer-events-none absolute inset-x-0 top-0 z-30 flex flex-col gap-3 px-6 pt-10 md:px-12 md:pt-14">
                    <div className="flex items-start justify-between gap-6">
                        <motion.h2
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.4 }}
                            transition={{
                                duration: 0.8,
                                ease: [0.22, 1, 0.36, 1],
                            }}
                            className="text-mega font-display leading-none text-foreground/95"
                        >
                            projects
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.4 }}
                            transition={{
                                duration: 0.7,
                                ease: [0.22, 1, 0.36, 1],
                                delay: 0.15,
                            }}
                            className="hidden max-w-xs pt-6 font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground md:block"
                        >
                            <span className="text-accent">»</span> things that
                            ship, break, and ship again.
                        </motion.p>
                    </div>
                </div>

                <div className="pointer-events-none absolute left-6 top-10 z-30 font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground md:left-12 md:top-14">
                    <span className="text-accent">
                        {String(activeIndex + 1).padStart(2, "0")}
                    </span>{" "}
                    / {String(count).padStart(2, "0")}
                </div>

                <div
                    ref={stackRef}
                    className="relative mx-auto flex h-full w-full max-w-5xl items-center justify-center px-6"
                >
                    {projects.map((project, i) => (
                        <div
                            key={`${project.name}-${i}`}
                            ref={(el) => {
                                cardRefs.current[i] = el;
                            }}
                            className="absolute inset-x-6 top-1/2 -translate-y-1/2 will-change-transform md:inset-x-12"
                            style={{ zIndex: count - i }}
                        >
                            <ProjectCard
                                project={project}
                                index={i}
                                total={count}
                            />
                        </div>
                    ))}
                </div>

                <div className="pointer-events-none absolute inset-x-0 bottom-8 z-30 px-6 md:px-12">
                    <div className="relative h-[2px] w-full overflow-hidden bg-border/50">
                        <span
                            ref={progressRef}
                            className="absolute inset-y-0 left-0 block h-full w-full origin-left bg-accent"
                            style={{ transform: "scaleX(0)" }}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}

function ProjectCard({
    project,
    index,
    total,
}: {
    project: ProjectItem;
    index: number;
    total: number;
}) {
    const status = project.status;
    return (
        <Card className="relative overflow-hidden border-border/70 bg-card/90 p-2 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.6)] backdrop-blur-sm">
            <div
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-[0.06]"
                style={{
                    backgroundImage:
                        "radial-gradient(circle at 20% 0%, var(--color-accent), transparent 55%)",
                }}
            />
            <CardHeader className="relative flex flex-col gap-4 p-6 md:p-10">
                <div className="flex flex-wrap items-center gap-2">
                    {status ? (
                        <Badge
                            className={cn(
                                "border font-mono text-[10px] uppercase tracking-[0.2em]",
                                statusStyles[status]
                            )}
                        >
                            <span
                                className={cn(
                                    "mr-2 inline-block h-1.5 w-1.5 rounded-full",
                                    status === "shipped" && "bg-accent",
                                    status === "in-progress" &&
                                        "bg-foreground/70",
                                    status === "legacy" &&
                                        "bg-muted-foreground"
                                )}
                            />
                            {statusLabel[status]}
                        </Badge>
                    ) : null}
                    {project.tags.map((tag) => (
                        <span
                            key={tag}
                            className="inline-flex items-center rounded-full border border-border/80 bg-background/60 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/70"
                        >
                            {tag}
                        </span>
                    ))}
                    <span className="ml-auto font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                        {String(index + 1).padStart(2, "0")} /{" "}
                        {String(total).padStart(2, "0")}
                    </span>
                </div>
                <h3 className="group relative inline-flex w-fit text-4xl font-display leading-[0.9] text-foreground md:text-6xl">
                    <span className="relative">
                        {project.name}
                        <span className="absolute -bottom-1 left-0 h-[3px] w-0 bg-accent transition-all duration-500 ease-out group-hover:w-full" />
                    </span>
                </h3>
                <p className="text-lg text-foreground/80 md:text-xl">
                    {project.tagline}
                </p>
            </CardHeader>
            <CardContent className="relative px-6 md:px-10">
                <p className="max-w-2xl text-base leading-relaxed text-muted-foreground">
                    {project.description}
                </p>
            </CardContent>
            {project.href ? (
                <CardFooter className="relative px-6 pb-6 md:px-10 md:pb-10">
                    <a
                        href={project.href}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="group inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.3em] text-foreground/80 transition-colors hover:text-accent"
                    >
                        view
                        <ArrowUpRight
                            size={14}
                            className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                        />
                    </a>
                </CardFooter>
            ) : null}
        </Card>
    );
}
