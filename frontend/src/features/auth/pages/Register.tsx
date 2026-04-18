import AuthLayout from '../components/AuthLayout'
import AuthForm from '../components/AuthForm'
import { useRegister } from '../hooks/useRegister'

export default function Register() {
  const { form, loading, error, handleChange, handleSubmit } = useRegister()

  return (
    <AuthLayout>
      <AuthForm
        form={form}
        loading={loading}
        error={error}
        onChange={handleChange}
        onSubmit={handleSubmit}
        isLogin={false}
      />
    </AuthLayout>
  )
}