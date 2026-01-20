export interface Character {
  id: string
  name: string
  avatar: string
  personality: string
}

export interface Choice {
  id: string
  text: string
  targetSceneId: string
  isRecommended?: boolean
}

export interface Challenge {
  type: 'exercise' | 'quiz'
  problem: string
  lesson: string
  starterCode?: string
  expectedOutput: string
  requiredPatterns?: string[]
  solution: string
  hints: string[]
}

export interface Scene {
  id: string
  chapterId: string
  text: string
  character?: Character
  challenge?: Challenge
  choices?: Choice[]
  requirements: string[]
}

export interface Chapter {
  id: string
  title: string
  description: string
  order: number
  scenes: Scene[]
  requirements: string[]
}

export interface Story {
  id: string
  title: string
  description: string
  chapters: Chapter[]
}

export interface Lesson {
  id: string
  chapterId: string
  title: string
  description: string
  sections: LessonSection[]
  concepts: string[]
  difficulty: 'beginner' | 'intermediate' | 'advanced'
}

export interface LessonSection {
  id: string
  type: 'text' | 'code' | 'exercise' | 'quiz'
  title?: string
  content: string
  codeExample?: string
  exercise?: Exercise
  quiz?: Quiz
}

export interface Exercise {
  id: string
  problem: string
  starterCode?: string
  expectedOutput: string
  hints: string[]
  solution: string
}

export interface Quiz {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
}

export interface UserProfile {
  id: string
  displayName: string
  avatar: string
  theme: 'light' | 'dark' | 'colorful'
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  createdAt: Date
  isGuest: boolean
}

export interface UserProgress {
  userId: string
  completedChapters: Record<string, boolean>
  completedScenes: Record<string, boolean>
  completedLessons: Record<string, boolean>
  completedExercises: Record<string, { attempts: number; solution: string }>
  achievements: Achievement[]
  currentStreak: number
  longestStreak: number
  totalTime: number
  lastActiveDate: Date | null
  conceptMastery: Record<string, number>
}

export interface Achievement {
  id: string
  title: string
  description: string
  unlockedAt: Date
  icon: string
}

export interface Badge {
  id: string
  name: string
  description: string
  icon: string
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
}

export interface CodeExecutionResult {
  output: string
  error: string | null
  executionTime: number
  variables: Record<string, any>
}
