import { Link } from 'react-router-dom'

export function Hero() {
  return (
    <section className="relative pt-36 pb-20 text-center px-6 overflow-hidden">
      {/* Fondo decorativo */}
      <div className="absolute inset-0 -z-10 opacity-30 blur-3xl">
        <div className="w-[500px] h-[500px] bg-blue-400 rounded-full absolute top-10 -left-20 animate-pulse-subtle" />
        <div className="w-[400px] h-[400px] bg-indigo-400 rounded-full absolute bottom-10 -right-20 animate-pulse-subtle animation-delay-200" />
        <div className="w-[300px] h-[300px] bg-purple-400 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse-subtle animation-delay-500 opacity-50" />
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        <div className="mb-8 animate-fade-in">
          <span className="text-sm md:text-base bg-blue-100 text-blue-600 px-4 py-1.5 rounded-full font-medium">
            🚀 Plataforma de cobranza inteligente
          </span>
        </div>

        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight mb-8 animate-slide-up">
          Gestioná tus{' '}
          <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            cobranzas
          </span>{' '}
          sin esfuerzo
        </h1>

        <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto animate-slide-up animation-delay-100">
          Control total de deudas, pagos y clientes en un solo lugar.
          Automatizá tu negocio y aumentá tu recaudación.
        </p>

        <div className="flex flex-col sm:flex-row gap-5 justify-center animate-slide-up animation-delay-200">
          <Link
            to="/register"
            className="bg-blue-600 text-white px-10 py-4 rounded-xl text-lg md:text-xl font-semibold hover:bg-blue-700 transition transform hover:scale-105 active:scale-95 shadow-lg"
            aria-label="Comenzar ahora"
          >
            ✨ Comenzar ahora
          </Link>
          <Link
            to="/login"
            className="bg-white border border-gray-200 px-10 py-4 rounded-xl text-lg md:text-xl font-semibold hover:bg-gray-50 transition shadow-sm"
            aria-label="Ya tengo cuenta"
          >
            Ya tengo cuenta
          </Link>
        </div>
      </div>
    </section>
  )
}