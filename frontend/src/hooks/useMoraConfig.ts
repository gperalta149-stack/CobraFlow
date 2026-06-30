// frontend/src/hooks/useMoraConfig.ts
import { useState, useEffect } from 'react'
import { perfilApi } from '../features/perfil/services/perfilApi'
import type { MoraConfig } from '../features/perfil/services/perfilApi'

let cache: MoraConfig | null = null

export function useMoraConfig() {
  const [config, setConfig] = useState<MoraConfig | null>(cache)
  const [loading, setLoading] = useState(!cache)

  useEffect(() => {
    if (cache) return
    const load = async () => {
      try {
        const { data } = await perfilApi.getMora()
        cache = data
        setConfig(data)
      } catch (err) {
        console.error('Error cargando config mora:', err)
        // ← Fallback: usar configuración por defecto
        const fallback: MoraConfig = {
          mora_activa: false,
          mora_porcentaje: 0,
          mora_tipo: 'mensual'
        }
        cache = fallback
        setConfig(fallback)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return { config, loading }
}