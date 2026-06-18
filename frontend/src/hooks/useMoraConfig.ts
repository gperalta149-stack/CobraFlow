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
      } catch {
        console.error('Error cargando config mora')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return { config, loading }
}