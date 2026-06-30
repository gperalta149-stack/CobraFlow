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

// ============================================
// GUARDAR COTIZACIÓN (USANDO RPC CON UPSERT)
// ============================================
export const saveExchangeRate = async (compra: number, venta: number, fuente: string) => {
  // Asegurar orden correcto: compra MENOR, venta MAYOR
  const compraFinal = Math.min(compra, venta)
  const ventaFinal = Math.max(compra, venta)
  
  // ✅ Usar la RPC guardar_cotizacion que ya existe en la BD
  // Esta función hace ON CONFLICT (fecha) DO UPDATE
  const { data, error } = await supabase
    .rpc('guardar_cotizacion', {
      p_compra: compraFinal,
      p_venta: ventaFinal,
      p_fuente: fuente
    })
    .single()
  
  if (error) {
    console.error('Error guardando cotización con RPC:', error)
    throw error
  }
  
  return data
}

// ============================================
// OBTENER COTIZACIÓN ACTUAL (USANDO RPC)
// ============================================
export const getCurrentExchangeRate = async () => {
  try {
    // ✅ Usar la RPC obtener_cotizacion_vigente() para consistencia
    const { data, error } = await supabase
      .rpc('obtener_cotizacion_vigente')
      .single()
    
    if (error) {
      console.error('Error getting current exchange rate:', error)
      return null
    }
    
    return data
  } catch (error) {
    console.error('Error inesperado en getCurrentExchangeRate:', error)
    return null
  }
}

// ============================================
// ACTUALIZAR COTIZACIÓN DIARIA
// ============================================
export const updateDailyExchangeRate = async () => {
  try {
    // Intentar obtener cotización oficial
    const officialRate = await fetchOfficialExchangeRate()
    
    const saved = await saveExchangeRate(
      officialRate.compra,
      officialRate.venta,
      'oficial_daily'
    )
    
    console.log('✅ Cotización diaria actualizada:', saved)
    return saved
  } catch (error) {
    console.error('❌ Error updating daily exchange rate:', error)
    throw error
  }
}

// ============================================
// ACTUALIZAR COTIZACIÓN BLUE (MANUAL)
// ============================================
export const updateBlueExchangeRate = async () => {
  try {
    const blueRate = await fetchBlueExchangeRate()
    
    const saved = await saveExchangeRate(
      blueRate.compra,
      blueRate.venta,
      'blue_manual'
    )
    
    console.log('✅ Cotización blue actualizada:', saved)
    return saved
  } catch (error) {
    console.error('❌ Error updating blue exchange rate:', error)
    throw error
  }
}