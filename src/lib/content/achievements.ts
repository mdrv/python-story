import type { Achievement, Badge } from '$lib/types.ts'

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first-print',
    title: 'Hello World!',
    description: 'Successfully executed your first print statement',
    unlockedAt: new Date(),
    icon: '🎉'
  },
  {
    id: 'first-variable',
    title: 'Box Master',
    description: 'Created your first variable',
    unlockedAt: new Date(),
    icon: '📦'
  },
  {
    id: 'first-loop',
    title: 'Repeat Offender',
    description: 'Successfully wrote your first loop',
    unlockedAt: new Date(),
    icon: '🔄'
  },
  {
    id: 'first-conditional',
    title: 'Decision Maker',
    description: 'Successfully wrote your first if statement',
    unlockedAt: new Date(),
    icon: '🤔'
  },
  {
    id: 'chapter-1-complete',
    title: 'Explorer',
    description: 'Completed Chapter 1: Welcome to Python City',
    unlockedAt: new Date(),
    icon: '🏙️'
  },
  {
    id: 'chapter-2-complete',
    title: 'Loops Expert',
    description: 'Completed Chapter 2: Looping Around Town',
    unlockedAt: new Date(),
    icon: '🔁'
  },
  {
    id: 'chapter-3-complete',
    title: 'Decision Master',
    description: 'Completed Chapter 3: Making Decisions',
    unlockedAt: new Date(),
    icon: '⚖️'
  },
  {
    id: 'streak-3',
    title: 'On Fire!',
    description: 'Coded for 3 days in a row',
    unlockedAt: new Date(),
    icon: '🔥'
  },
  {
    id: 'streak-7',
    title: 'Dedicated Coder',
    description: 'Coded for 7 days in a row',
    unlockedAt: new Date(),
    icon: '💪'
  },
  {
    id: 'all-exercises',
    title: 'Completionist',
    description: 'Completed all exercises',
    unlockedAt: new Date(),
    icon: '🏆'
  }
]

export const BADGES: Badge[] = [
  {
    id: 'python-explorer',
    name: 'Python Explorer',
    description: 'Started your journey in Python City',
    icon: '🗺️',
    rarity: 'common'
  },
  {
    id: 'variable-wizard',
    name: 'Variable Wizard',
    description: 'Mastered storing data in variables',
    icon: '🧙',
    rarity: 'rare'
  },
  {
    id: 'loop-master',
    name: 'Loop Master',
    description: 'Can loop through anything',
    icon: '🌀',
    rarity: 'rare'
  },
  {
    id: 'conditional-champion',
    name: 'Conditional Champion',
    description: 'Makes decisions like a pro',
    icon: '👑',
    rarity: 'rare'
  },
  {
    id: 'story-master',
    name: 'Story Master',
    description: 'Completed all chapters',
    icon: '📚',
    rarity: 'epic'
  },
  {
    id: 'legendary-coder',
    name: 'Legendary Coder',
    description: 'Completed all exercises with 100% accuracy',
    icon: '⭐',
    rarity: 'legendary'
  }
]
