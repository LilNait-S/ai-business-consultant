import React, { useState } from "react"
import { AuthModal, UserMenu } from "./components/auth"
import { DiscoveryForm } from "./components/discovery-form"

import { LoadingDisplay } from "./components/loading-display"
import { ResultsDisplay } from "./components/results-display"
import { SaveStrategyModal } from "./components/save-strategy-modal"
import { StrategyHistory } from "./components/strategy-history"
import { Alert, AlertDescription } from "./components/ui/alert"
import { Badge } from "./components/ui/badge"
import { Button } from "./components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "./components/ui/tabs"
import { UserProfile } from "./components/user-profile"
import { AuthProvider, useAuth } from "./contexts/auth-context"
import { generateStrategicPlan } from "./services/gemini-service"
import type { AppState, DiscoveryData, SavedStrategy, ViewMode } from "./types"
import { ThemeProvider } from "./components/theme-provider"
import { Header } from "./components/header"

function AppContent() {
  const { user, isAuthenticated, loading: authLoading, signOut } = useAuth()

  const [state, setState] = useState<AppState>({
    viewMode: "form",
    discoveryData: null,
    strategicPlan: null,
    isLoading: false,
    savedStrategies: [],
    selectedStrategy: null,
  })

  const [error, setError] = useState<string | null>(null)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showSaveModal, setShowSaveModal] = useState(false)

  const handleFormSubmit = async (data: DiscoveryData) => {
    setState((prev) => ({ ...prev, isLoading: true }))
    setError(null)

    try {
      const plan = await generateStrategicPlan(data)
      setState((prev) => ({
        ...prev,
        discoveryData: data,
        strategicPlan: plan,
        viewMode: "results",
        isLoading: false,
      }))
    } catch (e) {
      console.error(e)
      setError(
        "Error al generar el plan estratégico. Por favor, revisa la consola para más detalles."
      )
      setState((prev) => ({ ...prev, isLoading: false }))
    }
  }

  const handleReset = () => {
    setState((prev) => ({
      ...prev,
      viewMode: "form",
      discoveryData: null,
      strategicPlan: null,
      selectedStrategy: null,
    }))
    setError(null)
  }

  const handleSelectStrategy = (strategy: SavedStrategy) => {
    setState((prev) => ({
      ...prev,
      selectedStrategy: strategy,
      discoveryData: strategy.discovery_data,
      strategicPlan: strategy.strategic_plan,
      viewMode: "results",
    }))
  }

  const handleSaveStrategy = () => {
    if (!isAuthenticated) {
      setShowAuthModal(true)
      return
    }
    setShowSaveModal(true)
  }

  const handleStrategySaved = () => {
    // Refresh strategies if we're in history view
    if (state.viewMode === "history") {
      // The StrategyHistory component will handle refreshing
    }
  }

  const setViewMode = (mode: ViewMode) => {
    setState((prev) => ({ ...prev, viewMode: mode }))
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div>
          <p className="text-sm text-muted-foreground">Cargando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Modern Navigation */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container max-w-screen-2xl px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <Tabs
              value={state.viewMode}
              onValueChange={(value) => setViewMode(value as ViewMode)}
            >
              <TabsList className="grid w-full grid-cols-1 md:w-auto md:grid-cols-3">
                <TabsTrigger
                  value="form"
                  className="px-4 py-2 text-sm font-medium"
                >
                  Nueva Estrategia
                </TabsTrigger>
                {isAuthenticated && (
                  <>
                    <TabsTrigger
                      value="history"
                      className="px-4 py-2 text-sm font-medium"
                    >
                      Mis Estrategias
                    </TabsTrigger>
                    <TabsTrigger
                      value="profile"
                      className="px-4 py-2 text-sm font-medium"
                    >
                      Perfil
                    </TabsTrigger>
                  </>
                )}
              </TabsList>
            </Tabs>

            <div className="flex items-center space-x-3">
              {state.strategicPlan && state.discoveryData && (
                <Button
                  onClick={handleSaveStrategy}
                  size="sm"
                  className="shadow-lg transition-all duration-200 hover:shadow-xl"
                >
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                  Guardar Estrategia
                </Button>
              )}

              {isAuthenticated ? (
                <UserMenu
                  user={user}
                  onSignOut={signOut}
                  onProfileClick={() => setViewMode("profile")}
                />
              ) : (
                <Button
                  onClick={() => setShowAuthModal(true)}
                  size="sm"
                  className="shadow-lg transition-all duration-200 hover:shadow-xl"
                >
                  Iniciar Sesión
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <main className="container max-w-screen-2xl mx-auto px-6 lg:px-8 py-8">
        {/* Form View */}
        {state.viewMode === "form" && !state.isLoading && (
          <div className="max-w-4xl mx-auto">
            <DiscoveryForm onSubmit={handleFormSubmit} />
          </div>
        )}

        {/* Loading */}
        {state.isLoading && (
          <div className="max-w-2xl mx-auto">
            <LoadingDisplay />
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="max-w-2xl mx-auto">
            <Alert variant="destructive">
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <AlertDescription className="flex flex-col space-y-4">
                <span>{error}</span>
                <Button
                  onClick={handleReset}
                  variant="outline"
                  size="sm"
                  className="w-fit"
                >
                  Comenzar de Nuevo
                </Button>
              </AlertDescription>
            </Alert>
          </div>
        )}

        {/* Results View */}
        {state.viewMode === "results" &&
          state.strategicPlan &&
          !state.isLoading && (
            <div className="max-w-6xl mx-auto space-y-6">
              {state.selectedStrategy && (
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center space-x-3">
                      <Badge
                        variant="secondary"
                        className="bg-primary/10 text-primary"
                      >
                        Estrategia Guardada
                      </Badge>
                      <div>
                        <CardTitle className="text-base">
                          {state.selectedStrategy.title}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                          Creada el{" "}
                          {new Date(
                            state.selectedStrategy.created_at
                          ).toLocaleDateString("es-ES")}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              )}
              <ResultsDisplay
                plan={state.strategicPlan}
                onReset={handleReset}
              />
            </div>
          )}

        {/* History View */}
        {state.viewMode === "history" && isAuthenticated && (
          <div className="max-w-6xl mx-auto">
            <StrategyHistory
              onSelectStrategy={handleSelectStrategy}
              onNewStrategy={() => setViewMode("form")}
            />
          </div>
        )}

        {/* Profile View */}
        {state.viewMode === "profile" && isAuthenticated && (
          <div className="max-w-4xl mx-auto">
            <UserProfile onBackToHistory={() => setViewMode("history")} />
          </div>
        )}

        {/* Prompt to sign in when viewing history/profile without auth */}
        {(state.viewMode === "history" || state.viewMode === "profile") &&
          !isAuthenticated && (
            <div className="max-w-md mx-auto">
              <Card>
                <CardHeader className="text-center">
                  <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <svg
                      className="w-8 h-8 text-primary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  <CardTitle>Iniciar Sesión Requerido</CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <p className="text-muted-foreground">
                    Por favor inicia sesión para ver tus estrategias guardadas y
                    perfil.
                  </p>
                  <Button onClick={() => setShowAuthModal(true)}>
                    Iniciar Sesión
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
      </main>

      {/* Modals */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />

      {showSaveModal && state.strategicPlan && state.discoveryData && (
        <SaveStrategyModal
          isOpen={showSaveModal}
          onClose={() => setShowSaveModal(false)}
          discoveryData={state.discoveryData}
          strategicPlan={state.strategicPlan}
          onSaved={handleStrategySaved}
        />
      )}
    </div>
  )
}

export default function Application() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  )
}
