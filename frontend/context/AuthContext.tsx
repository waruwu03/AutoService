'use client'

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import authService from '@/lib/auth-service'
import type { User, LoginCredentials, UserRole } from '@/types'

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (credentials: LoginCredentials) => Promise<void>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
  hasRole: (roles: UserRole | UserRole[]) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedUser = authService.getCurrentUser()
        if (storedUser) {
          setUser(storedUser)
          // Verify token is still valid
          try {
            const freshUser = await authService.fetchCurrentUser()
            setUser(freshUser)
          } catch {
            // Token invalid, clear auth
            await authService.logout()
            setUser(null)
          }
        }
      } catch {
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    initAuth()
  }, [])

  const login = useCallback(async (credentials: LoginCredentials) => {
    setIsLoading(true)
    try {
      const loggedInUser = await authService.login(credentials)
      setUser(loggedInUser)
      
      // Redirect based on role
      const dashboardRoutes: Record<UserRole, string> = {
        admin: '/admin',
        kasir: '/admin',
        mekanik: '/mekanik',
        gudang: '/gudang',
        pimpinan: '/pimpinan',
      }
      
      router.push(dashboardRoutes[loggedInUser.role] || '/admin')
    } finally {
      setIsLoading(false)
    }
  }, [router])

  const logout = useCallback(async () => {
    setIsLoading(true)
    try {
      await authService.logout()
      setUser(null)
      router.push('/login')
    } finally {
      setIsLoading(false)
    }
  }, [router])

  const refreshUser = useCallback(async () => {
    try {
      const freshUser = await authService.fetchCurrentUser()
      setUser(freshUser)
    } catch {
      setUser(null)
    }
  }, [])

  const hasRole = useCallback((roles: UserRole | UserRole[]): boolean => {
    if (!user) return false
    const roleArray = Array.isArray(roles) ? roles : [roles]
    return roleArray.includes(user.role)
  }, [user])

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    refreshUser,
    hasRole,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export default AuthContext
