// frontend/src/context/MonedaConfigContext.tsx
import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { perfilApi } from '../features/perfil/services/perfilApi'
import { handleApiError } from '../utils/handleApiError'
import { useExchangeRate } from '../hooks/useExchangeRate'

export interface MonedaConfig {
  mostrarEquivalencias: boolean
  mostrarUsdEnArs: boolean
  mostrarArsEnUsd: boolean
  secciones: {
    dashboard: boolean
    deudas: boolean
    pagos: boolean
    analisis: boolean
  }
}

const DEFAULT_CONFIG: MonedaConfig = {
  mostrarEquivalencias: true,
  mostrarUsdEnArs: true,
  mostrarArsEnUsd: true,
  secciones: { dashboard: true, deudas: true, pagos: true, analisis: true },
}

interface MonedaConfigContextValue {
  config: MonedaConfig
  loading: boolean
  isSubmitting: boolean
  exito: string
  error: string
  cotizacion: number
  toggleOption: (key: string) => void
  saveConfig: (e: React.FormEvent) => Promise<void>
  debeMostrarEquivalencia: (seccion: 'dashboard' | 'deudas' | 'pagos' | 'analisis') => boolean
  formatearMonto: (
    montoARS: number,
    montoUSD: number,
    monedaOriginal: 'ARS' | 'USD',
    seccion: 'dashboard' | 'deudas' | 'pagos' | 'analisis'
  ) => { principal: string; secundario: string | null }
}

const MonedaConfigContext = createContext<MonedaConfigContextValue | null>(null)

export function MonedaConfigProvider({ children }: { children: ReactNode }) {
  const { rate, loading: rateLoading } = useExchangeRate()
  const cotizacion = rate?.venta || 1450

  const [config, setConfig] = useState<MonedaConfig>(DEFAULT_CONFIG)
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [exito, setExito] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const response = await perfilApi.getConfiguracionMoneda()
        setConfig(response.data)
      } catch (err) {
        console.error('Error cargando configuración de moneda:', err)
        // ← En caso de error, mantener config por defecto
      } finally {
        setLoading(false) // ← SIEMPRE setear a false
      }
    }
    load()
  }, [])

  const debeMostrarEquivalencia = (seccion: 'dashboard' | 'deudas' | 'pagos' | 'analisis'): boolean => {
    // ← Si está cargando, NO mostrar equivalencias
    if (loading || rateLoading) return false
    if (!config.mostrarEquivalencias) return false
    return config.secciones[seccion]
  }

  const formatearMonto = (
    montoARS: number,
    montoUSD: number,
    monedaOriginal: 'ARS' | 'USD',
    seccion: 'dashboard' | 'deudas' | 'pagos' | 'analisis'
  ): { principal: string; secundario: string | null } => {
    const mostrarEquivalencia = debeMostrarEquivalencia(seccion)

    if (monedaOriginal === 'ARS') {
      const principal = `$${Math.round(montoARS).toLocaleString('es-AR')}`
      const mostrarUSD = mostrarEquivalencia && config.mostrarUsdEnArs
      const secundario = mostrarUSD && montoARS > 0
        ? `≈ USD ${(montoARS / cotizacion).toLocaleString('es-AR', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`
        : null
      return { principal, secundario }
    } else {
      const principal = `USD ${montoUSD.toLocaleString('es-AR', { minimumFractionDigits: 2 })}`
      const mostrarARS = mostrarEquivalencia && config.mostrarArsEnUsd
      const secundario = mostrarARS && montoUSD > 0
        ? `≈ $${Math.round(montoUSD * cotizacion).toLocaleString('es-AR')} ARS`
        : null
      return { principal, secundario }
    }
  }

  const toggleOption = (key: string) => {
    if (key === 'mostrarEquivalencias') {
      setConfig(prev => ({ ...prev, mostrarEquivalencias: !prev.mostrarEquivalencias }))
    } else if (key === 'mostrarUsdEnArs') {
      setConfig(prev => ({ ...prev, mostrarUsdEnArs: !prev.mostrarUsdEnArs }))
    } else if (key === 'mostrarArsEnUsd') {
      setConfig(prev => ({ ...prev, mostrarArsEnUsd: !prev.mostrarArsEnUsd }))
    } else if (key.startsWith('seccion_')) {
      const seccion = key.replace('seccion_', '')
      setConfig(prev => ({
        ...prev,
        secciones: { ...prev.secciones, [seccion]: !prev.secciones[seccion as keyof typeof prev.secciones] },
      }))
    }
    setExito('')
    setError('')
  }

  const saveConfig = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setExito('')
    setIsSubmitting(true)
    try {
      await perfilApi.updateConfiguracionMoneda(config)
      setExito('Configuración de moneda guardada correctamente')
    } catch (err) {
      setError(handleApiError(err, 'Error al guardar la configuración'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <MonedaConfigContext.Provider value={{
      config,
      loading: loading || rateLoading,
      isSubmitting, exito, error, cotizacion,
      toggleOption, saveConfig, debeMostrarEquivalencia, formatearMonto,
    }}>
      {children}
    </MonedaConfigContext.Provider>
  )
}

export function useMonedaConfig() {
  const ctx = useContext(MonedaConfigContext)
  if (!ctx) throw new Error('useMonedaConfig debe usarse dentro de <MonedaConfigProvider>')
  return ctx
}