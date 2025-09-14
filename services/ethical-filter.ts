// Servicio de filtro ético para detectar contenido inapropiado
export interface EthicalFilterResult {
  isAllowed: boolean
  reason?: string
  category?: string
}

// Lista de palabras clave y patrones relacionados con actividades ilegales o poco éticas
const ILLEGAL_KEYWORDS = [
  // Lavado de dinero y actividades financieras ilegales
  "lavado de dinero",
  "lavado de activos",
  "blanqueo de capitales",
  "money laundering",
  "evasión fiscal",
  "evasión de impuestos",
  "tax evasion",
  "fraude fiscal",
  "paraísos fiscales ilegales",
  "cuentas offshore ilegales",

  // Drogas y sustancias ilegales
  "tráfico de drogas",
  "narcotráfico",
  "venta de drogas",
  "distribución de drogas",
  "cocaína",
  "heroína",
  "metanfetaminas",
  "fentanilo",
  "cartel de drogas",

  // Armas y actividades violentas
  "tráfico de armas",
  "venta ilegal de armas",
  "contrabando de armas",
  "mercenarios",
  "sicarios",
  "asesinatos por encargo",

  // Explotación humana
  "trata de personas",
  "tráfico humano",
  "explotación sexual",
  "trabajo infantil",
  "esclavitud moderna",
  "prostitución forzada",

  // Fraude y estafas
  "esquemas ponzi",
  "pirámides financieras",
  "estafas piramidales",
  "fraude de identidad",
  "phishing",
  "estafas nigerianas",
  "falsificación de documentos",
  "robo de identidad",

  // Actividades cibernéticas ilegales
  "hacking ilegal",
  "ciberataques",
  "ransomware",
  "malware",
  "piratería de software",
  "carding",
  "dark web",

  // Corrupción y soborno
  "soborno",
  "corrupción gubernamental",
  "compra de funcionarios",
  "tráfico de influencias",
  "coima",
  "mordida",

  // Actividades terroristas
  "financiamiento del terrorismo",
  "células terroristas",
  "actividades terroristas",

  // Falsificación y contrabando
  "productos falsificados",
  "contrabando",
  "mercancía robada",
  "falsificación de marcas",
  "piratería comercial",
]

const UNETHICAL_PATTERNS = [
  // Patrones que podrían indicar intenciones poco éticas
  /como\s+evitar\s+(?:impuestos|regulaciones|leyes)/i,
  /sin\s+(?:registrar|declarar|pagar\s+impuestos)/i,
  /fuera\s+del\s+radar\s+(?:fiscal|legal)/i,
  /negocio\s+(?:ilegal|clandestino|en\s+negro)/i,
  /dinero\s+(?:sucio|negro|no\s+declarado)/i,
  /ocultar\s+(?:ingresos|ganancias|activos)/i,
]

const ETHICAL_ALTERNATIVES = {
  "lavado de dinero":
    "gestión financiera transparente y cumplimiento regulatorio",
  "evasión fiscal": "optimización fiscal legal y planificación tributaria",
  "tráfico de drogas": "industria farmacéutica o productos de bienestar legal",
  fraude: "estrategias de marketing ético y construcción de confianza",
  corrupción: "prácticas de gobierno corporativo y transparencia",
  contrabando: "comercio internacional legal y gestión de cadena de suministro",
}

export const checkEthicalContent = (text: string): EthicalFilterResult => {
  const normalizedText = text.toLowerCase()

  // Verificar palabras clave ilegales
  for (const keyword of ILLEGAL_KEYWORDS) {
    if (normalizedText.includes(keyword.toLowerCase())) {
      const category = getCategoryForKeyword(keyword)
      const alternative = findAlternative(keyword)

      return {
        isAllowed: false,
        reason: `Se detectó contenido relacionado con "${keyword}". ${
          alternative ? `Considera explorar ${alternative} en su lugar.` : ""
        }`,
        category,
      }
    }
  }

  // Verificar patrones poco éticos
  for (const pattern of UNETHICAL_PATTERNS) {
    if (pattern.test(text)) {
      return {
        isAllowed: false,
        reason:
          "Se detectó un patrón que podría estar relacionado con actividades poco éticas o ilegales.",
        category: "patrones_sospechosos",
      }
    }
  }

  return {
    isAllowed: true,
  }
}

const getCategoryForKeyword = (keyword: string): string => {
  if (
    [
      "lavado de dinero",
      "lavado de activos",
      "blanqueo de capitales",
      "money laundering",
    ].includes(keyword.toLowerCase())
  ) {
    return "lavado_de_dinero"
  }
  if (
    keyword.toLowerCase().includes("droga") ||
    keyword.toLowerCase().includes("narcó")
  ) {
    return "drogas"
  }
  if (keyword.toLowerCase().includes("arma")) {
    return "armas"
  }
  if (
    keyword.toLowerCase().includes("fraude") ||
    keyword.toLowerCase().includes("estafa")
  ) {
    return "fraude"
  }
  if (
    keyword.toLowerCase().includes("corrup") ||
    keyword.toLowerCase().includes("soborno")
  ) {
    return "corrupcion"
  }
  return "actividad_ilegal"
}

const findAlternative = (keyword: string): string | undefined => {
  for (const [illegal, alternative] of Object.entries(ETHICAL_ALTERNATIVES)) {
    if (keyword.toLowerCase().includes(illegal.toLowerCase())) {
      return alternative
    }
  }
  return undefined
}

// Función para validar todos los campos del formulario de descubrimiento
export const validateDiscoveryData = (data: any): EthicalFilterResult => {
  const fieldsToCheck = [
    data.currentSituation,
    data.goals,
    data.resources,
    data.competition,
    data.timeline,
  ]

  for (const field of fieldsToCheck) {
    if (field && typeof field === "string") {
      const result = checkEthicalContent(field)
      if (!result.isAllowed) {
        return result
      }
    }
  }

  return { isAllowed: true }
}
