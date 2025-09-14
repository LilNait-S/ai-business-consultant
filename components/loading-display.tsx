import React, { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"

const messages = [
  "Aplicando Marcos de Diagnóstico (SWOT, 5 Fuerzas de Porter)...",
  "Analizando Datos de Mercado para Insights Clave...",
  "Comparando con Líderes de la Industria...",
  "Generando Predicciones Basadas en Datos...",
  "Construyendo Hojas de Ruta Accionables...",
  "Priorizando Iniciativas Estratégicas...",
  "Realizando Evaluación Proactiva de Riesgos...",
  "Finalizando Recomendaciones Nivel McKinsey...",
]

export const LoadingDisplay: React.FC = () => {
  const [messageIndex, setMessageIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prevIndex) => (prevIndex + 1) % messages.length)
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <div className="flex justify-center items-center mb-4">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary border-t-transparent" />
        </div>
        <CardTitle className="text-2xl">
          Generando Tu Plan Estratégico
        </CardTitle>
      </CardHeader>
      <CardContent className="text-center">
        <p className="text-muted-foreground transition-opacity duration-500">
          {messages[messageIndex]}
        </p>
      </CardContent>
    </Card>
  )
}
