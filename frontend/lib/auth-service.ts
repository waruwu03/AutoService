import { api } from './api-client'
import { 
  setAccessToken, 
  setRefreshToken, 
  clearAuthStorage, 
  setStorageItem, 
  getStorageItem,
  cookies,
  STORAGE_KEYS 
} from './storage'
import type { User, LoginCredentials, LoginResponse, ApiResponse } from '@/types'

/**
 * Authentication service for handling login, logout, and user management
 */
export const authService = {
  /**
   * Login user with credentials
   */
  async login(credentials: LoginCredentials): Promise<User> {
    const response = await api.post<ApiResponse<LoginResponse>>('/auth/login', credentials)
    
    const { user, tokens } = response.data

    // Store tokens
    setAccessToken(tokens.access_token)
    setRefreshToken(tokens.refresh_token)
    setStorageItem(STORAGE_KEYS.USER, user)
    setStorageItem(STORAGE_KEYS.USER_ROLE, user.role)

    // Set cookies for middleware
    cookies.set('access_token', tokens.access_token)
    cookies.set('user_role', user.role)

    return user
  },

  /**
   * Logout current user
   */
  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout')
    } catch {
      // Ignore logout errors
    } finally {
      clearAuthStorage()
      cookies.remove('access_token')
      cookies.remove('user_role')
    }
  },

  /**
   * Get current user from storage
   */
  getCurrentUser(): User | null {
    return getStorageItem<User>(STORAGE_KEYS.USER)
  },

  /**
   * Get current user from API
   */
  async fetchCurrentUser(): Promise<User> {
    const response = await api.get<ApiResponse<User>>('/auth/me')
    const user = response.data
    
    setStorageItem(STORAGE_KEYS.USER, user)
    setStorageItem(STORAGE_KEYS.USER_ROLE, user.role)
    cookies.set('user_role', user.role)
    
    return user
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    const user = this.getCurrentUser()
    const token = cookies.get('access_token')
    return !!(user && token)
  },

  /**
   * Update user profile
   */
  async updateProfile(data: Partial<User>): Promise<User> {
    const response = await api.put<ApiResponse<User>>('/auth/profile', data)
    const user = response.data
    
    setStorageItem(STORAGE_KEYS.USER, user)
    
    return user
  },

  /**
   * Change password
   */
  async changePassword(data: {
    current_password: string
    new_password: string
    new_password_confirmation: string
  }): Promise<void> {
    await api.post('/auth/change-password', data)
  },

  /**
   * Request password reset
   */
  async forgotPassword(email: string): Promise<void> {
    await api.post('/auth/forgot-password', { email })
  },

  /**
   * Reset password with token
   */
  async resetPassword(data: {
    token: string
    email: string
    password: string
    password_confirmation: string
  }): Promise<void> {
    await api.post('/auth/reset-password', data)
  },
}

export default authService
