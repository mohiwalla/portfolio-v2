import type { SiteData } from "@/types/site";

const siteData: SiteData = {
    "hero": {
        "name": "mohiwalla",
        "role": "full stack engineer",
        "tagline": "i build things for the web that don't break. usually.",
        "subtagline": "obsessed with clean code, good ux, and finding the perfect keyboard shortcut for literally everything.",
        "ctas": [
            {
                "label": "work with me",
                "href": "mailto:kamal@mohiwalla.com",
                "kind": "primary"
            },
            {
                "label": "open terminal",
                "href": "/terminal",
                "kind": "ghost"
            }
        ]
    },
    "about": {
        "heading": "who the hell is this guy",
        "paragraphs": [
            "i'm a full stack engineer at sifars, where i spend my days convincing computers to do my bidding. sometimes they listen. i build features, wrangle aws, and occasionally write tests that pass on the first try.",
            "before this, i was at ciir solutions, deep in the forex world. i made slow things fast, integrated payment apis, and learned more about currency exchange rates than any sane person should.",
            "i like building useful things, learning new stuff, and shipping. i'm a big fan of typescript, clean apis, and the uncomfortable silence after i tell a bad joke."
        ],
        "funFacts": [
            "my name is always lowercase.",
            "i think in keyboard shortcuts.",
            "i have a complicated relationship with css.",
            "i've never lost a game of chess to a pigeon.",
            "my terminal is my happy place.",
            "i will find and enable dark mode on everything."
        ]
    },
    "experience": [
        {
            "company": "Sifars",
            "role": "Software Engineer II",
            "location": "Mohali",
            "period": "Aug 2025 - Present",
            "bullets": [
                "shipped a few full-stack features people seem to be using.",
                "herded ci/cd pipelines in azure devops to push code to aws.",
                "wrote enough playwright tests to make our qa team deeply suspicious.",
                "built an ai outlook add-in, which mostly just tells you what you already know, but faster."
            ],
            "punchline": "i basically connect boxes to other boxes and hope for the best."
        },
        {
            "company": "CIIR Solutions",
            "role": "Full Stack Developer",
            "location": "Rajpura",
            "period": "Apr 2023 - Jul 2025",
            "bullets": [
                "made a forex crm's api significantly less slow by poking at stored procedures.",
                "wrestled with paypal and stripe apis so people could actually pay for things.",
                "migrated a mountain of passwords from 'please-hack-me' to 'okay-fine'.",
                "convinced a bunch of apis to talk to each other and increase wallet deposits."
            ],
            "punchline": "my first real rodeo. learned a lot. broke a few things. fixed them."
        }
    ],
    "skills": [
        "TypeScript",
        "JavaScript",
        "React",
        "Node.js",
        "Next.js",
        "Playwright",
        "CSS",
        "Express",
        "REST",
        "MySQL",
        "PostgreSQL",
        "AWS",
        "CI/CD",
        "Azure",
        "Git",
        "Linux"
    ],
    "projects": [
        {
            "name": "Agentic Resume Pipeline",
            "tagline": "a cli that makes a robot write my resume.",
            "description": "it uses bun and typescript to boss around a resume renderer and chrome, turning my ramblings into a pdf that hopefully beats the ats bots. this resume was made with it.",
            "tags": [
                "bun",
                "typescript",
                "cli",
                "automation"
            ],
            "href": "https://github.com/mohiwalla",
            "status": "shipped"
        },
        {
            "name": "Plus Point Institute",
            "tagline": "an entire school administration crammed into a web app.",
            "description": "a full-stack platform to run a teaching institute, from student sign-ups to paying the teachers. it does everything but make the coffee.",
            "tags": [
                "react",
                "node.js",
                "mysql",
                "full-stack"
            ],
            "status": "shipped"
        },
        {
            "name": "create-vibing CLI",
            "tagline": "bootstrap a dev environment so fast it feels wrong.",
            "description": "a work-in-progress cli to scaffold a whole agentic dev setup. it hooks into azure, clockify, and other things i use daily. mostly for me, but you can watch.",
            "tags": [
                "bun",
                "typescript",
                "cli",
                "react ink",
                "wip"
            ],
            "href": "https://github.com/mohiwalla",
            "status": "in-progress"
        },
        {
            "name": "Browser macOS",
            "tagline": "it's like an operating system, but in your browser.",
            "description": "a web-based macos clone i'm tinkering with. it has a boot screen, a dock, and you can drag windows around. why? because i could.",
            "tags": [
                "react",
                "typescript",
                "css",
                "wip"
            ],
            "status": "in-progress"
        },
        {
            "name": "dtquick",
            "tagline": "a javascript data-table library from my past life.",
            "description": "one of my first real javascript projects. it's a lightweight table library published to npm. a bit crusty, but we all start somewhere, right?",
            "tags": [
                "javascript",
                "npm",
                "legacy"
            ],
            "href": "https://www.npmjs.com/package/dtquick",
            "status": "legacy"
        },
        {
            "name": "This Portfolio",
            "tagline": "the very meta site you are currently looking at.",
            "description": "built with vite and react, with a sprinkle of framer motion. it's got scroll hijacking and a few secrets. don't break it.",
            "tags": [
                "react",
                "vite",
                "framer motion",
                "easter eggs"
            ],
            "status": "shipped"
        }
    ],
    "teaser": {
        "heading": "go on. poke around.",
        "clues": [
            "try the classic cheat code.",
            "your friend cmd+k wants to say hi.",
            "maybe there's a game to be played.",
            "what would a terminal nerd hide in here?"
        ]
    },
    "footer": {
        "bigWord": "mohiwalla",
        "kicker": "like what you see? or just want to argue about tabs vs spaces?",
        "email": "kamal@mohiwalla.com",
        "socials": [
            {
                "label": "github",
                "href": "https://github.com/mohiwalla"
            },
            {
                "label": "email",
                "href": "mailto:kamal@mohiwalla.com"
            },
            {
                "label": "site",
                "href": "https://mohiwalla.com"
            }
        ],
        "signoff": "built with caffeine and a general disregard for my own sleep schedule."
    },
    "terminal": {
        "greeting": [
            "mohiwallaOS v1.0.0",
            "type 'help' to see what you can do."
        ],
        "commands": [
            {
                "cmd": "whoami",
                "response": [
                    "just a guy who writes code. and this terminal.",
                    "you're in a terminal, inside a browser. think about it."
                ]
            },
            {
                "cmd": "ls projects",
                "response": [
                    "Agentic Resume Pipeline",
                    "Plus Point Institute",
                    "create-vibing CLI (wip)",
                    "Browser macOS (wip)",
                    "dtquick (legacy)",
                    "This Portfolio (meta)"
                ]
            },
            {
                "cmd": "cat contact",
                "response": [
                    "email: kamal@mohiwalla.com",
                    "github: github.com/mohiwalla",
                    "or just type 'hire' if you're feeling bold."
                ]
            },
            {
                "cmd": "hire",
                "response": [
                    "opening your default email client to kamal@mohiwalla.com...",
                    "tell me about your project. or just send your favorite meme."
                ]
            },
            {
                "cmd": "chess",
                "response": [
                    "i'm not smart enough to play chess. yet.",
                    "but check back later, maybe i'll have figured it out."
                ]
            },
            {
                "cmd": "konami",
                "response": [
                    "nice try. but you have to actually *do* it."
                ]
            },
            {
                "cmd": "help",
                "response": [
                    "available commands:",
                    "  whoami         - a little about me",
                    "  ls projects    - see my work",
                    "  cat contact    - how to reach me",
                    "  hire           - let's talk business",
                    "  chess          - play a game?",
                    "  konami         - what's this?",
                    "  clear          - clean up this mess",
                    "  sudo rm -rf /  - definitely don't do this"
                ]
            },
            {
                "cmd": "clear",
                "response": []
            },
            {
                "cmd": "sudo rm -rf /",
                "response": [
                    "nice try.",
                    "but this is a read-only file system. and also, not a real file system.",
                    "you can't hurt me here."
                ]
            }
        ],
        "fallback": "command not found. are you making things up again? type 'help'."
    },
    "konami": {
        "heading": "you found the konami code.",
        "body": "you get it. you've spent hours of your life in front of a screen, just like me. we're not so different, you and i.",
        "badge": "+1 respect"
    },
    "notFound": {
        "heading": "illegal move.",
        "body": "this page doesn't exist. you've wandered off the board. happens to the best of us.",
        "linkLabel": "return to the game"
    }
};

export default siteData;
