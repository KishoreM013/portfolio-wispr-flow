import { profile } from './collection'

export type RoomId =
  | 'skills'
  | 'volunteering'
  | 'contributions'
  | 'writing'
  | 'hobbies'
  | 'projects'
  | 'accounts'
  | 'achievements'
  | 'vip'
  | 'management'
  | 'basement'

export type Room = {
  id: RoomId
  name: string
  path: string
  floor: string
  icon: string
  tagline: string
  guideLine: string
  staffOnly?: boolean
}

export const site = {
  name: 'Kishore M',
  title: 'The Museum of Kishore',
  description:
    'A small museum of my life, work and personality. Walk in, look around, and take your time.',
  email: 'kishoremohan1307@gmail.com',
  linkedin: 'https://www.linkedin.com/in/kishore-mohan-979a0a28b/',
  github: 'https://github.com/KishoreM013',
  location: 'Chennai, India',
}

/** The ten wings of the museum. */
export const rooms: Room[] = [
  {
    id: 'skills',
    name: 'Skills',
    path: '/skills',
    floor: 'Ground floor · Gallery 01',
    icon: 'trophy',
    tagline: 'A universe of skills',
    guideLine: 'Every skill has its own orbit. Select a planet to explore.',
  },
  {
    id: 'volunteering',
    name: 'Volunteering',
    path: '/volunteering',
    floor: 'Ground floor · Gallery 02',
    icon: 'heart',
    tagline: 'People I have taught',
    guideLine: 'The frames here are not awards. They are people.',
  },
  {
    id: 'contributions',
    name: 'Contributions',
    path: '/contributions',
    floor: 'Ground floor · Gallery 03',
    icon: 'git',
    tagline: 'Work that lives outside my résumé',
    guideLine: 'Small contributions, mostly. All of them real.',
  },
  {
    id: 'writing',
    name: 'Writing & Songs',
    path: '/writing',
    floor: 'Ground floor · Gallery 04',
    icon: 'feather',
    tagline: 'Words and music',
    guideLine: 'This room is quiet. Take your time in here.',
  },
  {
    id: 'hobbies',
    name: 'Hobby & More About Me',
    path: '/hobbies',
    floor: 'Ground floor · Gallery 05',
    icon: 'sparkles',
    tagline: 'The person behind the projects',
    guideLine: 'A room for the interests, habits and little details that make me me.',
  },
  {
    id: 'projects',
    name: 'Projects',
    path: '/projects',
    floor: 'Upper floor · Gallery 06',
    icon: 'frame',
    tagline: 'Things I built, including the failures',
    guideLine: 'One of these paintings is a lesson, not a win.',
  },
  {
    id: 'accounts',
    name: 'Accounts',
    path: '/accounts',
    floor: 'Upper floor · Gallery 07',
    icon: 'badge',
    tagline: 'Where to find me online',
    guideLine: 'Sign the visitor book before you go.',
  },
  {
    id: 'achievements',
    name: 'Achievements',
    path: '/achievements',
    floor: 'Upper floor · Central Gallery 08',
    icon: 'medal',
    tagline: 'Milestones worth remembering',
    guideLine: 'A record of competitions, badges, prizes and breakthroughs.',
  },
  {
    id: 'vip',
    name: 'VIP Pass',
    path: '/vip',
    floor: 'Upper floor · Gallery 09',
    icon: 'ticket',
    tagline: 'Experience and the next chapter',
    guideLine: 'The experiences that shaped the work, and where I hope to go next.',
  },
  {
    id: 'management',
    name: 'Management Room',
    path: '/management',
    floor: 'Upper floor · Gallery 10',
    icon: 'wrench',
    tagline: 'The curator’s study and credentials',
    guideLine: 'Every collection begins with learning. These are some of my foundations.',
  },
  {
    id: 'basement',
    name: 'Failed Ideas',
    path: '/basement',
    floor: 'Basement · Archive B1',
    icon: 'archive',
    tagline: 'Experiments, dead ends and lessons',
    guideLine: 'Not every idea became a project. That is part of the story.',
  },
]

export const roomIds = rooms.map((room) => room.id)

export const getRoom = (id: RoomId) => rooms.find((room) => room.id === id)!

export const entrance = {
  plaque: 'Welcome to the Museum of Kishore',
  hint: 'Scroll to enter',
  skip: 'Skip intro',
  enter: 'Enter the museum',
  hours: 'Open daily · Always free',
}

export const hall = {
  title: "Welcome to Kishore's Portfolio",
  intro:
    profile.summary,
}

/** Copy for the tour guide, keyed by room. */
export const guide = {
  name: 'Kishore',
  hall: "Hi, I'm Kishore. Pick a path and I'll show you around.",
}
