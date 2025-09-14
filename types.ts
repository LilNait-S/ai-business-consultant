
// Vite environment variables
interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string
  readonly VITE_GEMINI_API_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

export interface DiscoveryData {
  currentSituation: string;
  goals: string;
  resources: string;
  competition: string;
  timeline: string;
  companyName?: string;
  industry?: string;
}

export interface AnalysisSection {
  title: string;
  points: string[];
}

export interface RoadmapDetail {
  initiative: string;
  resources: string[];
  timeline: string;
  kpis: string[];
  owner: string;
}

export interface StrategicInitiative {
  title: string;
  description: string;
  details: RoadmapDetail;
}

export interface StrategicPlan {
  analysis: {
    currentSituation: AnalysisSection;
    gaps: AnalysisSection;
    opportunities: AnalysisSection;
    risks: AnalysisSection;
  };
  strategy: {
    quickWins: StrategicInitiative[];
    strategicInitiatives: StrategicInitiative[];
    transformationalBets: StrategicInitiative[];
  };
  conclusion: string;
}

// Authentication and database types
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

export interface UserStats {
  totalStrategies: number
  strategiesThisMonth: number
  topIndustries: Array<{ industry: string; count: number }>
}

// Auth state types
export interface AuthState {
  user: any | null // Supabase User type
  loading: boolean
  session: any | null // Supabase Session type
}

// UI state types
export type ViewMode = 'form' | 'results' | 'history' | 'profile'

export interface AppState {
  viewMode: ViewMode
  discoveryData: DiscoveryData | null
  strategicPlan: StrategicPlan | null
  isLoading: boolean
  savedStrategies: SavedStrategy[]
  selectedStrategy: SavedStrategy | null
}
