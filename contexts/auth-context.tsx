import type { User } from "@supabase/supabase-js"
import React, { createContext, useContext, useEffect, useState } from "react"
import {
  getCurrentUser,
  getSession,
  onAuthStateChange,
  signIn,
  signOut,
  signUp,
} from "../services/supabase-service"
import type { AuthState } from "../types"

interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, fullName?: string) => Promise<void>
  signOut: () => Promise<void>
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

interface AuthProviderProps {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    session: null,
  })

  useEffect(() => {
    // Initialize auth state
    const initializeAuth = async () => {
      try {
        const [user, session] = await Promise.all([
          getCurrentUser(),
          getSession(),
        ])

        setState({
          user,
          session,
          loading: false,
        })
      } catch (error) {
        console.error("Error initializing auth:", error)
        setState((prev) => ({ ...prev, loading: false }))
      }
    }

    initializeAuth()

    // Listen for auth changes
    const {
      data: { subscription },
    } = onAuthStateChange((user: User | null) => {
      setState((prev) => ({
        ...prev,
        user,
        loading: false,
      }))
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleSignIn = async (email: string, password: string) => {
    try {
      setState((prev) => ({ ...prev, loading: true }))
      await signIn(email, password)
      // State will be updated by the onAuthStateChange listener
    } catch (error) {
      setState((prev) => ({ ...prev, loading: false }))
      throw error
    }
  }

  const handleSignUp = async (
    email: string,
    password: string,
    fullName?: string
  ) => {
    try {
      setState((prev) => ({ ...prev, loading: true }))
      await signUp(email, password, fullName)
      // State will be updated by the onAuthStateChange listener
    } catch (error) {
      setState((prev) => ({ ...prev, loading: false }))
      throw error
    }
  }

  const handleSignOut = async () => {
    try {
      setState((prev) => ({ ...prev, loading: true }))
      await signOut()
      setState({
        user: null,
        session: null,
        loading: false,
      })
    } catch (error) {
      setState((prev) => ({ ...prev, loading: false }))
      throw error
    }
  }

  const value: AuthContextType = {
    ...state,
    signIn: handleSignIn,
    signUp: handleSignUp,
    signOut: handleSignOut,
    isAuthenticated: !!state.user,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
