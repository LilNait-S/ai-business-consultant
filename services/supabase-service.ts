import { createClient, type User, type Session } from '@supabase/supabase-js'
import type { DiscoveryData, StrategicPlan } from '../types'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for our database
export interface SavedStrategy {
  id: string
  user_id: string
  title: string
  discovery_data: DiscoveryData
  strategic_plan: StrategicPlan
  created_at: string
  updated_at: string
}

export interface UserProfile {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
  created_at: string
}

// Auth functions
export const signUp = async (email: string, password: string, fullName?: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  })

  if (error) throw error
  return data
}

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) throw error
  return data
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export const getCurrentUser = async (): Promise<User | null> => {
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error) throw error
  return user
}

export const getSession = async (): Promise<Session | null> => {
  const { data: { session }, error } = await supabase.auth.getSession()
  if (error) throw error
  return session
}

// Strategy functions
export const saveStrategy = async (
  title: string,
  discoveryData: DiscoveryData,
  strategicPlan: StrategicPlan
): Promise<SavedStrategy> => {
  // Get the current authenticated user
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  
  if (userError) {
    console.error('Error getting user:', userError)
    throw new Error('Error de autenticación: ' + userError.message)
  }
  
  if (!user) {
    throw new Error('Debes estar autenticado para guardar una estrategia')
  }

  const { data, error } = await supabase
    .from('strategies')
    .insert({
      title,
      discovery_data: discoveryData,
      strategic_plan: strategicPlan,
      user_id: user.id,
    })
    .select()
    .single()

  if (error) {
    console.error('Error saving strategy:', error)
    if (error.code === '23505') {
      throw new Error('Ya existe una estrategia con ese título')
    } else if (error.code === '42501') {
      throw new Error('No tienes permisos para guardar estrategias')
    } else {
      throw new Error('Error al guardar la estrategia: ' + error.message)
    }
  }
  
  return data
}

export const getUserStrategies = async (): Promise<SavedStrategy[]> => {
  // Get the current authenticated user
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  
  if (userError) {
    console.error('Error getting user:', userError)
    throw new Error('Error de autenticación: ' + userError.message)
  }
  
  if (!user) {
    throw new Error('Debes estar autenticado para ver tus estrategias')
  }

  const { data, error } = await supabase
    .from('strategies')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching strategies:', error)
    throw new Error('Error al obtener las estrategias: ' + error.message)
  }
  
  return data || []
}

export const getStrategy = async (id: string): Promise<SavedStrategy | null> => {
  const { data, error } = await supabase
    .from('strategies')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null // Not found
    throw error
  }
  return data
}

export const updateStrategy = async (
  id: string,
  updates: Partial<Pick<SavedStrategy, 'title' | 'discovery_data' | 'strategic_plan'>>
): Promise<SavedStrategy> => {
  const { data, error } = await supabase
    .from('strategies')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export const deleteStrategy = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('strategies')
    .delete()
    .eq('id', id)

  if (error) throw error
}

// Search strategies
export const searchStrategies = async (query: string): Promise<SavedStrategy[]> => {
  // Get the current authenticated user
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  
  if (userError) {
    console.error('Error getting user:', userError)
    throw new Error('Error de autenticación: ' + userError.message)
  }
  
  if (!user) {
    throw new Error('Debes estar autenticado para buscar estrategias')
  }

  const { data, error } = await supabase
    .from('strategies')
    .select('*')
    .eq('user_id', user.id)
    .or(`title.ilike.%${query}%, discovery_data->>companyName.ilike.%${query}%, discovery_data->>industry.ilike.%${query}%`)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error searching strategies:', error)
    throw new Error('Error al buscar estrategias: ' + error.message)
  }
  
  return data || []
}

// Get user statistics
export const getUserStats = async () => {
  // Get the current authenticated user
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  
  if (userError) {
    console.error('Error getting user:', userError)
    throw new Error('Error de autenticación: ' + userError.message)
  }
  
  if (!user) {
    throw new Error('Debes estar autenticado para ver estadísticas')
  }

  const { data: strategies, error } = await supabase
    .from('strategies')
    .select('created_at, discovery_data')
    .eq('user_id', user.id)

  if (error) {
    console.error('Error fetching user stats:', error)
    throw new Error('Error al obtener estadísticas: ' + error.message)
  }

  const totalStrategies = strategies?.length || 0
  const thisMonth = new Date()
  thisMonth.setDate(1)
  
  const strategiesThisMonth = strategies?.filter(s => 
    new Date(s.created_at) >= thisMonth
  ).length || 0

  const industries = strategies?.reduce((acc, s) => {
    const industry = s.discovery_data?.industry
    if (industry) {
      acc[industry] = (acc[industry] || 0) + 1
    }
    return acc
  }, {} as Record<string, number>) || {}

  return {
    totalStrategies,
    strategiesThisMonth,
    topIndustries: Object.entries(industries)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([industry, count]) => ({ industry, count }))
  }
}

// Listen to auth state changes
export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return supabase.auth.onAuthStateChange((event, session) => {
    callback(session?.user || null)
  })
}