export type SkillCategory = 'Languages' | 'Core concepts' | 'Tools'
export type Skill = { id: string; name: string; logo: string; category: SkillCategory; stars: 1 | 2 | 3 | 4 | 5; duration: string; example: string; provisional?: boolean }
export const levels = ['Expert', 'Strong', 'Comfortable', 'Learning', 'Exploring'] as const
export const categoryColors: Record<SkillCategory, string> = { Languages: '#71b4f3', 'Core concepts': '#b294ec', Tools: '#d6b777' }

// Inventory and project examples come from the résumé; star levels are Kishore's self-ratings.
const skill = (id: string, name: string, category: SkillCategory, example = 'Listed in the résumé; a specific project example has not yet been supplied.', duration = 'Start date not specified in the résumé', stars: Skill['stars'] = 3): Skill => ({ id, name, logo: id, category, stars, duration, example })
export const skills: Skill[] = [
  skill('python', 'Python', 'Languages', 'AI-Powered Legal Contract Review System: local contract analysis with RAG and Ollama.', 'Project documented in 2025', 5),
  skill('cpp', 'C / C++', 'Languages', 'Taught C programming to juniors, five classes per week over one month.', 'Start date not specified in the résumé', 5),
  skill('csharp', 'C#', 'Languages', 'AI-Powered Feedback Resolution Agent, built with C#, .NET and Ollama.', 'Project documented in 2025', 3),
  skill('java', 'Java', 'Languages', 'Listed as Java (basics) in the résumé.', 'Start date not specified in the résumé', 4),
  skill('javascript', 'JavaScript', 'Languages', 'TGK Learning: six interactive data structure playgrounds.', 'Project documented in 2025', 4),
  skill('typescript', 'TypeScript', 'Languages', 'Used in the Codetgk terminal coding agent.', 'Project documented in 2026', 4),
  skill('go', 'Go', 'Languages', undefined, undefined, 3),
  skill('sql', 'SQL', 'Languages', undefined, undefined, 4),
  skill('htmlcss', 'HTML / CSS', 'Languages', 'TGK Learning: browser-based visual learning platform hosted on Netlify.', 'Project documented in 2025', 5),
  skill('dart', 'Dart', 'Languages', undefined, undefined, 4),
  skill('pytorch', 'PyTorch', 'Tools', 'FILM-inspired satellite frame interpolation model; achieved 0.832 SSIM.', 'Project documented in 2025', 4),
  skill('tensorflow', 'TensorFlow', 'Tools', undefined, undefined, 3),
  skill('genai', 'Generative AI', 'Core concepts', 'Local AI workflows in the contract review system and feedback resolution agent.', 'Certification documented in 2024', 4),
  skill('vit', 'Vision Transformers', 'Core concepts', undefined, undefined, 3),
  skill('rag', 'RAG / CAG', 'Core concepts', 'Contract review system: retrieval-grounded answers in 7+ languages across four input types.', 'Project documented in 2025', 4),
  skill('mcp', 'MCP', 'Core concepts', undefined, undefined, 4),
  skill('ollama', 'Ollama', 'Tools', 'On-device inference for legal contract review and the feedback resolution agent.', 'Projects documented in 2025', 3),
  skill('git', 'Git', 'Tools', undefined, undefined, 5),
  skill('github', 'GitHub', 'Tools', 'Public development profile: github.com/KishoreM013.', 'Start date not specified in the résumé', 5),
  skill('flutter', 'Flutter', 'Tools', undefined, undefined, 4),
  skill('firebase', 'Firebase', 'Tools', undefined, undefined, 3),
  skill('mongodb', 'MongoDB', 'Tools', undefined, undefined, 3),
  skill('colab', 'Google Colab', 'Tools', undefined, undefined, 5),
  skill('linux', 'Linux', 'Tools', undefined, undefined, 4),
  skill('cuda', 'CUDA', 'Tools', 'GPU acceleration for custom PyTorch modules in the satellite interpolation project.', 'Project documented in 2025', 3),
  skill('ghidra', 'Ghidra', 'Tools', 'Recently learned for reverse engineering and binary analysis.', 'Recently learned', 3),
  skill('dsa', 'Data Structures & Algorithms', 'Core concepts', 'TGK Learning visualises six structures; the résumé records 1,000+ LeetCode problems solved.', 'Start date not specified in the résumé', 5),
  skill('oop', 'Object-Oriented Programming', 'Core concepts', undefined, undefined, 5),
  skill('problem-solving', 'Problem Solving', 'Core concepts', 'Turning ambiguous requirements into workable, testable solutions.', 'Ongoing engineering practice', 4),
  skill('debugging', 'Debugging', 'Core concepts', 'Finding the actual cause behind a failing build, test or feature.', 'Ongoing engineering practice', 4),
  skill('communication', 'Communication', 'Core concepts', 'Explaining ideas, documenting work and collaborating clearly.', 'Ongoing engineering practice', 4),
  skill('teamwork', 'Teamwork', 'Core concepts', 'Sharing ownership and helping a project move forward with other people.', 'Ongoing engineering practice', 5),
  skill('songwriting', 'Songwriting', 'Core concepts', 'Writing original lyrics and songs for the TGK Prime music collection.', 'Personal creative practice', 5),
  skill('walking', 'Walking', 'Core concepts', 'Grand-tour stamina for long museum corridors, dramatic pacing and thinking walks.', 'A lifelong skill', 5),
]
export const featuredSkillIds = ['python', 'cpp', 'csharp', 'java', 'javascript', 'pytorch', 'genai', 'rag', 'ollama', 'cuda', 'ghidra', 'dsa', 'songwriting', 'walking']
