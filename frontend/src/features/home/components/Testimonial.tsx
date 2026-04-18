export function Testimonial() {
  return (
    <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
      <div className="max-w-4xl mx-auto text-center px-6">
        <div className="text-6xl mb-4 opacity-50">“</div>
        <p className="text-xl md:text-2xl font-medium mb-6 italic">
          CobraFlow me cambió la forma de cobrar. Antes perdía horas con planillas, ahora todo está automatizado.
        </p>
        <div className="flex justify-center gap-1 mb-3">
          {[1, 2, 3, 4, 5].map((_, i) => (
            <span key={i} className="text-yellow-300 text-xl">★</span>
          ))}
        </div>
        <p className="font-semibold">Carlos M.</p>
        <p className="text-blue-200 text-sm">Comercio minorista</p>
      </div>
    </section>
  )
}