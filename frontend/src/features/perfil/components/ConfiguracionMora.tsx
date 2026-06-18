// frontend/src/features/perfil/components/ConfiguracionMora.tsx
import { useMora } from '../hooks/useMora'
import { MoraForm } from './MoraForm'
import { ImpactoMora } from './ImpactoMora'

export function ConfiguracionMora() {
  const mora = useMora()

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, alignItems: 'start' }}>
      <div style={{
        backgroundColor: '#242938', border: '0.5px solid #2e3347',
        borderRadius: 12, padding: '20px 24px',
      }}>
        <MoraForm
          config={mora.config}
          loading={mora.loading}
          isSubmitting={mora.isSubmitting}
          exito={mora.exito}
          error={mora.error}
          onChange={mora.handleChange}
          onSubmit={mora.handleSubmit}
        />
      </div>

      <div style={{
        backgroundColor: '#242938', border: '0.5px solid #2e3347',
        borderRadius: 12, padding: '20px 24px',
      }}>
        <ImpactoMora />
      </div>
    </div>
  )
}