type SkillCategory = {
  title: string
  skills: { name: string; icon: string }[]
}

export const skillCategories: SkillCategory[] = [
  {
    title: 'Languages',
    skills: [
      { name: 'Python', icon: '/icons/python.svg' },
      { name: 'JavaScript', icon: '/icons/javascript.svg' },
      { name: 'TypeScript', icon: '/icons/typescript.svg' },
      { name: 'C', icon: '/icons/c.svg' },
      { name: 'C++', icon: '/icons/cpp.svg' },
      { name: 'C#', icon: '/icons/csharp.svg' },
    ],
  },
  {
    title: 'Frameworks & Libraries',
    skills: [
      { name: 'React', icon: '/icons/react.svg' },
      { name: 'React Native', icon: '/icons/react.svg' },
      { name: 'Next.js', icon: '/icons/nextjs.svg' },
      { name: 'Node.js', icon: '/icons/nodejs.svg' },
      { name: 'Express.js', icon: '/icons/express.svg' },
      { name: 'NestJS', icon: '/icons/nestjs.svg' },
      { name: 'Expo', icon: '/icons/expo.svg' },
      { name: 'Django', icon: '/icons/django.svg' },
      { name: 'FastAPI', icon: '/icons/fastapi.svg' },
    ],
  },
  {
    title: 'Databases',
    skills: [
      { name: 'MySQL', icon: '/icons/mysql.svg' },
      { name: 'PostgreSQL', icon: '/icons/postgresql.svg' },
      { name: 'MongoDB', icon: '/icons/mongodb.svg' },
      { name: 'SQLite', icon: '/icons/sqlite.svg' },
    ],
  },
  {
    title: 'Cloud & DevOps',
    skills: [
      { name: 'Azure', icon: '/icons/azure.svg' },
      { name: 'AWS', icon: '/icons/aws.svg' },
      { name: 'Firebase', icon: '/icons/firebase.svg' },
      { name: 'Docker', icon: '/icons/docker.svg' },
      { name: 'Linux', icon: '/icons/linux.svg' },
      { name: 'Actions', icon: '/icons/github.svg' },
      { name: 'DigitalOcean', icon: '/icons/digitalocean.svg' },
      { name: 'Git', icon: '/icons/git.svg' },
      { name: 'Terraform', icon: '/icons/terraform.svg' },
    ],
  },
  {
    title: 'AI & ML',
    skills: [
      { name: 'PyTorch', icon: '/icons/pytorch.svg' },
      { name: 'TensorFlow', icon: '/icons/tensorflow.svg' },
      { name: 'SK-Learn', icon: '/icons/scikitlearn.svg' },
      { name: 'Hugging Face', icon: '/icons/huggingface.svg' },
      { name: 'LangChain', icon: '/icons/langchain.svg' },
      { name: 'LangGraph', icon: '/icons/langgraph.svg' },
      { name: 'OpenCV', icon: '/icons/opencv.svg' },
      { name: 'ROS', icon: '/icons/ros.svg' },
    ],
  },
]
