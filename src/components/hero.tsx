import { useEffect } from "react";
import { Link } from "react-router";
import {
    motion,
    useMotionValue,
    useSpring,
    useTransform,
    type Variants,
} from "framer-motion";
import { ArrowDown, ExternalLink, Mail, Terminal } from "lucide-react";
import siteData from "@/lib/site-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface HeroProps {
    onNameClick?: () => void;
}

const container: Variants = {
    hidden: {},
    show: {
        transition: {
            staggerChildren: 0.03,
            delayChildren: 0.1,
        },
    },
};

const letter: Variants = {
    hidden: { opacity: 0, y: 40 },
    show: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.55, ease: [0.2, 0.8, 0.2, 1] },
    },
};

const fadeUp: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: "easeOut" },
    },
};

function ctaIcon(href: string) {
    if (href.startsWith("mailto:")) return <Mail />;
    if (href.startsWith("http")) return <ExternalLink />;
    if (href.startsWith("/terminal")) return <Terminal />;
    return null;
}

export default function Hero({ onNameClick }: HeroProps) {
    const { hero } = siteData;
    const name = hero.name.toLowerCase();
    const letters = Array.from(name);

    const mx = useMotionValue(0);
    const my = useMotionValue(0);
    const sx = useSpring(mx, { stiffness: 60, damping: 18, mass: 0.6 });
    const sy = useSpring(my, { stiffness: 60, damping: 18, mass: 0.6 });
    const fx = useTransform(sx, (v) => v * 20);
    const fy = useTransform(sy, (v) => v * 20);

    useEffect(() => {
        const onMove = (e: MouseEvent) => {
            const x = (e.clientX / window.innerWidth) * 2 - 1;
            const y = (e.clientY / window.innerHeight) * 2 - 1;
            mx.set(x);
            my.set(y);
        };
        window.addEventListener("mousemove", onMove);
        return () => window.removeEventListener("mousemove", onMove);
    }, [mx, my]);

    return (
        <section className="relative flex min-h-screen w-full items-center justify-center overflow-hidden px-6">
            <motion.div
                aria-hidden
                style={{ x: fx, y: fy }}
                className="pointer-events-none absolute inset-0 flex select-none items-center justify-center"
            >
                <span className="font-display text-[32vw] leading-none text-foreground/[0.04] whitespace-nowrap">
                    {name}
                </span>
            </motion.div>

            <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center text-center">
                <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                >
                    <Badge className="mb-8 border-accent/30 bg-accent/10 text-accent">
                        <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-accent" />
                        {hero.role}
                    </Badge>
                </motion.div>

                <motion.h1
                    variants={container}
                    initial="hidden"
                    animate="show"
                    onClick={onNameClick}
                    role={onNameClick ? "button" : undefined}
                    tabIndex={onNameClick ? 0 : undefined}
                    onKeyDown={(e) => {
                        if (!onNameClick) return;
                        if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            onNameClick();
                        }
                    }}
                    className={cn(
                        "text-giga font-display leading-[0.9] tracking-tight select-none",
                        onNameClick && "cursor-pointer hover:text-accent transition-colors"
                    )}
                    aria-label={name}
                >
                    {letters.map((ch, i) => (
                        <motion.span
                            key={`${ch}-${i}`}
                            variants={letter}
                            className="inline-block"
                            style={{ willChange: "transform, opacity" }}
                        >
                            {ch}
                        </motion.span>
                    ))}
                </motion.h1>

                <motion.p
                    variants={fadeUp}
                    initial="hidden"
                    animate="show"
                    transition={{ delay: 0.6 }}
                    className="mt-10 font-display text-2xl text-foreground/80 md:text-4xl"
                >
                    {hero.tagline}
                </motion.p>

                <motion.p
                    variants={fadeUp}
                    initial="hidden"
                    animate="show"
                    transition={{ delay: 0.75 }}
                    className="mt-4 max-w-xl text-muted-foreground"
                >
                    {hero.subtagline}
                </motion.p>

                <motion.div
                    variants={fadeUp}
                    initial="hidden"
                    animate="show"
                    transition={{ delay: 0.9 }}
                    className="mt-10 flex flex-wrap items-center justify-center gap-3"
                >
                    {hero.ctas.map((cta) => {
                        const variant =
                            cta.kind === "primary" ? "accent" : "outline";
                        const icon = ctaIcon(cta.href);
                        const content = (
                            <>
                                {cta.label}
                                {icon}
                            </>
                        );

                        if (
                            cta.href.startsWith("mailto:") ||
                            cta.href.startsWith("http")
                        ) {
                            return (
                                <a
                                    key={cta.label}
                                    href={cta.href}
                                    target={
                                        cta.href.startsWith("http")
                                            ? "_blank"
                                            : undefined
                                    }
                                    rel={
                                        cta.href.startsWith("http")
                                            ? "noreferrer"
                                            : undefined
                                    }
                                >
                                    <Button variant={variant} size="lg">
                                        {content}
                                    </Button>
                                </a>
                            );
                        }

                        if (cta.href.startsWith("/")) {
                            return (
                                <Link key={cta.label} to={cta.href}>
                                    <Button variant={variant} size="lg">
                                        {content}
                                    </Button>
                                </Link>
                            );
                        }

                        return (
                            <Button
                                key={cta.label}
                                variant={variant}
                                size="lg"
                            >
                                {content}
                            </Button>
                        );
                    })}
                </motion.div>
            </div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.4, duration: 0.6 }}
                className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
            >
                <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{
                        duration: 1.8,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                    className="flex flex-col items-center gap-2 font-mono text-xs tracking-widest text-muted-foreground uppercase"
                >
                    <span>scroll</span>
                    <ArrowDown className="h-4 w-4" />
                </motion.div>
            </motion.div>
        </section>
    );
}
