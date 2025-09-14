import React, { useState } from "react"
import type { DiscoveryData } from "../types"
import { validateDiscoveryData } from "../services/ethical-filter"
import { EthicalWarning } from "./ethical-warning"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface DiscoveryFormProps {
  onSubmit: (data: DiscoveryData) => void
}

const FormField: React.FC<{
  id: keyof DiscoveryData
  label: string
  placeholder: string
  value: string
  onChange: (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => void
  type?: "text" | "textarea"
  rows?: number
  description?: string
}> = ({
  id,
  label,
  placeholder,
  value,
  onChange,
  type = "textarea",
  rows = 4,
  description,
}) => (
  <div className="space-y-2">
    <Label htmlFor={id} className="text-sm font-medium">
      {label}
    </Label>
    {description && (
      <p className="text-xs text-muted-foreground">{description}</p>
    )}
    {type === "textarea" ? (
      <Textarea
        id={id}
        name={id}
        rows={rows}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required
        className="resize-none"
      />
    ) : (
      <Input
        type="text"
        id={id}
        name={id}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required
      />
    )}
  </div>
)

export const DiscoveryForm: React.FC<DiscoveryFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<DiscoveryData>({
    companyName: "",
    industry: "",
    currentSituation: "",
    goals: "",
    resources: "",
    competition: "",
    timeline: "",
  })

  const [ethicalWarning, setEthicalWarning] = useState<{
    message: string
    category?: string
  } | null>(null)

  const handleChange = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validar contenido ético antes de enviar
    const ethicalCheck = validateDiscoveryData(formData)

    if (!ethicalCheck.isAllowed) {
      setEthicalWarning({
        message: ethicalCheck.reason || "Se detectó contenido inapropiado.",
        category: ethicalCheck.category,
      })
      return
    }

    // Si pasa la validación ética, proceder con el envío
    onSubmit(formData)
  }

  const handleEthicalWarningDismiss = () => {
    setEthicalWarning(null)
  }

  return (
    <>
      {ethicalWarning && (
        <EthicalWarning
          message={ethicalWarning.message}
          category={ethicalWarning.category}
          onDismiss={handleEthicalWarningDismiss}
        />
      )}

      <Card className="max-w-4xl mx-auto">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-primary rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-primary-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
          </div>
          <CardTitle className="text-3xl font-bold">
            FASE 1: DESCUBRIMIENTO
          </CardTitle>
          <CardDescription className="text-base max-w-2xl mx-auto">
            Proporciona los detalles principales de tu desafío empresarial para
            generar una estrategia personalizada.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <FormField
                id="companyName"
                label="Nombre de la Empresa"
                placeholder="ej. Mi Startup SaaS"
                value={formData.companyName}
                onChange={handleChange}
                type="text"
              />
              <FormField
                id="industry"
                label="Industria"
                placeholder="ej. Tecnología/SaaS, E-commerce, Consultoria"
                value={formData.industry}
                onChange={handleChange}
                type="text"
                description="La industria o sector en el que opera tu empresa"
              />
            </div>

            <div className="col-span-1 lg:col-span-2 space-y-6">
              <FormField
                id="currentSituation"
                label="Situación Actual"
                placeholder="ej. Somos una startup SaaS con 10k MRR, pero el crecimiento se ha estancado..."
                value={formData.currentSituation}
                onChange={handleChange}
                description="Describe el estado actual de tu empresa, principales desafíos y contexto"
              />

              <FormField
                id="goals"
                label="Objetivos Deseados"
                placeholder="ej. Alcanzar 50k MRR en 12 meses y expandirse al mercado europeo..."
                value={formData.goals}
                onChange={handleChange}
                description="¿Qué esperas lograr? Define objetivos específicos y medibles"
              />

              <FormField
                id="resources"
                label="Recursos Disponibles y Limitaciones"
                placeholder="ej. Equipo de 5 desarrolladores, 2 marketers. Presupuesto de marketing de $5k/mes..."
                value={formData.resources}
                onChange={handleChange}
                description="Describe tu equipo, presupuesto, tecnología y principales limitaciones"
              />

              <FormField
                id="competition"
                label="Competencia y Posicionamiento"
                placeholder="ej. El competidor principal es 'Competidor X' que está bien financiado..."
                value={formData.competition}
                onChange={handleChange}
                description="¿Quiénes son tus competidores y qué te diferencia de ellos?"
              />

              <FormField
                id="timeline"
                label="Cronograma y Métricas de Éxito"
                placeholder="ej. Plan de 18 meses. El éxito se mide por tasa de retención > 40% y rentabilidad..."
                value={formData.timeline}
                onChange={handleChange}
                description="Define el horizonte temporal y cómo medirás el éxito"
              />
            </div>

            <div className="col-span-1 lg:col-span-2 pt-6">
              <Button
                type="submit"
                size="lg"
                className="w-full lg:w-auto mx-auto flex items-center justify-center px-8"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
                Generar Plan Estratégico
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </>
  )
}
