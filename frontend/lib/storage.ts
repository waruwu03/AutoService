/**
 * Storage utilities for localStorage/sessionStorage with type safety
 */

const isBrowser = typeof window !== 'undefined'

// Storage keys constants
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER: 'user',
  USER_ROLE: 'user_role',
  THEME: 'theme',
  SIDEBAR_STATE: 'sidebar_state',
} as const

type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS]

/**
 * Get item from localStorage
 */
export function getStorageItem<T>(key: StorageKey): T | null {
  if (!isBrowser) return null
  
  try {
    const item = localStorage.getItem(key)
    if (!item) return null
    return JSON.parse(item) as T
  } catch {
    return null
  }
}

/**
 * Set item to localStorage
 */
export function setStorageItem<T>(key: StorageKey, value: T): void {
  if (!isBrowser) return
  
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error(`Error setting storage item ${key}:`, error)
  }
}

/**
 * Remove item from localStorage
 */
export function removeStorageItem(key: StorageKey): void {
  if (!isBrowser) return
  localStorage.removeItem(key)
}

/**
 * Clear all auth-related storage
 */
export function clearAuthStorage(): void {
  if (!isBrowser) return
  
  removeStorageItem(STORAGE_KEYS.ACCESS_TOKEN)
  removeStorageItem(STORAGE_KEYS.REFRESH_TOKEN)
  removeStorageItem(STORAGE_KEYS.USER)
  removeStorageItem(STORAGE_KEYS.USER_ROLE)
}

/**
 * Get access token
 */
export function getAccessToken(): string | null {
  return getStorageItem<string>(STORAGE_KEYS.ACCESS_TOKEN)
}

/**
 * Set access token
 */
export function setAccessToken(token: string): void {
  setStorageItem(STORAGE_KEYS.ACCESS_TOKEN, token)
}

/**
 * Get refresh token
 */
export function getRefreshToken(): string | null {
  return getStorageItem<string>(STORAGE_KEYS.REFRESH_TOKEN)
}

/**
 * Set refresh token
 */
export function setRefreshToken(token: string): void {
  setStorageItem(STORAGE_KEYS.REFRESH_TOKEN, token)
}

/**
 * Cookie utilities for SSR compatibility
 */
export const cookies = {
  get(name: string): string | null {
    if (!isBrowser) return null
    
    const value = `; ${document.cookie}`
    const parts = value.split(`; ${name}=`)
    if (parts.length === 2) {
      return parts.pop()?.split(';').shift() || null
    }
    return null
  },

  set(name: string, value: string, days = 7): void {
    if (!isBrowser) return
    
    const expires = new Date()
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000)
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Strict`
  },

  remove(name: string): void {
    if (!isBrowser) return
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`
  },
}
