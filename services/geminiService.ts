import { GoogleGenAI, Type } from "@google/genai"
import type { DiscoveryData, StrategicPlan } from "../types"

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string })

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    analysis: {
      type: Type.OBJECT,
      properties: {
        currentSituation: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            points: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
        },
        gaps: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            points: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
        },
        opportunities: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            points: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
        },
        risks: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            points: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
        },
      },
    },
    strategy: {
      type: Type.OBJECT,
      properties: {
        quickWins: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              details: {
                type: Type.OBJECT,
                properties: {
                  initiative: { type: Type.STRING },
                  resources: { type: Type.ARRAY, items: { type: Type.STRING } },
                  timeline: { type: Type.STRING },
                  kpis: { type: Type.ARRAY, items: { type: Type.STRING } },
                  owner: { type: Type.STRING },
                },
              },
            },
          },
        },
        strategicInitiatives: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              details: {
                type: Type.OBJECT,
                properties: {
                  initiative: { type: Type.STRING },
                  resources: { type: Type.ARRAY, items: { type: Type.STRING } },
                  timeline: { type: Type.STRING },
                  kpis: { type: Type.ARRAY, items: { type: Type.STRING } },
                  owner: { type: Type.STRING },
                },
              },
            },
          },
        },
        transformationalBets: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              details: {
                type: Type.OBJECT,
                properties: {
                  initiative: { type: Type.STRING },
                  resources: { type: Type.ARRAY, items: { type: Type.STRING } },
                  timeline: { type: Type.STRING },
                  kpis: { type: Type.ARRAY, items: { type: Type.STRING } },
                  owner: { type: Type.STRING },
                },
              },
            },
          },
        },
      },
    },
    conclusion: { type: Type.STRING },
  },
}

const buildPrompt = (data: DiscoveryData): string => {
  return `
    Eres STRATEGYGPT, un consultor de McKinsey nivel senior especializado en transformación empresarial y growth hacking. Tu comunicación es directa, orientada a resultados y basada en datos con insights accionables.

    METODOLOGÍA CORE:
    - DIAGNOSTIC FRAMEWORK: Analiza usando una combinación de SWOT, Porter's 5 Forces y Canvas Model.
    - DATA-DRIVEN INSIGHTS: Basa tus recomendaciones en métricas clave, benchmarks y predicciones.
    - ACTIONABLE ROADMAPS: Crea timelines específicos con milestones medibles.
    - RISK ASSESSMENT: Identifica proactivamente obstáculos y crea planes de mitigación.

    PROCESO DE CONSULTORÍA:
    A partir de la información de la FASE 1 - DISCOVERY proporcionada por el usuario, debes generar un análisis completo que cubra las FASES 2, 3 y 4.

    **FASE 1 - DISCOVERY (Input del Usuario):**
    - **Situación actual y objetivos deseados:** ${data.currentSituation} vs ${data.goals}
    - **Recursos disponibles y limitaciones:** ${data.resources}
    - **Competencia y posicionamiento de mercado:** ${data.competition}
    - **Timeline y métricas de éxito:** ${data.timeline}

    **TAREA:**
    Genera un plan estratégico completo en formato JSON estructurado. Sigue el schema proporcionado rigurosamente.
    - **FASE 2 - ANÁLISIS:** Rellena las secciones 'currentSituation', 'gaps', 'opportunities' y 'risks'. Sé conciso y directo.
    - **FASE 3 - ESTRATEGIA:** Rellena las secciones 'quickWins' (0-30 días), 'strategicInitiatives' (1-6 meses) y 'transformationalBets' (6-18 meses). Proporciona títulos y descripciones claras.
    - **FASE 4 - EXECUTION:** Para cada iniciativa en la FASE 3, detalla los recursos, timeline, KPIs y responsables sugeridos en el objeto 'details'.
    - **CONCLUSIÓN:** El campo 'conclusion' DEBE contener ÚNICAMENTE el siguiente texto: "¿Qué aspecto específico quieres profundizar para acelerar la implementación?"
  `
}

export const generateStrategicPlan = async (
  data: DiscoveryData
): Promise<StrategicPlan> => {
  const prompt = buildPrompt(data)

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.7,
      },
    })

    const jsonText = response.text.trim()
    const parsedPlan: StrategicPlan = JSON.parse(jsonText)
    return parsedPlan
  } catch (error) {
    console.error("Error calling Gemini API:", error)
    throw new Error(
      "Error al generar el plan estratégico desde la API de Gemini."
    )
  }
}
