import { useCallback } from "react";
import Hero from "@/components/hero";
import About from "@/components/about";
import Experience from "@/components/experience";
import Skills from "@/components/skills";
import Projects from "@/components/projects";
import Teaser from "@/components/teaser";
import Footer from "@/components/footer";
import { useGlobal } from "@/stores/global";
import { useEasterEggs } from "@/stores/easter-eggs";

export default function Home() {
    const { bumpHeroClicks, heroClicks, triggerTerminalMode, resetHeroClicks } =
        useGlobal();
    const { markFound } = useEasterEggs();

    const handleNameClick = useCallback(() => {
        bumpHeroClicks();
        if (heroClicks + 1 >= 10) {
            triggerTerminalMode(5000);
            markFound("ten-clicks");
            resetHeroClicks();
        }
    }, [
        bumpHeroClicks,
        heroClicks,
        triggerTerminalMode,
        markFound,
        resetHeroClicks,
    ]);

    return (
        <main className="relative">
            <Hero onNameClick={handleNameClick} />
            <About />
            <Experience />
            <Skills />
            <Projects />
            <Teaser />
            <Footer />
        </main>
    );
}
