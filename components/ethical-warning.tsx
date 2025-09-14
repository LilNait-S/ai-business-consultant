import React from "react"

interface EthicalWarningProps {
  message: string
  category?: string
  onDismiss: () => void
}

export const EthicalWarning: React.FC<EthicalWarningProps> = ({
  message,
  category,
  onDismiss,
}) => {
  const getIconForCategory = (cat?: string) => {
    switch (cat) {
      case "lavado_de_dinero":
      case "fraude":
        return (
          <svg
            className="h-6 w-6 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        )
      case "drogas":
      case "armas":
        return (
          <svg
            className="h-6 w-6 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636"
            />
          </svg>
        )
      default:
        return (
          <svg
            className="h-6 w-6 text-red-500"
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
        )
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 m-4 max-w-md w-full border border-red-200 dark:border-red-800">
        <div className="flex items-start">
          <div className="flex-shrink-0">{getIconForCategory(category)}</div>
          <div className="ml-3 w-full">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Contenido No Permitido
            </h3>
            <div className="text-sm text-gray-700 dark:text-gray-300 mb-4">
              <p className="mb-3">{message}</p>
              <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md border-l-4 border-blue-400">
                <p className="text-blue-800 dark:text-blue-200 text-xs">
                  <strong>StrategyGPT</strong> está diseñado para ayudar con
                  estrategias de negocio legales y éticas. Te invitamos a
                  reformular tu consulta enfocándote en prácticas comerciales
                  transparentes y legales.
                </p>
              </div>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={onDismiss}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
