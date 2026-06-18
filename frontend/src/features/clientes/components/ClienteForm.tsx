// frontend/src/features/clientes/components/ClienteForm.tsx
import type { ClienteFormData, Cliente } from '../types'
import type { ReactNode } from 'react'
import { 
  IconUser, 
  IconId, 
  IconPhone, 
  IconMail, 
  IconBuilding, 
  IconMapPin, 
  IconBuildingCommunity, 
  IconMap, 
  IconNotes, 
  IconDeviceFloppy, 
  IconX,
  IconBriefcase,
  IconLocation
} from '@tabler/icons-react'
import { FormSection } from '../../../components/ui/FormSection'
import '../../../styles/forms.css'

interface ClienteFormProps {
  form: ClienteFormData
  editando: Cliente | null
  error: string
  isSubmitting: boolean
  nombreInputRef: React.MutableRefObject<HTMLInputElement | null>
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  onSubmit: (e: React.FormEvent) => void
  onCancel: () => void
}

interface FormFieldProps {
  icon: React.ElementType
  label: string
  required?: boolean
  name: string
  value: string | null
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  placeholder: string
  type?: string
  disabled?: boolean
  ref?: React.MutableRefObject<HTMLInputElement | null>
}

interface FormTextAreaProps {
  icon: React.ElementType
  label: string
  name: string
  value: string | null
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  placeholder: string
  disabled?: boolean
}

interface FormRowProps {
  children: ReactNode
}

// Componente de campo con icono integrado
function FormField({ 
  icon: Icon, 
  label, 
  required, 
  name, 
  value, 
  onChange, 
  placeholder, 
  type = 'text',
  disabled,
  ref
}: FormFieldProps) {
  return (
    <div className="form-group-modern">
      <label className="form-label-modern">
        {label}
        {required && <span className="form-label-required">*</span>}
      </label>
      <div className="form-input-wrapper">
        <Icon size={18} className="form-input-icon" />
        <input
          ref={ref}
          name={name}
          type={type}
          placeholder={placeholder}
          value={value || ''}
          onChange={onChange}
          className="form-input-modern"
          disabled={disabled}
          required={required}
        />
      </div>
    </div>
  )
}

function FormTextArea({ 
  icon: Icon, 
  label, 
  name, 
  value, 
  onChange, 
  placeholder, 
  disabled 
}: FormTextAreaProps) {
  return (
    <div className="form-group-modern">
      <label className="form-label-modern">{label}</label>
      <div className="form-input-wrapper">
        <Icon size={18} className="form-input-icon" />
        <textarea
          name={name}
          placeholder={placeholder}
          value={value || ''}
          onChange={onChange}
          rows={3}
          className="form-textarea-modern"
          disabled={disabled}
        />
      </div>
    </div>
  )
}

function FormRow({ children }: FormRowProps) {
  return <div className="form-row-modern">{children}</div>
}

export function ClienteForm({
  form,
  editando,
  error,
  isSubmitting,
  nombreInputRef,
  onChange,
  onSubmit,
  onCancel,
}: ClienteFormProps) {
  return (
    <form onSubmit={onSubmit} noValidate className="form-container-modern">
      {/* Header del formulario */}
      <div className="mb-6 pb-4 border-b border-[#2e3347]">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/15 flex items-center justify-center">
            <IconUser size={20} className="text-emerald-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">
              {editando ? 'Editar cliente' : 'Crear cliente'}
            </h3>
            <p className="text-sm text-gray-400">
              Información personal y comercial
            </p>
          </div>
        </div>
      </div>

      {/* Mensaje de error */}
      {error && (
        <div className="form-error-modern mb-6">
          <span>⚠️</span>
          <p>{error}</p>
        </div>
      )}

      {/* Sección: Datos personales */}
      <FormSection 
        title="Datos personales" 
        description="Información básica del cliente"
        icon={<IconUser size={16} className="text-emerald-400" />}
      >
        <FormRow>
          <FormField
            icon={IconUser}
            label="Nombre"
            required
            name="nombre"
            value={form.nombre}
            onChange={onChange}
            placeholder="Ej: Juan"
            disabled={isSubmitting}
            ref={nombreInputRef}
          />
          <FormField
            icon={IconUser}
            label="Apellido"
            required
            name="apellido"
            value={form.apellido}
            onChange={onChange}
            placeholder="Ej: Pérez"
            disabled={isSubmitting}
          />
        </FormRow>

        <FormField
          icon={IconId}
          label="DNI / CUIT"
          required
          name="dni"
          value={form.dni}
          onChange={onChange}
          placeholder="20-12345678-9"
          disabled={isSubmitting}
        />

        <FormField
          icon={IconPhone}
          label="Teléfono"
          required
          name="telefono"
          value={form.telefono || ''}
          onChange={onChange}
          placeholder="+54 9 351 000-0000"
          disabled={isSubmitting}
        />

        <FormField
          icon={IconMail}
          label="Email"
          name="email"
          type="email"
          value={form.email || ''}
          onChange={onChange}
          placeholder="juan@email.com"
          disabled={isSubmitting}
        />
      </FormSection>

      {/* Sección: Datos comerciales */}
      <FormSection 
        title="Información comercial" 
        description="Datos de la empresa o negocio"
        icon={<IconBriefcase size={16} className="text-emerald-400" />}
      >
        <FormField
          icon={IconBuilding}
          label="Empresa / Razón social"
          name="empresa"
          value={form.empresa || ''}
          onChange={onChange}
          placeholder="Empresa S.A."
          disabled={isSubmitting}
        />
      </FormSection>

      {/* Sección: Ubicación */}
      <FormSection 
        title="Ubicación" 
        description="Dirección y localización"
        icon={<IconLocation size={16} className="text-emerald-400" />}
      >
        <FormField
          icon={IconMapPin}
          label="Dirección"
          name="direccion"
          value={form.direccion || ''}
          onChange={onChange}
          placeholder="Av. Colón 1234"
          disabled={isSubmitting}
        />

        <FormRow>
          <FormField
            icon={IconBuildingCommunity}
            label="Ciudad"
            name="ciudad"
            value={form.ciudad || ''}
            onChange={onChange}
            placeholder="Córdoba"
            disabled={isSubmitting}
          />
          <FormField
            icon={IconMap}
            label="Provincia"
            name="provincia"
            value={form.provincia || ''}
            onChange={onChange}
            placeholder="Córdoba"
            disabled={isSubmitting}
          />
        </FormRow>
      </FormSection>

      {/* Sección: Información adicional */}
      <FormSection 
        title="Información adicional" 
        description="Notas y observaciones"
        icon={<IconNotes size={16} className="text-emerald-400" />}
      >
        <FormTextArea
          icon={IconNotes}
          label="Observaciones"
          name="observaciones"
          value={form.observaciones || ''}
          onChange={onChange}
          placeholder="Ej: Prefiere pago por transferencia"
          disabled={isSubmitting}
        />
      </FormSection>

      {/* Botones */}
      <div className="form-actions-modern mt-8">
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-submit-modern"
        >
          {isSubmitting ? (
            <>
              <span className="spinner-small" />
              Guardando...
            </>
          ) : (
            <>
              <IconDeviceFloppy size={18} />
              {editando ? 'Guardar cambios' : 'Crear cliente'}
            </>
          )}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="btn-cancel-modern"
        >
          <IconX size={18} />
          Cancelar
        </button>
      </div>
    </form>
  )
}