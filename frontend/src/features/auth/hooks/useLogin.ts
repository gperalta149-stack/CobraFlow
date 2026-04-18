import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { authApi } from '../services/authApi'
import { handleApiError } from '../../../utils/handleApiError'
import type { LoginForm } from '../types'

export function useLogin() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [form, setForm] = useState<LoginForm>({
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
      const { data } = await authApi.login(form)
      login(data.token, data.usuario)
      navigate('/dashboard')
    } catch (err) {
      setError(handleApiError(err, 'Credenciales incorrectas'))
    } finally {
      setLoading(false)
    }
  }

  return { form, loading, error, handleChange, handleSubmit }
}