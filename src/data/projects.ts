export type Project = {
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  /** Shown under the default "Featured" filter */
  featured?: boolean;
  github?: string;
  link?: string;
  /** Technology names; icons are looked up by name in data/icons.ts */
  tech: string[];
};

// Display order for category groups; anything not listed falls to the bottom
export const categoryOrder = [
  "Startups",
  "Professional Projects",
  "Dev Tools",
  "University Projects",
  "Competitions", "Miscellaneous"];

export const projects: Project[] = [
  {
    title: "Skoll",
    featured: true,
    description:
      "World's first AI GTM Engineer. Aims to link outreach tools, enrichment tools and CRMs autonomously.",
    imageUrl: "/projectphotos/skoll.webp",
    category: "Startups",
    link: "https://useskoll.com",
    tech: [
      "Next.js",
      "Vite",
      "AWS",
      "Python",
      "FastAPI",
      "LangGraph",
      "LangFuse",
      "Pinecone",
    ],
  },
  {
    title: "Rex Sessionizer",
    description: "Project picker for Rex: one key, a fuzzy list of your project directories, a session for whichever you pick. Ported from tmux-sessionizer.",
    imageUrl: "/projectphotos/rex-sessionizer.png",
    category: "Dev Tools",
    github: "https://github.com/haxybaxy/rex-sessionizer",
    tech: ["Lua", "Shell"],
  },
  {
    title: "Rex Worktrunk",
    description: "Git worktree pickers for Rex, driven by worktrunk: switch to or create a worktree from one key, remove one from another, a Rex session per worktree. Ported from herdr-worktrunk.",
    imageUrl: "/projectphotos/rex-worktrunk.png",
    category: "Dev Tools",
    github: "https://github.com/haxybaxy/rex-worktrunk",
    tech: ["Lua", "Shell"],
  },
  {
    title: "Claude Tmux Status",
    description:
      "Claude Code plugin to indicate agent status and project in the vanilla tmux status bar",
    imageUrl: "/projectphotos/claude-tmux-status.webp",
    category: "Dev Tools",
    github: "https://github.com/haxybaxy/claude-tmux-status",
    tech: ["Shell"],
  },
  {
    title: "Holla at Your Boy",
    description: "Github action to tag your coworkers with code comments.",
    imageUrl: "/projectphotos/holla.webp",
    category: "Dev Tools",
    github: "https://github.com/haxybaxy/holla-at-your-boy",
    tech: ["Github Actions"],
  },
  {
    title: "Search Preview",
    description:
      "VSCode Extension to mimic file searching with Telescope in Neovim.",
    imageUrl: "/projectphotos/searchpreview.webp",
    category: "Dev Tools",
    github: "https://github.com/haxybaxy/search-preview",
    tech: ["Typescript"],
  },
  {
    title: "ClearSplit",
    featured: true,
    description: "Financial tooling for property managers.",
    imageUrl: "/projectphotos/clearsplit.webp",
    category: "Startups",
    link: "https://clearsplit.io",
    tech: ["React", "Supabase", "LangChain", "NestJS", "Railway"],
  },
  {
    title: "Distributed Stock Market Prediction",
    description:
      "LSTM Network that syncs its weights across multiple nodes to predict stock prices. Done for High Performance Computing course. I know the video isn't 4K 1440p, I didn't have enough storage space to render with a higher quality 😭.",
    imageUrl: "/projectphotos/hpc.webp",
    category: "University Projects",
    github: "https://github.com/haxybaxy/hpc-stock-prediction",
    link: "https://www.youtube.com/watch?v=bE9OQoD-mg0",
    tech: ["Python", "Tensorflow", "Cuda"],
  },
  {
    title: "DeployPilot",
    description:
      "Prototype for Agentic AI System that can deploy any code on any machine using various MCPs. Done for Recommenders Systems and Chatbots course.",
    imageUrl: "/projectphotos/deploypilot.webp",
    category: "University Projects",
    link: "https://www.youtube.com/watch?v=II6IIS46uPw",
    tech: ["Docker", "Python", "FastAPI", "LangChain", "DigitalOcean"],
  },
  {
    title: "Gaze Tracker",
    description: "Gaze Tracker project for my Computer Vision Course.",
    imageUrl: "/projectphotos/gazetracker.webp",
    category: "University Projects",
    github: "https://github.com/haxybaxy/eyetracker",
    link: "https://www.youtube.com/watch?v=JJY0FWCcJ8g",
    tech: ["Python", "OpenCV"],
  },
  {
    title: "FitWave",
    description:
      "App for personal trainers made by personal trainers. My first startup (it didn't work out).",
    imageUrl: "/projectphotos/fitwave.webp",
    category: "Startups",
    link: "https://www.linkedin.com/feed/update/urn:li:activity:7273049653883924481/",
    tech: [
      "Expo",
      "Typescript",
      "React Native",
      "Firebase",
      "Python",
      "LangChain",
      "Pinecone",
    ],
  },
  {
    title: "Liesl",
    featured: true,
    description:
      "Dog sitting and walking marketplace in Switzerland, released and maintained during my time at MVST",
    imageUrl: "/projectphotos/liesl.webp",
    category: "Professional Projects",
    link: "https://www.liesl.ch/",
    tech: ["React Native", "NextJS", "NestJS", "AWS"],
  },
  {
    title: "Remote Lab",
    featured: true,
    description:
      "Remote Lab access for users to control the IE Robotics Lab robots from anywhere in the world. Contains ROS package for ArUco tag detection with OpenCV and syncs coordinates with OptiTrack System",
    imageUrl: "/projectphotos/remotelab.webp",
    category: "Professional Projects",
    github: "https://github.com/IE-Robotics-Lab/remote_lab",
    tech: ["ROS", "Docker", "Python", "OpenCV", "Tensorflow"],
  },
  {
    title: "X++ Assistant",
    description:
      "Extremely proficient coding assistant for the obscure X++ language in Dynamics 365 Finance and Operations. Currently deployed at Dynamics Innovations.",
    imageUrl: "/projectphotos/xppcoder.webp",
    category: "Professional Projects",
    github: "https://github.com/haxybaxy/xppcoder",
    tech: ["Python", "LangChain", "HuggingFace", "Pinecone"],
  },
  {
    title: "EC Language",
    description:
      "Bytecode interpreter for custom programming language with dynamic typing and garbage collection, written in C.",
    imageUrl: "/projectphotos/eclang.webp",
    category: "University Projects",
    github: "https://github.com/haxybaxy/ec-lang",
    tech: ["C", "CMake"],
  },
  {
    title: "Monsieur",
    description:
      "AI Platform that uses ElevenLabs API to provide a managable fleet of virtual front desk employees for hotels. Facilitates phone calls and is able to book rooms and provide services for hotel guests. Built at the Entrepreneur First European Builders League Hackathon.",
    imageUrl: "/projectphotos/monsieur.webp",
    category: "Competitions",
    link: "https://www.linkedin.com/feed/update/urn:li:activity:7327688977786785793/",
    tech: ["Next.js", "LangGraph", "FastAPI", "Supabase"],
  },
  {
    title: "Agentic Investment Tracker",
    description:
      "Tracknetic is a toolkit designed to help Venture Capitalists and Investors to find new investments in different fields, and keep tabs on notable technologies, companies, people and more, using AI Agents that you can dispatch tasks to conversationally. Won the IE x OpenAI Use Case Showcase Competition.",
    imageUrl: "/projectphotos/tracknetic.webp",
    category: "Competitions",
    link: "https://www.linkedin.com/feed/update/urn:li:activity:7332082469791227905/",
    tech: ["React", "LangChain", "LangGraph"],
  },
  {
    title: "AI Hackathon 2023",
    description:
      "Won runner-up with 96% accuracy in the IEU Hackathon 2023 which required building LLM application to extract financial data from various term sheets.",
    imageUrl: "/projectphotos/aihackathon.webp",
    category: "Competitions",
    github: "https://github.com/haxybaxy/aihackathon2023",
    tech: ["Python", "LangChain", "OpenAI", "Pandas"],
  },
  {
    title: "IE Robotics Club Website",
    description: "IE Robotics Club website built with Astro.js and MongoDB.",
    imageUrl: "/projectphotos/ierobotics.webp",
    category: "University Projects",
    github: "https://github.com/IERoboticsClub/club_website_v0",
    tech: ["React", "Astro", "Node.js", "Express.js", "MongoDB", "Docker"],
  },
  {
    title: "UNO",
    description: "Pygame adaptation of the classic game Uno for DSA Class.",
    imageUrl: "/projectphotos/uno.webp",
    category: "University Projects",
    // Carried over as-is from the old site, where the link and stack were copied from the club website entry
    github: "https://github.com/IERoboticsClub/club_website_v0",
    tech: ["React", "Astro", "Node.js", "Express.js", "MongoDB", "Docker"],
  },
  {
    title: "Groupdle",
    featured: true,
    description: "Groupdle ranks your friends on Wordle, Connections, Strands, Minute Cryptic and 102 more daily puzzles: results logged as you play, points over a season.",
    imageUrl: "/projectphotos/groupdle.png",
    category: "Miscellaneous",
    link: "https://groupdle.com",
    tech: [],
  },
  {
    title: "Video Pedal",
    featured: true,
    description: "A loop pedal for your webcam: hold a key to record, release to loop, press to go live. Outputs a virtual camera.",
    imageUrl: "/projectphotos/video-pedal.png",
    category: "Miscellaneous",
    github: "https://github.com/haxybaxy/video-pedal",
    tech: ["Python"],
  },
];

/** "X++ Assistant" -> "x-assistant", the project's URL segment */
export function projectSlug(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}
