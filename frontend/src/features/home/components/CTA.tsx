import { Link } from 'react-router-dom'

export function CTA() {
  return (
    <section className="py-24 text-center px-6 bg-gradient-to-r from-blue-50 to-indigo-50">
      <h2 className="text-4xl md:text-5xl font-bold mb-4 animate-fade-in">
        Dejá de perder dinero por desorden
      </h2>
      <p className="text-xl text-gray-500 mb-10 animate-fade-in animation-delay-100">
        Sin costos ocultos. Sin complicaciones.
      </p>

      <Link
        to="/register"
        className="inline-block bg-blue-600 text-white px-10 py-4 rounded-xl text-lg md:text-xl font-semibold hover:bg-blue-700 transition transform hover:scale-105 active:scale-95 shadow-lg animate-fade-in animation-delay-200"
        aria-label="Crear cuenta gratis"
      >
        🚀 Crear cuenta gratis
      </Link>
    </section>
  )
}