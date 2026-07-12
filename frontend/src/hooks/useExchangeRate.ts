import { useState, useEffect } from 'react'
import { exchangeRateApi } from '../services/exchangeRateApi'

interface ExchangeRate {
  compra: number
  venta: number
  fecha: string
  fuente: string
  es_hoy?: boolean
}

export const useExchangeRate = () => {
  const [rate, setRate] = useState<ExchangeRate | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelado = false

    const fetchRate = async () => {
      setLoading(true)
      try {
        // 1) Cotización guardada en BD (vía backend, actualizada por el cron)
        try {
          const { data } = await exchangeRateApi.getStoredRate()
          if (data && typeof data.venta === 'number') {
            if (!cancelado) {
              setRate(data)
              setError(null)
            }
            return
          }
        } catch (err) {
          console.error('Error obteniendo cotización guardada:', err)
        }

        // 2) Fallback: cotización oficial en vivo (también vía backend, nunca Supabase directo)
        try {
          const { data } = await exchangeRateApi.getCurrentRate()
          if (data && typeof data.venta === 'number') {
            if (!cancelado) {
              setRate({ ...data, es_hoy: true })
              setError(null)
            }
            return
          }
          throw new Error('Respuesta sin cotización')
        } catch (err) {
          console.error('Error obteniendo cotización en vivo:', err)
          if (!cancelado) {
            // Sin cotización real disponible: no inventamos un valor.
            setRate(null)
            setError('No se pudo obtener la cotización del dólar')
          }
        }
      } finally {
        if (!cancelado) setLoading(false)
      }
    }

    fetchRate()
    return () => { cancelado = true }
  }, [])

  return { rate, loading, error }
}