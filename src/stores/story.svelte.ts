import type { Story, Chapter, Scene } from '$lib/types.ts'
import { getStory, getChapter as getChapterById } from '$lib/content/story.ts'

let currentStory = $state<Story>(getStory())
let currentChapter = $state<Chapter | null>(null)
let currentScene = $state<Scene | null>(null)
let sceneHistory = $state<string[]>([])

export function getStoryState(): Story {
  return currentStory
}

export function getChapterState(): Chapter | null {
  return currentChapter
}

export function getSceneState(): Scene | null {
  return currentScene
}

export function getSceneHistory(): string[] {
  return sceneHistory
}

export function setChapter(chapterId: string): void {
  const chapter = getChapterById(chapterId)
  if (chapter) {
    currentChapter = chapter
    currentScene = chapter.scenes[0] || null
    sceneHistory = []
  }
}

export function setScene(sceneId: string): void {
  if (currentChapter) {
    const scene = currentChapter.scenes.find((s) => s.id === sceneId)
    if (scene) {
      sceneHistory.push(currentScene?.id || '')
      currentScene = scene
    }
  }
}

export function goToPreviousScene(): void {
  const previousSceneId = sceneHistory.pop()
  if (previousSceneId && currentChapter) {
    const scene = currentChapter.scenes.find((s) => s.id === previousSceneId)
    if (scene) {
      currentScene = scene
    }
  }
}

export function resetStory(): void {
  currentChapter = null
  currentScene = null
  sceneHistory = []
}

export function getNextScene(): Scene | null {
  if (!currentChapter || !currentScene) return null

  const currentIndex = currentChapter.scenes.findIndex((s) => s.id === currentScene?.id)
  if (currentIndex < currentChapter.scenes.length - 1) {
    return currentChapter.scenes[currentIndex + 1]
  }
  return null
}

export function goToNextScene(): void {
  const nextScene = getNextScene()
  if (nextScene) {
    sceneHistory.push(currentScene?.id || '')
    currentScene = nextScene
  }
}
