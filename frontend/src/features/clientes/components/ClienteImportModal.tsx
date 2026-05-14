import { useState, useRef } from 'react'
import { clientesApi } from '../services/clientesApi'

interface ClienteImportModalProps {
  onClose: () => void
  onSuccess: () => void
}

export function ClienteImportModal({ onClose, onSuccess }: ClienteImportModalProps) {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ mensaje: string; errores?: string[] } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImport = async () => {
    if (!file) return

    setLoading(true)
    setResult(null)

    try {
      const { data } = await clientesApi.importCsv(file)
      setResult(data)
      if (!data.errores) {
        setTimeout(() => {
          onSuccess()
          onClose()
        }, 1500)
      }
    } catch (err: any) {
      setResult({ mensaje: err.response?.data?.error || 'Error al importar' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Importar clientes</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-xl">
            ✕
          </button>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Archivo CSV o Excel
          </label>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="w-full border border-gray-300 rounded-lg p-2"
          />
          <p className="text-xs text-gray-500 mt-2">
            El archivo debe tener una columna <span className="font-medium">"nombre"</span> como mínimo.
            <br />
            Columnas opcionales: email, teléfono, dirección
          </p>
        </div>

        {result && (
          <div className={`p-3 rounded-lg mb-4 text-sm ${result.errores ? 'bg-yellow-50 text-yellow-800' : 'bg-green-50 text-green-800'}`}>
            <p className="font-medium">{result.mensaje}</p>
            {result.errores && result.errores.length > 0 && (
              <div className="mt-2 text-xs max-h-32 overflow-y-auto">
                {result.errores.slice(0, 5).map((err, i) => (
                  <p key={i}>• {err}</p>
                ))}
                {result.errores.length > 5 && (
                  <p>... y {result.errores.length - 5} más</p>
                )}
              </div>
            )}
          </div>
        )}

        <div className="flex gap-2">
          <button
            onClick={handleImport}
            disabled={!file || loading}
            className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Importando...' : 'Importar'}
          </button>
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  )
}