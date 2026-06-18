import type { Deuda, PagoFormData } from '../types'
import {
  IconCash, IconDeviceFloppy, IconX,
  IconCurrencyDollar, IconCurrencyPeso,
  IconCalendar, IconNotes, IconReceipt,
} from '@tabler/icons-react'
import { FormSection } from '../../../components/ui/FormSection'
import '../../../styles/forms.css'

interface PagoFormProps {
  form: PagoFormData
  deudas: Deuda[]
  deudaSeleccionada: Deuda | undefined
  cotizacionActual: number
  cargandoCotizacion: boolean
  error: string
  isSubmitting: boolean
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
  onMonedaPagoChange: (moneda: 'ARS' | 'USD') => void
  onSubmit: (e: React.FormEvent) => void
  onCancel: () => void
}

const METODOS = [
  { value: 'efectivo',        label: 'Efectivo',       emoji: '💵' },
  { value: 'transferencia',   label: 'Transferencia',  emoji: '🏦' },
  { value: 'tarjeta_credito', label: 'T. Crédito',     emoji: '💳' },
  { value: 'tarjeta_debito',  label: 'T. Débito',      emoji: '💳' },
  { value: 'cheque',          label: 'Cheque',         emoji: '📄' },
  { value: 'mercado_pago',    label: 'Mercado Pago',   emoji: '💙' },
  { value: 'otro',            label: 'Otro',           emoji: '📦' },
]

