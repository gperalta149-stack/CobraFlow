// frontend/src/features/perfil/pages/Configuracion.tsx
import { useLocation } from 'react-router-dom'
import { ConfiguracionMora } from '../components/ConfiguracionMora'
import { ConfiguracionMoneda } from '../components/ConfiguracionMoneda'

export default function Configuracion() {
  const location = useLocation()
  
  // Determinar qué sección mostrar según la ruta
  const isMora = location.pathname === '/configuracion' || location.pathname === '/configuracion/mora'
  const isMoneda = location.pathname === '/configuracion/moneda'

  return (
    <div style={{ padding: '24px 28px', maxWidth: 1400, margin: '0 auto' }}>
      

      {/* Contenido según la ruta */}
      {isMora && <ConfiguracionMora />}
      {isMoneda && <ConfiguracionMoneda />}
    </div>
  )
}