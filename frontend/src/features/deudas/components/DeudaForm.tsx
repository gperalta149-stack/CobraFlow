// frontend/src/features/deudas/components/DeudaForm.tsx
import type { Cliente, DeudaFormData } from '../types'
import { IconCurrencyDollar, IconCurrencyPeso, IconDeviceFloppy, IconX } from '@tabler/icons-react'
import '../../../styles/forms.css'

interface DeudaFormProps {
  form: DeudaFormData
  clientes: Cliente[]
  error: string
  isSubmitting: boolean
  cotizacionActual: number
  cargandoCotizacion: boolean
  descripcionInputRef: React.RefObject<HTMLTextAreaElement | null>
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void
  onMonedaChange: (moneda: 'ARS' | 'USD') => void
  onSubmit: (e: React.FormEvent) => void
  onCancel: () => void
}

function Field({ label, required, hint, children }: {
  label: string
  required?: boolean
  hint?: string
  children: React.ReactNode
}) {
  return (
    <div className="form-group-modern">
      <label className="form-label-modern">
        {label}
        {required && <span className="form-label-required">*</span>}
        {hint && <span className="text-xs text-gray-500 ml-1">({hint})</span>}
      </label>
      {children}
    </div>
  )
}

export function DeudaForm({
  form, clientes, error, isSubmitting,
  cotizacionActual, cargandoCotizacion,
  descripcionInputRef, onChange, onMonedaChange, onSubmit, onCancel,
}: DeudaFormProps) {
  const esUSD = form.moneda === 'USD'
  const parsear = (val: string) => parseFloat(val.replace(',', '.')) || 0
  const montoOriginalNum = parsear(form.monto_original)
  const cotizacionNum = parsear(form.cotizacion) || cotizacionActual || 1200
  const montoTotalCalculado = esUSD ? montoOriginalNum * cotizacionNum : montoOriginalNum

  return (
    <form onSubmit={onSubmit} noValidate className="form-container-modern">
      {/* Header */}
      <div className="mb-6 pb-4 border-b border-[#2e3347]">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/15 flex items-center justify-center">
            <IconCurrencyDollar size={20} className="text-emerald-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Nueva deuda</h3>
            <p className="text-sm text-gray-400">Registrá una nueva deuda en el sistema</p>
          </div>
        </div>
      </div>

      {error && (
        <div className="form-error-modern mb-6">
          <span>⚠️</span>
          <p>{error}</p>
        </div>
      )}

      <Field label="Cliente" required>
        <select name="cliente_id" value={form.cliente_id} onChange={onChange}
          disabled={isSubmitting} required className="form-input-modern">
          <option value="" className="bg-[#242938]">Seleccionar cliente</option>
          {clientes.map(c => (
            <option key={c.id} value={c.id} className="bg-[#242938]">{c.nombre}</option>
          ))}
        </select>
      </Field>

      <Field label="N° de factura" hint="Opcional">
        <input type="text" name="numero_factura" placeholder="0001-00012345"
          value={form.numero_factura || ''} onChange={onChange}
          disabled={isSubmitting} className="form-input-modern" />
      </Field>

      <Field label="Descripción" required>
        <textarea ref={descripcionInputRef} name="descripcion"
          placeholder="Ej: Servicio de consultoría — Abril 2025"
          value={form.descripcion} onChange={onChange}
          rows={3} maxLength={150} disabled={isSubmitting} required
          className="form-textarea-modern" />
        <span className="text-xs text-gray-500 text-right block mt-1">
          {form.descripcion.length} / 150
        </span>
      </Field>

      <Field label="Moneda" required>
        <div className="grid grid-cols-2 gap-3">
          <button type="button" onClick={() => onMonedaChange('ARS')}
            disabled={isSubmitting}
            className={`flex items-center justify-center gap-2 py-3 rounded-xl border-2 font-medium transition-all
              ${form.moneda === 'ARS'
                ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400'
                : 'border-[#2e3347] text-gray-400 hover:border-[#3a4159] hover:text-white'}`}>
            <IconCurrencyPeso size={18} />
            <span>ARS</span>
          </button>
          <button type="button" onClick={() => onMonedaChange('USD')}
            disabled={isSubmitting}
            className={`flex items-center justify-center gap-2 py-3 rounded-xl border-2 font-medium transition-all
              ${form.moneda === 'USD'
                ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400'
                : 'border-[#2e3347] text-gray-400 hover:border-[#3a4159] hover:text-white'}`}>
            <IconCurrencyDollar size={18} />
            <span>USD</span>
          </button>
        </div>
      </Field>

      <div>
        <label className="form-label-modern">
          {esUSD ? 'Monto en USD' : 'Monto en ARS'}
          <span className="form-label-required">*</span>
        </label>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-400 w-10 text-right shrink-0">
            {esUSD ? 'USD' : 'ARS'}
          </span>
          <input type="text" inputMode="decimal" name="monto_original" placeholder="0.00"
            value={form.monto_original} onChange={onChange}
            disabled={isSubmitting} required
            className="form-input-modern flex-1" />
        </div>
      </div>

      {esUSD && (
        <div className="bg-emerald-500/5 rounded-xl p-4 space-y-3 border border-emerald-500/20">
          <Field label="Cotización USD → ARS">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-gray-400 w-10 text-right shrink-0">ARS</span>
              <input type="text" inputMode="decimal" name="cotizacion"
                value={form.cotizacion} onChange={onChange}
                disabled={isSubmitting}
                className="form-input-modern flex-1" />
              {cargandoCotizacion && (
                <span className="text-xs text-emerald-400 animate-pulse">cargando...</span>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1 ml-12">
              Cotización de referencia: ${cotizacionActual.toLocaleString('es-AR')} ARS
            </p>
          </Field>
          {montoOriginalNum > 0 && (
            <div className="border-t border-emerald-500/20 pt-3 flex justify-between items-center text-sm">
              <span className="text-gray-400">Conversión:</span>
              <span className="font-medium text-right text-white">
                USD {montoOriginalNum.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                {' × '}${cotizacionNum.toLocaleString('es-AR')}
                {' = '}
                <strong className="text-emerald-400">
                  ${montoTotalCalculado.toLocaleString('es-AR', { minimumFractionDigits: 2 })} ARS
                </strong>
              </span>
            </div>
          )}
        </div>
      )}

      <Field label="Fecha de vencimiento" required>
        <input type="date" name="fecha_vencimiento" value={form.fecha_vencimiento}
          onChange={onChange} disabled={isSubmitting} required className="form-input-modern" />
      </Field>

      <Field label="Observaciones" hint="Opcional">
        <textarea name="observaciones" placeholder="Notas internas..."
          value={form.observaciones || ''} onChange={onChange}
          rows={2} disabled={isSubmitting} className="form-textarea-modern" />
      </Field>

      <div className="bg-[#1e2334] rounded-xl px-4 py-3 flex items-center justify-between">
        <span className="text-sm text-gray-400">Total</span>
        <div className="text-right">
          <p className="text-lg font-bold text-white">
            ${montoTotalCalculado.toLocaleString('es-AR', { minimumFractionDigits: 2 })} ARS
          </p>
          {esUSD && montoOriginalNum > 0 && (
            <p className="text-sm text-gray-500 mt-0.5">
              USD {montoOriginalNum.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
            </p>
          )}
        </div>
      </div>

      <div className="form-actions-modern mt-8">
        <button type="submit" disabled={isSubmitting} className="btn-submit-modern">
          {isSubmitting ? (
            <>
              <span className="spinner-small" />
              Guardando...
            </>
          ) : (
            <>
              <IconDeviceFloppy size={18} />
              Crear deuda
            </>
          )}
        </button>
        <button type="button" onClick={onCancel} disabled={isSubmitting} className="btn-cancel-modern">
          <IconX size={18} />
          Cancelar
        </button>
      </div>
    </form>
  )
}