export function PagoForm({
  form, deudas, deudaSeleccionada, cotizacionActual, cargandoCotizacion,
  error, isSubmitting, onChange, onMonedaPagoChange, onSubmit, onCancel,
}: PagoFormProps) {
  const montoNum      = parseFloat(form.monto.replace(',', '.')) || 0
  const cotizacionNum = parseFloat(form.cotizacion_pago) || 1
  const esUSD         = form.moneda_pago === 'USD'
  const hayConversion = esUSD || deudaSeleccionada?.moneda === 'USD'
  const montoEnARS    = esUSD ? montoNum * cotizacionNum : montoNum
  const saldoARS      = deudaSeleccionada?.saldo_pendiente ?? 0
  const saldoUSD      = deudaSeleccionada
    ? saldoARS / (Number(deudaSeleccionada.cotizacion) || cotizacionActual)
    : 0

  return (
    <form onSubmit={onSubmit} noValidate className="form-container-modern">

      {/* Header */}
      <div className="mb-6 pb-4 border-b border-[#2e3347]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/15 flex items-center justify-center">
            <IconCash size={20} className="text-emerald-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Registrar pago</h3>
            <p className="text-sm text-gray-400">Imputá un cobro a una deuda existente</p>
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="form-error-modern mb-6">
          <span>⚠️</span>
          <p>{error}</p>
        </div>
      )}

      {/* Sección: Deuda */}
      <FormSection
        title="Deuda a cobrar"
        description="Seleccioná la deuda sobre la que se aplica el pago"
        icon={<IconReceipt size={16} className="text-emerald-400" />}
      >
        <div className="form-group-modern">
          <label className="form-label-modern">
            Deuda <span className="form-label-required">*</span>
          </label>
          <div className="form-input-wrapper">
            <IconReceipt size={18} className="form-input-icon" />
            <select
              name="deuda_id"
              value={form.deuda_id}
              onChange={onChange}
              className="form-input-modern"
              required
              disabled={isSubmitting}
            >
              <option value="">Seleccionar deuda</option>
              {deudas.length === 0
                ? <option value="" disabled>No hay deudas pendientes</option>
                : deudas.map(d => {
                    const saldo = d.moneda === 'USD'
                      ? `USD ${(d.saldo_pendiente / d.cotizacion).toLocaleString('es-AR', { minimumFractionDigits: 2 })}`
                      : `$${d.saldo_pendiente.toLocaleString('es-AR')} ARS`
                    return (
                      <option key={d.id} value={d.id} className="bg-[#242938]">
                        {d.clientes?.nombre} — {d.descripcion} (Saldo: {saldo})
                      </option>
                    )
                  })
              }
            </select>
          </div>
        </div>

        {/* Info saldo */}
        {deudaSeleccionada && (
          <div style={{
            background: 'rgba(29,158,117,0.06)',
            border: '0.5px solid rgba(29,158,117,0.2)',
            borderRadius: 12,
            padding: '12px 16px',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <span style={{ fontSize: 13, color: '#6b7280' }}>Saldo pendiente</span>
              <div style={{ textAlign: 'right' }} translate="no">
                <p style={{ fontSize: 14, fontWeight: 600, color: '#60a5fa' }}>
                  ${saldoARS.toLocaleString('es-AR', { minimumFractionDigits: 2 })} ARS
                </p>
                {deudaSeleccionada.moneda === 'USD' && (
                  <p style={{ fontSize: 12, color: '#fbbf24', marginTop: 2 }}>
                    ≈ USD {saldoUSD.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                  </p>
                )}
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
              <span style={{ fontSize: 12, color: '#6b7280' }}>Moneda original</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: deudaSeleccionada.moneda === 'USD' ? '#fbbf24' : '#60a5fa' }} translate="no">
                {deudaSeleccionada.moneda === 'USD' ? 'USD' : 'ARS'}
              </span>
            </div>
          </div>
        )}
      </FormSection>

      {/* Sección: Monto y moneda */}
      <FormSection
        title="Monto del pago"
        description="Ingresá el monto y la moneda en que se cobra"
        icon={<IconCurrencyDollar size={16} className="text-emerald-400" />}
      >
        {/* Moneda */}
        <div className="form-group-modern">
          <label className="form-label-modern">
            Moneda del pago <span className="form-label-required">*</span>
          </label>
          <div className="grid grid-cols-2 gap-3" translate="no">
            {(['ARS', 'USD'] as const).map(m => (
              <button
                key={m}
                type="button"
                onClick={() => onMonedaPagoChange(m)}
                disabled={isSubmitting || !form.deuda_id}
                className={`flex items-center justify-center gap-2 py-3 rounded-xl border-2 font-medium transition-all
                  ${form.moneda_pago === m
                    ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400'
                    : 'border-[#2e3347] text-gray-400 hover:border-[#3a4159] hover:text-white'}
                  disabled:opacity-40`}
              >
                {m === 'ARS'
                  ? <IconCurrencyPeso size={18} />
                  : <IconCurrencyDollar size={18} />}
                <span>{m}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Monto */}
        <div className="form-group-modern">
          <label className="form-label-modern">
            Monto en {form.moneda_pago} <span className="form-label-required">*</span>
          </label>
          <div className="form-input-wrapper">
            <IconCurrencyDollar size={18} className="form-input-icon" />
            <input
              type="text"
              inputMode="decimal"
              name="monto"
              placeholder="0.00"
              value={form.monto}
              onChange={onChange}
              disabled={isSubmitting || !form.deuda_id}
              required
              autoComplete="off"
              translate="no"
              className="form-input-modern"
            />
          </div>
        </div>

        {/* Cotización */}
        {form.deuda_id && hayConversion && (
          <div style={{
            background: 'rgba(29,158,117,0.05)',
            border: '0.5px solid rgba(29,158,117,0.2)',
            borderRadius: 12,
            padding: '14px 16px',
          }}>
            <label className="form-label-modern" translate="no">
              Cotización USD → ARS
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <span style={{ fontSize: 13, color: '#6b7280', flexShrink: 0 }} translate="no">1 USD =</span>
              <div className="form-input-wrapper" style={{ flex: 1 }}>
                <IconCalendar size={18} className="form-input-icon" />
                <input
                  type="text"
                  inputMode="decimal"
                  name="cotizacion_pago"
                  value={form.cotizacion_pago}
                  onChange={onChange}
                  disabled={isSubmitting}
                  autoComplete="off"
                  translate="no"
                  className="form-input-modern"
                />
              </div>
              <span style={{ fontSize: 13, color: '#6b7280', flexShrink: 0 }} translate="no">ARS</span>
              {cargandoCotizacion && (
                <span style={{ fontSize: 11, color: '#1D9E75' }} className="animate-pulse">cargando...</span>
              )}
            </div>
            <p style={{ fontSize: 12, color: '#6b7280' }}>
              Referencia: ${cotizacionActual.toLocaleString('es-AR')} ARS
            </p>
            {montoNum > 0 && (
              <div style={{
                borderTop: '0.5px solid rgba(29,158,117,0.2)',
                marginTop: 10, paddingTop: 10,
                fontSize: 12, color: '#94a3b8',
              }} translate="no">
                {esUSD ? (
                  <p>
                    USD {montoNum.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                    {' × '}${cotizacionNum.toLocaleString('es-AR')}
                    {' = '}
                    <strong style={{ color: '#60a5fa' }}>
                      ${montoEnARS.toLocaleString('es-AR', { minimumFractionDigits: 2 })} ARS
                    </strong>
                  </p>
                ) : (
                  <p>
                    ${montoNum.toLocaleString('es-AR', { minimumFractionDigits: 2 })} ARS
                    {' ÷ '}${cotizacionNum.toLocaleString('es-AR')}
                    {' = '}
                    <strong style={{ color: '#fbbf24' }}>
                      USD {(montoNum / cotizacionNum).toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                    </strong>
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </FormSection>

      {/* Sección: Método */}
      <FormSection
        title="Método de pago"
        description="¿Cómo se realizó el cobro?"
        icon={<IconCash size={16} className="text-emerald-400" />}
      >
        <div className="grid grid-cols-2 gap-2">
          {METODOS.map(m => (
            <button
              key={m.value}
              type="button"
              onClick={() => onChange({ target: { name: 'metodo_pago', value: m.value } } as React.ChangeEvent<HTMLInputElement>)}
              disabled={isSubmitting}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border-2 text-sm font-medium transition-all text-left
                ${form.metodo_pago === m.value
                  ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400'
                  : 'border-[#2e3347] text-gray-400 hover:border-[#3a4159] hover:text-white'}
                disabled:opacity-40`}
            >
              <span>{m.emoji}</span>
              {m.label}
            </button>
          ))}
        </div>
      </FormSection>

      {/* Sección: Observaciones */}
      <FormSection
        title="Observaciones"
        description="Notas opcionales sobre el pago"
        icon={<IconNotes size={16} className="text-emerald-400" />}
      >
        <div className="form-group-modern">
          <div className="form-input-wrapper">
            <IconNotes size={18} className="form-input-icon" />
            <input
              name="observaciones"
              placeholder="Ej: Pago parcial acordado con el cliente..."
              value={form.observaciones}
              onChange={onChange}
              className="form-input-modern"
              disabled={isSubmitting}
            />
          </div>
        </div>
      </FormSection>

      {/* Resumen */}
      {montoNum > 0 && (
        <div style={{
          background: '#1e2334',
          borderRadius: 12,
          padding: '12px 16px',
          marginBottom: 8,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        }} translate="no">
          <span style={{ fontSize: 13, color: '#6b7280' }}>Se registrará</span>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: 15, fontWeight: 700, color: '#60a5fa' }}>
              ${montoEnARS.toLocaleString('es-AR', { minimumFractionDigits: 2 })} ARS
            </p>
            {esUSD && (
              <p style={{ fontSize: 12, color: '#fbbf24', marginTop: 2 }}>
                USD {montoNum.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
              </p>
            )}
            {form.metodo_pago && (
              <p style={{ fontSize: 11, color: '#6b7280', marginTop: 4 }}>
                {METODOS.find(m => m.value === form.metodo_pago)?.emoji}{' '}
                {METODOS.find(m => m.value === form.metodo_pago)?.label}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Botones */}
      <div className="form-actions-modern mt-6">
        <button
          type="submit"
          disabled={isSubmitting || !form.deuda_id || !form.monto}
          className="btn-submit-modern"
        >
          {isSubmitting ? (
            <><span className="spinner-small" /> Registrando...</>
          ) : (
            <><IconDeviceFloppy size={18} /> Registrar pago</>
          )}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="btn-cancel-modern"
        >
          <IconX size={18} /> Cancelar
        </button>
      </div>

    </form>
  )
}