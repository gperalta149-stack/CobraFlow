import AuthLayout from '../components/AuthLayout'
import AuthForm from '../components/AuthForm'
import { useLogin } from '../hooks/useLogin'

export default function Login() {
  const { form, loading, error, handleChange, handleSubmit } = useLogin()

  return (
    <AuthLayout>
      <AuthForm
        form={form}
        loading={loading}
        error={error}
        onChange={handleChange}
        onSubmit={handleSubmit}
        isLogin={true}
      />
    </AuthLayout>
  )
}