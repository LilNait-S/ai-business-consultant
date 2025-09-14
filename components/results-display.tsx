import React, { useState } from "react"
import { Button } from "./ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible"
import { Badge } from "./ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import type {
  StrategicPlan,
  AnalysisSection,
  StrategicInitiative,
  RoadmapDetail,
} from "../types"

interface ResultsDisplayProps {
  plan: StrategicPlan
  onReset: () => void
}

const CheckIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={`h-4 w-4 ${className || ""}`}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
)

const SectionCard: React.FC<{
  section: AnalysisSection
  icon: React.ReactNode
}> = ({ section, icon }) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center">
        {icon}
        <span className="ml-3">{section.title}</span>
      </CardTitle>
    </CardHeader>
    <CardContent>
      <ul className="space-y-3">
        {section.points.map((point, index) => (
          <li key={index} className="flex items-start">
            <CheckIcon className="text-green-500 flex-shrink-0 mt-1 mr-2" />
            <span className="text-muted-foreground">{point}</span>
          </li>
        ))}
      </ul>
    </CardContent>
  </Card>
)

const RoadmapAccordion: React.FC<{ initiative: StrategicInitiative }> = ({
  initiative,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const { details } = initiative

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
            <div className="flex justify-between items-center w-full">
              <div className="text-left">
                <CardTitle className="text-lg">{initiative.title}</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  {initiative.description}
                </p>
              </div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-6 w-6 transform transition-transform duration-300 ${
                  isOpen ? "rotate-180" : ""
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="pt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <DetailItem title="Iniciativa" content={details.initiative} />
              <DetailItem title="Cronograma" content={details.timeline} />
              <DetailItem title="Responsable Sugerido" content={details.owner} />
              <DetailList
                title="Indicadores Clave de Rendimiento (KPIs)"
                items={details.kpis}
              />
              <DetailList title="Recursos Necesarios" items={details.resources} />
            </div>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  )
}

const DetailItem: React.FC<{ title: string; content: string }> = ({
  title,
  content,
}) => (
  <div>
    <h5 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
      {title}
    </h5>
    <p className="mt-1 text-foreground">{content}</p>
  </div>
)

const DetailList: React.FC<{ title: string; items: string[] }> = ({
  title,
  items,
}) => (
  <div>
    <h5 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
      {title}
    </h5>
    <ul className="mt-1 space-y-1 list-disc list-inside">
      {items.map((item, i) => (
        <li key={i} className="text-foreground">
          {item}
        </li>
      ))}
    </ul>
  </div>
)

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({
  plan,
  onReset,
}) => {
  const tabs = [
    {
      id: "quickWins",
      label: "Victorias Rápidas (0-30 Días)",
      data: plan.strategy.quickWins,
    },
    {
      id: "strategicInitiatives",
      label: "Iniciativas Estratégicas (1-6 Meses)",
      data: plan.strategy.strategicInitiatives,
    },
    {
      id: "transformationalBets",
      label: "Apuestas Transformacionales (6-18+ Meses)",
      data: plan.strategy.transformationalBets,
    },
  ]

  return (
    <div className="space-y-12">
      {/* Analysis Section */}
      <div>
        <h2 className="text-3xl font-bold text-center mb-8">
          FASE 2: ANÁLISIS
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SectionCard
            section={plan.analysis.currentSituation}
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-blue-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V7a2 2 0 012-2h5l4 4v10a2 2 0 01-2 2z"
                />
              </svg>
            }
          />
          <SectionCard
            section={plan.analysis.gaps}
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-yellow-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            }
          />
          <SectionCard
            section={plan.analysis.opportunities}
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-green-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
            }
          />
          <SectionCard
            section={plan.analysis.risks}
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            }
          />
        </div>
      </div>

      {/* Strategy & Execution Section */}
      <div>
        <h2 className="text-3xl font-bold text-center mb-8">
          FASE 3 Y 4: ESTRATEGIA Y EJECUCIÓN
        </h2>
        <Tabs defaultValue="quickWins">
          <TabsList className="grid w-full grid-cols-1 md:grid-cols-3 h-auto">
            {tabs.map((tab) => (
              <TabsTrigger 
                key={tab.id} 
                value={tab.id}
                className="text-sm font-medium p-3"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
          {tabs.map((tab) => (
            <TabsContent key={tab.id} value={tab.id} className="mt-6">
              <div className="space-y-4">
                {tab.data.map((initiative, index) => (
                  <RoadmapAccordion key={index} initiative={initiative} />
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>

      {/* Conclusion */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-8 text-center">
          <p className="text-xl italic font-semibold text-primary">
            {plan.conclusion}
          </p>
        </CardContent>
      </Card>

      <div className="text-center mt-12">
        <Button onClick={onReset} variant="outline" size="lg">
          Iniciar un Nuevo Análisis
        </Button>
      </div>
    </div>
  )
}
