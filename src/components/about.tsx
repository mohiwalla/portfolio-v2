import { motion, type Variants } from "framer-motion";
import siteData from "@/lib/site-data";

const headingVariants: Variants = {
    hidden: { opacity: 0, y: 40 },
    show: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.7, ease: "easeOut" },
    },
};

const listVariants: Variants = {
    hidden: {},
    show: {
        transition: {
            staggerChildren: 0.08,
            delayChildren: 0.1,
        },
    },
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.55, ease: "easeOut" },
    },
};

export default function About() {
    const { about } = siteData;

    return (
        <section id="about" className="mx-auto max-w-6xl px-6 py-32">
            <motion.h2
                variants={headingVariants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-10%" }}
                className="text-mega font-display leading-[0.9] tracking-tight"
            >
                {about.heading}
            </motion.h2>

            <div className="mt-16 grid grid-cols-1 gap-14 md:grid-cols-2 md:gap-20">
                <motion.div
                    variants={listVariants}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: "-10%" }}
                    className="space-y-6"
                >
                    {about.paragraphs.map((p, i) => (
                        <motion.p
                            key={i}
                            variants={itemVariants}
                            className="text-lg leading-relaxed text-foreground/80"
                        >
                            {p}
                        </motion.p>
                    ))}
                </motion.div>

                <motion.ul
                    variants={listVariants}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: "-10%" }}
                    className="space-y-3 md:pt-2"
                >
                    {about.funFacts.map((fact, i) => (
                        <motion.li
                            key={i}
                            variants={itemVariants}
                            className="flex gap-3 font-mono text-sm text-foreground/75"
                        >
                            <span
                                aria-hidden
                                className="mt-[1px] text-accent select-none"
                            >
                                »
                            </span>
                            <span>{fact}</span>
                        </motion.li>
                    ))}
                </motion.ul>
            </div>
        </section>
    );
}
