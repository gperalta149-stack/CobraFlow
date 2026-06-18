import { supabase } from '../config/supabase'

// Obtener cotización oficial desde API externa
export const fetchOfficialExchangeRate = async () => {
  try {
    const response = await fetch('https://dolarapi.com/v1/dolares/oficial')
    const data = await response.json()
    
    console.log('📊 Datos de API oficial:', data)
    
    // La API devuelve: { compra: 1400, venta: 1450 }
    // Devolvemos tal cual
    return {
      compra: Number(data.compra),
      venta: Number(data.venta),
      fecha: new Date().toISOString(),
      fuente: 'oficial'
    }
  } catch (error) {
    console.error('Error fetching official rate:', error)
    // Fallback con valores correctos
    return {
      compra: 1400,
      venta: 1450,
      fecha: new Date().toISOString(),
      fuente: 'oficial_fallback'
    }
  }
}

// Obtener cotización blue desde API externa
export const fetchBlueExchangeRate = async () => {
  try {
    const response = await fetch('https://dolarapi.com/v1/dolares/blue')
    const data = await response.json()
    
    console.log('📊 Datos de API blue:', data)
    
    // La API devuelve: { compra: 1400, venta: 1450 }
    // Devolvemos tal cual
    return {
      compra: Number(data.compra),
      venta: Number(data.venta),
      fecha: new Date().toISOString(),
      fuente: 'blue'
    }
  } catch (error) {
    console.error('Error fetching blue rate:', error)
    // Fallback con valores correctos
    return {
      compra: 1400,
      venta: 1450,
      fecha: new Date().toISOString(),
      fuente: 'blue_fallback'
    }
  }
}

// Guardar cotización en BD
export const saveExchangeRate = async (compra: number, venta: number, fuente: string) => {
  // Asegurar orden correcto: compra MENOR, venta MAYOR
  const compraFinal = Math.min(compra, venta)
  const ventaFinal = Math.max(compra, venta)
  
  const { data, error } = await supabase
    .from('tipo_cambio')
    .insert({
      compra: compraFinal,
      venta: ventaFinal,
      fuente,
      fecha: new Date().toISOString()
    })
    .select()
    .single()
  
  if (error) throw error
  return data
}

// Obtener cotización actual desde BD
export const getCurrentExchangeRate = async () => {
  const { data, error } = await supabase
    .from('tipo_cambio')
    .select('*')
    .order('fecha', { ascending: false })
    .limit(1)
    .single()
  
  if (error) {
    console.error('Error getting current exchange rate:', error)
    return null
  }
  
  // Asegurar orden correcto al devolver
  if (data) {
    return {
      ...data,
      compra: Math.min(data.compra, data.venta),
      venta: Math.max(data.compra, data.venta)
    }
  }
  
  return data
}

// Actualizar cotización diaria
export const updateDailyExchangeRate = async () => {
  try {
    const officialRate = await fetchOfficialExchangeRate()
    
    const saved = await saveExchangeRate(
      officialRate.compra,
      officialRate.venta,
      'oficial_daily'
    )
    
    console.log('✅ Cotización diaria actualizada:', saved)
    return saved
  } catch (error) {
    console.error('Error updating daily exchange rate:', error)
    throw error
  }
}