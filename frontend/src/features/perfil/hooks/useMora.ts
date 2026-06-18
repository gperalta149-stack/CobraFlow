// frontend/src/features/perfil/hooks/useMora.ts
import { useState, useEffect } from 'react'
import { perfilApi } from '../services/perfilApi'
import { handleApiError } from '../../../utils/handleApiError'
import type { MoraConfig } from '../services/perfilApi'

export function useMora() {
  const [config, setConfig] = useState<MoraConfig>({
    mora_activa: false,
    mora_porcentaje: 5,
    mora_tipo: 'mensual'
  })
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [exito, setExito] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await perfilApi.getMora()
        setConfig(data)
      } catch (err) {
        console.error('Error cargando mora:', err)
        setError('Error al cargar la configuración')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const handleChange = (field: keyof MoraConfig, value: boolean | number | string) => {
    setConfig(prev => ({ ...prev, [field]: value }))
    setExito(false)
    setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setExito(false)
    setIsSubmitting(true)
    try {
      await perfilApi.updateMora(config)
      setExito(true)
      setTimeout(() => setExito(false), 3000)
    } catch (err) {
      setError(handleApiError(err, 'Error al guardar la configuración'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return { config, loading, isSubmitting, exito, error, handleChange, handleSubmit }
}