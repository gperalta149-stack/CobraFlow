import { useState, useEffect } from 'react'
import { supabase } from '../services/supabaseClient'

interface ExchangeRate {
  compra: number
  venta: number
  fecha: string
  fuente: string
  es_hoy: boolean
}

export const useExchangeRate = () => {
  const [rate, setRate] = useState<ExchangeRate | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStoredRate = async () => {
      try {
        setLoading(true)
        const { data, error: rpcError } = await supabase.rpc('obtener_cotizacion_vigente')
        
        if (rpcError) throw rpcError
        
        setRate(data?.[0] ?? null)
        setError(null)
      } catch (err) {
        console.error('Error fetching stored exchange rate:', err)
        setError('No se pudo obtener la cotización del dólar')
        // Fallback a valor por defecto
        setRate({ compra: 0, venta: 1200, fecha: new Date().toISOString(), fuente: 'fallback', es_hoy: false })
      } finally {
        setLoading(false)
      }
    }

    fetchStoredRate()
  }, [])

  return { rate, loading, error }
}