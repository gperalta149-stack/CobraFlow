import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authApi } from '../services/authApi'
import { handleApiError } from '../../../utils/handleApiError'
import type { RegisterForm } from '../types'

export function useRegister() {
  const navigate = useNavigate()

  const [form, setForm] = useState<RegisterForm>({
    nombre: '',
    email: '',
    password: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await authApi.register(form)
      navigate('/login')
    } catch (err) {
      setError(handleApiError(err, 'Error al registrarse'))
    } finally {
      setLoading(false)
    }
  }

  return { form, loading, error, handleChange, handleSubmit }
}