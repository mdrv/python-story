import type { UserProfile } from '$lib/types.ts'

let currentUser = $state<UserProfile | null>(null)
let profiles = $state<UserProfile[]>([])

const AVATARS = ['👦', '👧', '🧑', '👨', '👩', '🧒', '👶', '🦸', '🦸‍♀️', '🧙', '🧙‍♀️']

export function getCurrentUser() {
  return currentUser
}

export function setCurrentUser(user: UserProfile | null): void {
  currentUser = user
  if (user) {
    saveProfiles()
    saveCurrentUser()
  }
}

export function createProfile(displayName: string, avatar: string): UserProfile {
  const profile: UserProfile = {
    id: `user-${Date.now()}`,
    displayName,
    avatar,
    theme: 'light',
    difficulty: 'beginner',
    createdAt: new Date(),
    isGuest: false
  }
  profiles.push(profile)
  currentUser = profile
  saveProfiles()
  return profile
}

export function createGuestProfile(): UserProfile {
  const profile: UserProfile = {
    id: `guest-${Date.now()}`,
    displayName: 'Guest',
    avatar: '👤',
    theme: 'light',
    difficulty: 'beginner',
    createdAt: new Date(),
    isGuest: true
  }
  currentUser = profile
  return profile
}

export function updateProfile(updates: Partial<UserProfile>): void {
  if (currentUser) {
    Object.assign(currentUser, updates)
    saveProfiles()
  }
}

export function deleteProfile(profileId: string): void {
  profiles = profiles.filter((p) => p.id !== profileId)
  if (currentUser?.id === profileId) {
    currentUser = null
  }
  saveProfiles()
}

export function getProfiles(): UserProfile[] {
  return profiles
}

export function getAvatars(): string[] {
  return AVATARS
}

function saveProfiles(): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('profiles', JSON.stringify(profiles))
  }
}

function saveCurrentUser(): void {
  if (typeof window !== 'undefined') {
    if (currentUser) {
      localStorage.setItem('currentUser', JSON.stringify(currentUser))
    } else {
      localStorage.removeItem('currentUser')
    }
  }
}

function loadProfiles(): void {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('profiles')
    if (saved) {
      profiles = JSON.parse(saved)
    }
    const savedUser = localStorage.getItem('currentUser')
    if (savedUser) {
      currentUser = JSON.parse(savedUser)
    }
  }
}

loadProfiles()
