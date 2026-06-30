// frontend/src/features/perfil/pages/Configuracion.tsx
import { useLocation } from 'react-router-dom'
import { ConfiguracionMora } from '../components/ConfiguracionMora'
import { ConfiguracionMoneda } from '../components/ConfiguracionMoneda'

export default function Configuracion() {
  const location = useLocation()
  
  const isMora = location.pathname === '/configuracion/mora' || location.pathname === '/configuracion'
  const isMoneda = location.pathname === '/configuracion/moneda'

  return (
    <div style={{ padding: '24px 28px', maxWidth: 1400, margin: '0 auto' }}>
      {/* Header
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 20, fontWeight: 600, color: '#ffffff', letterSpacing: '-0.3px', margin: 0 }}>
          Configuración
        </h1>
        <p style={{ fontSize: 13, color: '#6b7280', marginTop: 4 }}>
          {isMora ? 'Configuración de mora' : 'Configuración de moneda'}
        </p>
      </div>*/}

      {/* Contenido según la ruta */}
      {isMora && <ConfiguracionMora />}
      {isMoneda && <ConfiguracionMoneda />}
    </div>
  )
}