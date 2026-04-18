import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import ProtectedRoute from '../features/auth/components/ProtectedRoute'

import Login from '../features/auth/pages/Login'
import Register from '../features/auth/pages/Register'
import Clientes from '../features/clientes/pages/Clientes'
import Dashboard from '../features/dashboard/pages/Dashboard'
import Deudas from '../features/deudas/pages/Deudas'
import Home from '../features/home/pages/Home'
import Pagos from '../features/pagos/pages/Pagos'
import Perfil from '../features/perfil/pages/Perfil'

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Públicas */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protegidas */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/clientes" element={<Clientes />} />
          <Route path="/deudas" element={<Deudas />} />
          <Route path="/pagos" element={<Pagos />} />
          <Route path="/perfil" element={<Perfil />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  )
}