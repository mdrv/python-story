import type { UserProgress, Achievement } from '$lib/types.ts'
import { ACHIEVEMENTS } from '$lib/content/achievements.ts'

let progress = $state<UserProgress | null>(null)

export function getProgress(): UserProgress | null {
  return progress
}

export function initProgress(userId: string): UserProgress {
  const newProgress: UserProgress = {
    userId,
    completedChapters: {},
    completedScenes: {},
    completedLessons: {},
    completedExercises: {},
    achievements: [],
    currentStreak: 0,
    longestStreak: 0,
    totalTime: 0,
    lastActiveDate: null,
    conceptMastery: {}
  }
  progress = newProgress
  saveProgress()
  return newProgress
}

export function loadProgress(userId: string): UserProgress | null {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(`progress-${userId}`)
    if (saved) {
      progress = JSON.parse(saved)
      checkStreak()
      return progress
    }
  }
  return null
}

export function markChapterComplete(chapterId: string): void {
  if (progress) {
    progress.completedChapters[chapterId] = true
    saveProgress()
    checkAchievements()
  }
}

export function markSceneComplete(sceneId: string): void {
  if (progress) {
    progress.completedScenes[sceneId] = true
    saveProgress()
  }
}

export function markLessonComplete(lessonId: string): void {
  if (progress) {
    progress.completedLessons[lessonId] = true
    saveProgress()
  }
}

export function markExerciseComplete(
  exerciseId: string,
  attempts: number,
  solution: string
): void {
  if (progress) {
    progress.completedExercises[exerciseId] = { attempts, solution }
    progress.completedLessons[exerciseId] = true
    saveProgress()
    checkAchievements()
  }
}

export function addTimeSpent(seconds: number): void {
  if (progress) {
    progress.totalTime += seconds
    saveProgress()
  }
}

export function updateStreak(): void {
  if (progress) {
    const today = new Date().toDateString()
    const lastActive = progress.lastActiveDate ? new Date(progress.lastActiveDate).toDateString() : null

    if (lastActive === today) {
      return
    }

    const yesterday = new Date(Date.now() - 86400000).toDateString()
    if (lastActive === yesterday) {
      progress.currentStreak += 1
      if (progress.currentStreak > progress.longestStreak) {
        progress.longestStreak = progress.currentStreak
      }
    } else {
      progress.currentStreak = 1
    }

    progress.lastActiveDate = new Date()
    saveProgress()
    checkAchievements()
  }
}

export function getConceptMastery(concept: string): number {
  return progress?.conceptMastery[concept] || 0
}

export function updateConceptMastery(concept: string, amount: number): void {
  if (progress) {
    const current = progress.conceptMastery[concept] || 0
    progress.conceptMastery[concept] = Math.min(100, current + amount)
    saveProgress()
  }
}

export function getUnlockedAchievements(): Achievement[] {
  return progress?.achievements || []
}

export function isAchievementUnlocked(achievementId: string): boolean {
  return progress?.achievements.some((a) => a.id === achievementId) || false
}

export function unlockAchievement(achievementId: string): boolean {
  if (!progress || isAchievementUnlocked(achievementId)) {
    return false
  }

  const achievement = ACHIEVEMENTS.find((a) => a.id === achievementId)
  if (achievement) {
    progress.achievements.push({
      ...achievement,
      unlockedAt: new Date()
    })
    saveProgress()
    return true
  }
  return false
}

export function getCompletionPercentage(): number {
  if (!progress) return 0

  const totalExercises = Object.keys(ACHIEVEMENTS).length
  const completed = Object.keys(progress.completedExercises).length

  return totalExercises > 0 ? (completed / totalExercises) * 100 : 0
}

function checkStreak(): void {
  if (progress?.lastActiveDate) {
    const lastActive = new Date(progress.lastActiveDate).toDateString()
    const yesterday = new Date(Date.now() - 86400000).toDateString()

    if (lastActive !== yesterday && lastActive !== new Date().toDateString()) {
      progress.currentStreak = 0
      saveProgress()
    }
  }
}

function checkAchievements(): void {
  if (!progress) return

  if (!isAchievementUnlocked('chapter-1-complete') && progress.completedChapters['chapter-1']) {
    unlockAchievement('chapter-1-complete')
  }

  if (!isAchievementUnlocked('chapter-2-complete') && progress.completedChapters['chapter-2']) {
    unlockAchievement('chapter-2-complete')
  }

  if (!isAchievementUnlocked('chapter-3-complete') && progress.completedChapters['chapter-3']) {
    unlockAchievement('chapter-3-complete')
  }

  if (!isAchievementUnlocked('streak-3') && progress.currentStreak >= 3) {
    unlockAchievement('streak-3')
  }

  if (!isAchievementUnlocked('streak-7') && progress.currentStreak >= 7) {
    unlockAchievement('streak-7')
  }
}

function saveProgress(): void {
  if (progress && typeof window !== 'undefined') {
    localStorage.setItem(`progress-${progress.userId}`, JSON.stringify(progress))
  }
}
