import React from "react"
import { Badge } from "./ui/badge"
import { Card } from "./ui/card"

export const Header: React.FC = () => {
  return (
    <header className="relative border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container max-w-screen-2xl mx-auto px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-lg">
                <svg
                  className="w-7 h-7 text-primary-foreground"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
            </div>
            <div className="space-y-1">
              <h1 className="text-3xl font-bold tracking-tight">
                StrategyGPT
              </h1>
              <div className="flex items-center space-x-2">
                <div className="h-1 w-8 bg-primary rounded-full"></div>
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  AI Business Consultant
                </span>
              </div>
            </div>
          </div>
          
          <div className="hidden lg:flex items-center space-x-3">
            <Badge variant="secondary" className="px-4 py-2">
              Consultor de Negocios AI
              <span className="ml-2 text-primary font-semibold">McKinsey Level</span>
            </Badge>
          </div>
        </div>
      </div>
    </header>
  )
}
