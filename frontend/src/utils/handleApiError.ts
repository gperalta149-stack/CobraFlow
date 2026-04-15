import axios from 'axios'

export interface ApiErrorResponse {
  error?: string
  message?: string
  details?: Record<string, string[]> | string[]
}

export const handleApiError = (error: unknown, customMessage?: string): string => {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    // Error de red o sin respuesta (servidor caído, CORS, etc)
    if (!error.response) {
      return customMessage || 'Error de conexión. Verifique su red e intente nuevamente.'
    }

    // Timeout
    if (error.code === 'ECONNABORTED') {
      return customMessage || 'El servidor tardó demasiado en responder. Intente nuevamente.'
    }

    const { status, data } = error.response

    switch (status) {
      case 400:
        return data?.error || data?.message || customMessage || 'Datos inválidos.'
      case 401:
        return customMessage || 'Sesión expirada. Inicie sesión nuevamente.'
      case 403:
        return customMessage || 'No tiene permisos para realizar esta acción.'
      case 404:
        return customMessage || data?.error || data?.message || 'El recurso no existe.'
      case 409:
        return customMessage || data?.error || data?.message || 'Conflicto: registro duplicado.'
      case 422:
        if (data?.details) {
          if (Array.isArray(data.details)) {
            return data.details.join(', ')
          }
          return Object.values(data.details).flat().join(', ')
        }
        return data?.error || data?.message || customMessage || 'Error de validación.'
      case 500:
        return customMessage || 'Error interno del servidor. Intente más tarde.'
      default:
        return data?.error || data?.message || customMessage || 'Error al procesar la solicitud.'
    }
  }

  // Error no manejado por Axios (error de JavaScript puro)
  console.error('Error no controlado:', error)
  return customMessage || 'Error inesperado.'
}