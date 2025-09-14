import React, { useState, useEffect } from "react"

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
    <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-2xl mx-auto">
      <div className="flex justify-center items-center mb-6">
        <svg
          className="animate-spin h-10 w-10 text-blue-600"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-3">
        Generando Tu Plan Estratégico
      </h2>
      <p className="text-gray-600 dark:text-gray-400 transition-opacity duration-500">
        {messages[messageIndex]}
      </p>
    </div>
  )
}
