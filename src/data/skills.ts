type SkillCategory = {
  title: string
  skills: string[]
}

export const skillCategories: SkillCategory[] = [
  { title: 'Languages', skills: ['Python', 'JavaScript', 'TypeScript', 'C', 'C++', 'C#'] },
  {
    title: 'Frameworks & Libraries',
    skills: ['React', 'React Native', 'Next.js', 'Node.js', 'Express.js', 'NestJS', 'Expo', 'Django', 'FastAPI'],
  },
  { title: 'Databases', skills: ['MySQL', 'PostgreSQL', 'MongoDB', 'SQLite'] },
  {
    title: 'Cloud & DevOps',
    skills: ['Azure', 'AWS', 'Firebase', 'Docker', 'Linux', 'GitHub Actions', 'DigitalOcean', 'Git', 'Terraform'],
  },
  {
    title: 'AI & ML',
    skills: ['PyTorch', 'TensorFlow', 'SK-Learn', 'Hugging Face', 'LangChain', 'LangGraph', 'OpenCV', 'ROS'],
  },
]
