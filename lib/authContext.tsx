'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

interface User {
  usrId: number
  login: string
  firstName: string
  lastName: string
  roles: string[]
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  logout: () => Promise<void>
  refreshAuth: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5555'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/Auth/me`, {
          credentials: 'include'
        })

        if (res.ok) {
          const userData = await res.json()
          setUser(userData)
        } else {
          setUser(null)
        }
      } catch (err) {
        console.error('Auth check failed:', err)
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  const logout = async () => {
    try {
      await fetch(`${BASE_URL}/api/Auth/logout`, {
        method: 'POST',
        credentials: 'include'
      })
    } catch (err) {
      console.error('Logout failed:', err)
    } finally {
      setUser(null)
    }
  }

  const refreshAuth = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/Auth/me`, {
        credentials: 'include'
      })

      if (res.ok) {
        const userData = await res.json()
        setUser(userData)
      } else {
        setUser(null)
      }
    } catch (err) {
      console.error('Auth refresh failed:', err)
      setUser(null)
    }
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, isAuthenticated: !!user, logout, refreshAuth }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
