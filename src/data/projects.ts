export type Project = {
  title: string
  description: string
  imageUrl: string
  category: string
  github?: string
  link?: string
  /** Tech name -> icon path under /icons */
  icons: Record<string, string>
}

// Display order for category groups; anything not listed falls to the bottom
export const categoryOrder = ['Startups', 'Professional Projects', 'Dev Tools', 'University Projects', 'Competitions']

export const projects: Project[] = [
  {
    title: 'Skoll',
    description: "World's first AI GTM Engineer. Aims to link outreach tools, enrichment tools and CRMs autonomously.",
    imageUrl: '/projectphotos/skoll.webp',
    category: 'Startups',
    link: 'https://useskoll.com',
    icons: {
      'Next.js': '/icons/nextjs.svg',
      Vite: '/icons/vite.svg',
      AWS: '/icons/aws.svg',
      Python: '/icons/python.svg',
      FastAPI: '/icons/fastapi.svg',
      LangGraph: '/icons/langgraph.svg',
      LangFuse: '/icons/langfuse.svg',
      Pinecone: '/icons/pinecone.svg',
    },
  },
  {
    title: 'Claude Tmux Status',
    description: 'Claude Code plugin to indicate agent status and project in the vanilla tmux status bar',
    imageUrl: '/projectphotos/claude-tmux-status.webp',
    category: 'Dev Tools',
    github: 'https://github.com/haxybaxy/claude-tmux-status',
    icons: { Shell: '/icons/bash.svg' },
  },
  {
    title: 'Holla at Your Boy',
    description: 'Github action to tag your coworkers with code comments.',
    imageUrl: '/projectphotos/holla.webp',
    category: 'Dev Tools',
    github: 'https://github.com/haxybaxy/holla-at-your-boy',
    icons: { 'Github Actions': '/icons/github.svg' },
  },
  {
    title: 'Search Preview',
    description: 'VSCode Extension to mimic file searching with Telescope in Neovim.',
    imageUrl: '/projectphotos/searchpreview.webp',
    category: 'Dev Tools',
    github: 'https://github.com/haxybaxy/search-preview',
    icons: { Typescript: '/icons/typescript.svg' },
  },
  {
    title: 'ClearSplit',
    description: 'Financial tooling for property managers.',
    imageUrl: '/projectphotos/clearsplit.webp',
    category: 'Startups',
    link: 'https://clearsplit.io',
    icons: {
      React: '/icons/react.svg',
      Supabase: '/icons/supabase.svg',
      LangChain: '/icons/langchain.svg',
      NestJS: '/icons/nestjs.svg',
      Railway: '/icons/railway.svg',
    },
  },
  {
    title: 'Worktap!',
    description: 'Job board for short term gigs.',
    imageUrl: '/projectphotos/worktap.webp',
    category: 'Startups',
    link: 'https://www.worktap.info/',
    icons: {
      Expo: '/icons/expo.svg',
      'React Native': '/icons/react.svg',
      Typescript: '/icons/typescript.svg',
      Firebase: '/icons/firebase.svg',
    },
  },
  {
    title: 'Distributed Stock Market Prediction',
    description:
      "LSTM Network that syncs its weights across multiple nodes to predict stock prices. Done for High Performance Computing course. I know the video isn't 4K 1440p, I didn't have enough storage space to render with a higher quality 😭.",
    imageUrl: '/projectphotos/hpc.webp',
    category: 'University Projects',
    github: 'https://github.com/haxybaxy/hpc-stock-prediction',
    link: 'https://www.youtube.com/watch?v=bE9OQoD-mg0',
    icons: { Python: '/icons/python.svg', Tensorflow: '/icons/tensorflow.svg', Cuda: '/icons/cuda.svg' },
  },
  {
    title: 'DeployPilot',
    description:
      'Prototype for Agentic AI System that can deploy any code on any machine using various MCPs. Done for Recommenders Systems and Chatbots course.',
    imageUrl: '/projectphotos/deploypilot.webp',
    category: 'University Projects',
    link: 'https://www.youtube.com/watch?v=II6IIS46uPw',
    icons: {
      Docker: '/icons/docker.svg',
      Python: '/icons/python.svg',
      FastAPI: '/icons/fastapi.svg',
      LangChain: '/icons/langchain.svg',
      DigitalOcean: '/icons/digitalocean.svg',
    },
  },
  {
    title: 'Gaze Tracker',
    description: 'Gaze Tracker project for my Computer Vision Course.',
    imageUrl: '/projectphotos/gazetracker.webp',
    category: 'University Projects',
    github: 'https://github.com/haxybaxy/eyetracker',
    link: 'https://www.youtube.com/watch?v=JJY0FWCcJ8g',
    icons: { Python: '/icons/python.svg', OpenCV: '/icons/opencv.svg' },
  },
  {
    title: 'FitWave',
    description: "App for personal trainers made by personal trainers. My first startup (it didn't work out).",
    imageUrl: '/projectphotos/fitwave.webp',
    category: 'Startups',
    link: 'https://www.linkedin.com/feed/update/urn:li:activity:7273049653883924481/',
    icons: {
      Expo: '/icons/expo.svg',
      Typescript: '/icons/typescript.svg',
      'React Native': '/icons/react.svg',
      Firebase: '/icons/firebase.svg',
      Python: '/icons/python.svg',
      LangChain: '/icons/langchain.svg',
      Pinecone: '/icons/pinecone.svg',
    },
  },
  {
    title: 'Liesl',
    description: 'Dog sitting and walking marketplace in Switzerland, released and maintained during my time at MVST',
    imageUrl: '/projectphotos/liesl.webp',
    category: 'Professional Projects',
    link: 'https://www.liesl.ch/',
    icons: {
      'React Native': '/icons/react.svg',
      NextJS: '/icons/nextjs.svg',
      NestJS: '/icons/nestjs.svg',
      AWS: '/icons/aws.svg',
    },
  },
  {
    title: 'Remote Lab',
    description:
      'Remote Lab access for users to control the IE Robotics Lab robots from anywhere in the world. Contains ROS package for ArUco tag detection with OpenCV and syncs coordinates with OptiTrack System',
    imageUrl: '/projectphotos/remotelab.webp',
    category: 'Professional Projects',
    github: 'https://github.com/IE-Robotics-Lab/remote_lab',
    icons: {
      ROS: '/icons/ros.svg',
      Docker: '/icons/docker.svg',
      Python: '/icons/python.svg',
      OpenCV: '/icons/opencv.svg',
      Tensorflow: '/icons/tensorflow.svg',
    },
  },
  {
    title: 'X++ Assistant',
    description:
      'Extremely proficient coding assistant for the obscure X++ language in Dynamics 365 Finance and Operations. Currently deployed at Dynamics Innovations.',
    imageUrl: '/projectphotos/xppcoder.webp',
    category: 'Professional Projects',
    github: 'https://github.com/haxybaxy/xppcoder',
    icons: {
      Python: '/icons/python.svg',
      LangChain: '/icons/langchain.svg',
      HuggingFace: '/icons/huggingface.svg',
      Pinecone: '/icons/pinecone.svg',
    },
  },
  {
    title: 'EC Language',
    description:
      'Bytecode interpreter for custom programming language with dynamic typing and garbage collection, written in C.',
    imageUrl: '/projectphotos/eclang.webp',
    category: 'University Projects',
    github: 'https://github.com/haxybaxy/ec-lang',
    icons: { C: '/icons/c.svg', CMake: '/icons/cmake.svg' },
  },
  {
    title: 'Monsieur',
    description:
      'AI Platform that uses ElevenLabs API to provide a managable fleet of virtual front desk employees for hotels. Facilitates phone calls and is able to book rooms and provide services for hotel guests. Built at the Entrepreneur First European Builders League Hackathon.',
    imageUrl: '/projectphotos/monsieur.webp',
    category: 'Competitions',
    link: 'https://www.linkedin.com/feed/update/urn:li:activity:7327688977786785793/',
    icons: {
      'Next.js': '/icons/nextjs.svg',
      LangGraph: '/icons/langgraph.svg',
      FastAPI: '/icons/fastapi.svg',
      Supabase: '/icons/supabase.svg',
    },
  },
  {
    title: 'Agentic Investment Tracker',
    description:
      'Tracknetic is a toolkit designed to help Venture Capitalists and Investors to find new investments in different fields, and keep tabs on notable technologies, companies, people and more, using AI Agents that you can dispatch tasks to conversationally. Won the IE x OpenAI Use Case Showcase Competition.',
    imageUrl: '/projectphotos/tracknetic.webp',
    category: 'Competitions',
    link: 'https://www.linkedin.com/feed/update/urn:li:activity:7332082469791227905/',
    icons: { React: '/icons/react.svg', LangChain: '/icons/langchain.svg', LangGraph: '/icons/langgraph.svg' },
  },
  {
    title: 'AI Hackathon 2023',
    description:
      'Won runner-up with 96% accuracy in the IEU Hackathon 2023 which required building LLM application to extract financial data from various term sheets.',
    imageUrl: '/projectphotos/aihackathon.webp',
    category: 'Competitions',
    github: 'https://github.com/haxybaxy/aihackathon2023',
    icons: {
      Python: '/icons/python.svg',
      LangChain: '/icons/langchain.svg',
      OpenAI: '/icons/openai.svg',
      Pandas: '/icons/pandas.svg',
    },
  },
  {
    title: 'IE Robotics Club Website',
    description: 'IE Robotics Club website built with Astro.js and MongoDB.',
    imageUrl: '/projectphotos/ierobotics.webp',
    category: 'University Projects',
    github: 'https://github.com/IERoboticsClub/club_website_v0',
    icons: {
      React: '/icons/react.svg',
      Astro: '/icons/astro.svg',
      'Node.js': '/icons/nodejs.svg',
      'Express.js': '/icons/express.svg',
      MongoDB: '/icons/mongodb.svg',
      Docker: '/icons/docker.svg',
    },
  },
  {
    title: 'UNO',
    description: 'Pygame adaptation of the classic game Uno for DSA Class.',
    imageUrl: '/projectphotos/uno.webp',
    category: 'University Projects',
    // Carried over as-is from the old site, where the link and stack were copied from the club website entry
    github: 'https://github.com/IERoboticsClub/club_website_v0',
    icons: {
      React: '/icons/react.svg',
      Astro: '/icons/astro.svg',
      'Node.js': '/icons/nodejs.svg',
      'Express.js': '/icons/express.svg',
      MongoDB: '/icons/mongodb.svg',
      Docker: '/icons/docker.svg',
    },
  },
]

/** "X++ Assistant" -> "project-x-assistant", used as the card's anchor id */
export function projectAnchor(title: string) {
  return `project-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`
}
