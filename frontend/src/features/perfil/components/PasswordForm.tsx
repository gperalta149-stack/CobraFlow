import { useState } from 'react'
import type { PasswordFormData } from '../types'

interface PasswordFormProps {
  form: PasswordFormData
  error: string
  exito: string
  isSubmitting: boolean
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onSubmit: (e: React.FormEvent) => void
}

export function PasswordForm({
  form,
  error,
  exito,
  isSubmitting,
  onChange,
  onSubmit
}: PasswordFormProps) {
  const [showPassword, setShowPassword] = useState({
    actual: false,
    nuevo: false,
    confirmar: false
  })

  const toggleShow = (field: keyof typeof showPassword) => {
    setShowPassword({ ...showPassword, [field]: !showPassword[field] })
  }

  const PasswordInput = ({ 
    field, 
    name, 
    placeholder, 
    value 
  }: { 
    field: keyof typeof showPassword
    name: string
    placeholder: string
    value: string
  }) => (
    <div className="relative">
      <input
        type={showPassword[field] ? "text" : "password"}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required
        disabled={isSubmitting}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        type="button"
        onClick={() => toggleShow(field)}
        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
      >
        {showPassword[field] ? (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
          </svg>
        )}
      </button>
    </div>
  )

  return (
    <div className="bg-white rounded-xl p-6 shadow">
      <h2 className="font-bold text-gray-700 mb-4">Cambiar contraseña</h2>
      
      {error && (
        <div className="bg-red-100 text-red-600 p-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {exito && (
        <div className="bg-green-100 text-green-600 p-3 rounded mb-4">
          {exito}
        </div>
      )}
      
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Contraseña actual
          </label>
          <PasswordInput
            field="actual"
            name="passwordActual"
            placeholder="Contraseña actual"
            value={form.passwordActual}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nueva contraseña
          </label>
          <PasswordInput
            field="nuevo"
            name="passwordNuevo"
            placeholder="Nueva contraseña"
            value={form.passwordNuevo}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Confirmar nueva contraseña
          </label>
          <PasswordInput
            field="confirmar"
            name="confirmar"
            placeholder="Confirmar contraseña"
            value={form.confirmar}
          />
        </div>
        
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {isSubmitting ? 'Cambiando...' : 'Cambiar contraseña'}
        </button>
      </form>
    </div>
  )
}