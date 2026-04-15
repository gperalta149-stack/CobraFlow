import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-900 overflow-hidden flex flex-col">

      {/* 🔵 BACKGROUND GLOW */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-400 opacity-30 blur-3xl rounded-full"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500 opacity-30 blur-3xl rounded-full"></div>

      {/* NAVBAR */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-5 backdrop-blur-md bg-white/10 border-b border-white/20">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center shadow">
            <span className="text-blue-600 font-bold">CF</span>
          </div>
          <span className="text-white font-bold text-xl tracking-wide">
            CobraFlow
          </span>
        </div>

        <Link
          to="/login"
          className="bg-white text-blue-600 font-semibold px-5 py-2 rounded-lg shadow hover:scale-105 hover:shadow-lg transition"
        >
          Iniciar sesión
        </Link>
      </nav>

      {/* HERO */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6 py-16">

        {/* Badge */}
        <span className="bg-white/10 text-white text-sm px-4 py-1 rounded-full mb-6 border border-white/20 backdrop-blur">
          Sistema de gestión financiera para PYMES
        </span>

        {/* Título */}
        <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-6 leading-tight">
          Automatizá tus cobranzas
          <br />
          <span className="bg-gradient-to-r from-blue-200 to-white text-transparent bg-clip-text">
            y recuperá tu dinero más rápido
          </span>
        </h1>

        {/* Descripción */}
        <p className="text-blue-100 text-lg max-w-xl mb-10">
          Gestioná clientes, deudas y pagos en un solo lugar.
          Tomá decisiones con datos reales y dejá de perder plata por desorden.
        </p>

        {/* Botones */}
        <div className="flex gap-4 flex-wrap justify-center">
          <Link
            to="/login"
            className="bg-white text-blue-600 font-semibold px-8 py-3 rounded-lg shadow-lg hover:scale-105 hover:shadow-xl transition"
          >
            Ingresar
          </Link>

          <Link
            to="/register"
            className="border border-white text-white font-semibold px-8 py-3 rounded-lg hover:bg-white/10 transition"
          >
            Crear cuenta
          </Link>
        </div>

        {/* MOCK DASHBOARD (clave visual) */}
        <div className="mt-20 w-full max-w-4xl bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-xl p-6 text-left">
          <p className="text-white font-semibold mb-4">Dashboard</p>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white/20 p-4 rounded-xl">
              <p className="text-sm text-blue-100">Clientes</p>
              <p className="text-2xl font-bold text-white">128</p>
            </div>

            <div className="bg-white/20 p-4 rounded-xl">
              <p className="text-sm text-blue-100">Deudas activas</p>
              <p className="text-2xl font-bold text-white">$1.2M</p>
            </div>

            <div className="bg-white/20 p-4 rounded-xl">
              <p className="text-sm text-blue-100">Cobrado este mes</p>
              <p className="text-2xl font-bold text-green-300">$320K</p>
            </div>
          </div>
        </div>

        {/* FEATURES */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 max-w-4xl w-full">
          
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:scale-105 transition">
            <h3 className="text-white font-semibold mb-2">Clientes</h3>
            <p className="text-blue-200 text-sm">
              Organizá toda la información de tus clientes fácilmente.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:scale-105 transition">
            <h3 className="text-white font-semibold mb-2">Deudas</h3>
            <p className="text-blue-200 text-sm">
              Controlá estados, vencimientos y saldos en tiempo real.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:scale-105 transition">
            <h3 className="text-white font-semibold mb-2">Pagos</h3>
            <p className="text-blue-200 text-sm">
              Registrá ingresos y mantené todo actualizado automáticamente.
            </p>
          </div>
        </div>

        {/* HOW IT WORKS */}
        <div className="mt-24 text-center">
          <h2 className="text-3xl font-bold text-white mb-10">
            ¿Cómo funciona?
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-white">
              <p className="text-4xl font-bold mb-2">1</p>
              <p>Registrás clientes</p>
            </div>

            <div className="text-white">
              <p className="text-4xl font-bold mb-2">2</p>
              <p>Cargás deudas</p>
            </div>

            <div className="text-white">
              <p className="text-4xl font-bold mb-2">3</p>
              <p>Registrás pagos</p>
            </div>
          </div>
        </div>

        {/* CTA FINAL */}
        <div className="mt-24">
          <h2 className="text-3xl text-white font-bold mb-6">
            Empezá hoy gratis 🚀
          </h2>

          <Link
            to="/register"
            className="bg-white text-blue-600 font-semibold px-10 py-3 rounded-lg shadow-lg hover:scale-105 hover:shadow-xl transition"
          >
            Crear cuenta
          </Link>
        </div>

      </div>

      {/* FOOTER */}
      <footer className="relative z-10 text-center text-blue-200 text-sm py-6 border-t border-white/10">
        © 2026 CobraFlow — Sistema de cobranzas para PYMES
      </footer>

    </div>
  )
}