// frontend/src/features/perfil/components/MoraForm.tsx
import { IconAlertCircle, IconCheck } from '@tabler/icons-react'
import type { MoraConfig } from '../services/perfilApi'

interface MoraFormProps {
  config: MoraConfig | null
  loading: boolean
  isSubmitting: boolean
  exito: boolean
  error: string | null
  onChange: (field: keyof MoraConfig, value: boolean | number | string) => void
  onSubmit: (e: React.FormEvent) => void
}

export function MoraForm({
  config,
  loading,
  isSubmitting,
  exito,
  error,
  onChange,
  onSubmit,
}: MoraFormProps) {
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '32px 0' }}>
        <div style={{ width: 24, height: 24, border: '2px solid #2e3347', borderTopColor: '#1D9E75', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }} />
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        <div style={{ padding: 6, background: '#E24B4A20', borderRadius: 8, color: '#E24B4A', display: 'flex' }}>
          <IconAlertCircle size={16} />
        </div>
        <div>
          <h3 style={{ fontSize: 13, fontWeight: 600, color: '#f0f2f5', margin: 0 }}>
            Configuración de mora
          </h3>
          <p style={{ fontSize: 11, color: '#6b7280', marginTop: 2 }}>
            Aplicar mora automática a deudas vencidas
          </p>
        </div>
      </div>

      {/* Mora activa - toggle */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '0.5px solid #2e3347' }}>
        <div>
          <p style={{ fontSize: 13, fontWeight: 500, color: '#f0f2f5', margin: 0 }}>Mora activa</p>
          <p style={{ fontSize: 11, color: '#6b7280', marginTop: 2 }}>
            Aplicar mora automática a deudas vencidas
          </p>
        </div>
        <label style={{ position: 'relative', display: 'inline-block', width: 44, height: 24 }}>
          <input
            type="checkbox"
            checked={config?.mora_activa || false}
            onChange={(e) => onChange('mora_activa', e.target.checked)}
            style={{ opacity: 0, width: 0, height: 0 }}
          />
          <span style={{
            position: 'absolute',
            cursor: 'pointer',
            inset: 0,
            backgroundColor: config?.mora_activa ? '#1D9E75' : '#2e3347',
            transition: 'all 0.3s',
            borderRadius: 24,
          }}>
            <span style={{
              position: 'absolute',
              height: 18,
              width: 18,
              left: config?.mora_activa ? 22 : 3,
              bottom: 3,
              backgroundColor: '#fff',
              transition: 'all 0.3s',
              borderRadius: '50%',
            }} />
          </span>
        </label>
      </div>

      {/* Tipo de mora - más compacto */}
      <div style={{ marginTop: 16 }}>
        <p style={{ fontSize: 12, fontWeight: 500, color: '#94a3b8', marginBottom: 6 }}>Tipo de mora</p>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            type="button"
            onClick={() => onChange('mora_tipo', 'mensual')}
            style={{
              flex: 1,
              padding: '8px 14px',
              borderRadius: 8,
              border: config?.mora_tipo === 'mensual' ? '1px solid #1D9E75' : '0.5px solid #2e3347',
              background: config?.mora_tipo === 'mensual' ? '#1D9E7510' : 'transparent',
              cursor: 'pointer',
              textAlign: 'center',
              transition: 'all 0.2s',
            }}
          >
            <p style={{ fontSize: 13, fontWeight: 600, color: config?.mora_tipo === 'mensual' ? '#34d399' : '#f0f2f5', margin: 0 }}>
              Mensual
            </p>
            <p style={{ fontSize: 10, color: '#6b7280', margin: '2px 0 0' }}>
              Por mes
            </p>
          </button>
          <button
            type="button"
            onClick={() => onChange('mora_tipo', 'unica')}
            style={{
              flex: 1,
              padding: '8px 14px',
              borderRadius: 8,
              border: config?.mora_tipo === 'unica' ? '1px solid #1D9E75' : '0.5px solid #2e3347',
              background: config?.mora_tipo === 'unica' ? '#1D9E7510' : 'transparent',
              cursor: 'pointer',
              textAlign: 'center',
              transition: 'all 0.2s',
            }}
          >
            <p style={{ fontSize: 13, fontWeight: 600, color: config?.mora_tipo === 'unica' ? '#34d399' : '#f0f2f5', margin: 0 }}>
              Única vez
            </p>
            <p style={{ fontSize: 10, color: '#6b7280', margin: '2px 0 0' }}>
              Al vencer
            </p>
          </button>
        </div>
      </div>

      {/* Porcentaje - input numérico + barra */}
      <div style={{ marginTop: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p style={{ fontSize: 12, fontWeight: 500, color: '#94a3b8', margin: 0 }}>Porcentaje de mora</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <input
              type="number"
              min="0"
              max="30"
              step="0.5"
              value={config?.mora_porcentaje || 0}
              onChange={(e) => onChange('mora_porcentaje', parseFloat(e.target.value) || 0)}
              style={{
                width: 60,
                padding: '4px 8px',
                background: '#1e2334',
                border: '0.5px solid #2e3347',
                borderRadius: 6,
                fontSize: 14,
                fontWeight: 600,
                color: '#f0f2f5',
                textAlign: 'center',
                outline: 'none',
              }}
            />
            <span style={{ fontSize: 14, fontWeight: 600, color: '#f0f2f5' }}>%</span>
          </div>
        </div>
        <input
          type="range"
          min="0"
          max="30"
          step="0.5"
          value={config?.mora_porcentaje || 0}
          onChange={(e) => onChange('mora_porcentaje', parseFloat(e.target.value))}
          style={{
            width: '100%',
            height: 4,
            borderRadius: 2,
            background: `linear-gradient(to right, #1D9E75 ${(config?.mora_porcentaje || 0) / 30 * 100}%, #2e3347 ${(config?.mora_porcentaje || 0) / 30 * 100}%)`,
            outline: 'none',
            appearance: 'none',
            marginTop: 6,
          }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#6b7280', marginTop: 2 }}>
          <span>0%</span>
          <span>30%</span>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div style={{
          marginTop: 16,
          padding: '10px 14px',
          background: '#E24B4A20',
          borderRadius: 8,
          border: '0.5px solid #E24B4A',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}>
          <IconAlertCircle size={14} color="#E24B4A" />
          <p style={{ fontSize: 12, color: '#E24B4A', margin: 0 }}>{error}</p>
        </div>
      )}

      {/* Éxito */}
      {exito && (
        <div style={{
          marginTop: 16,
          padding: '10px 14px',
          background: '#1D9E7510',
          borderRadius: 8,
          border: '0.5px solid #1D9E75',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}>
          <IconCheck size={14} color="#34d399" />
          <p style={{ fontSize: 12, color: '#34d399', margin: 0 }}>Configuración guardada correctamente</p>
        </div>
      )}

      {/* Botón guardar */}
      <button
        type="submit"
        disabled={isSubmitting}
        style={{
          marginTop: 20,
          width: '100%',
          padding: '12px',
          background: 'linear-gradient(135deg, #1D9E75 0%, #1a8b68 100%)',
          border: 'none',
          borderRadius: 10,
          fontSize: 14,
          fontWeight: 600,
          color: '#fff',
          cursor: isSubmitting ? 'not-allowed' : 'pointer',
          transition: 'all 0.2s',
          opacity: isSubmitting ? 0.6 : 1,
        }}
        onMouseEnter={(e) => {
          if (!isSubmitting) e.currentTarget.style.transform = 'translateY(-1px)'
        }}
        onMouseLeave={(e) => {
          if (!isSubmitting) e.currentTarget.style.transform = 'translateY(0)'
        }}
      >
        {isSubmitting ? 'Guardando...' : 'Guardar configuración'}
      </button>
    </form>
  )
}