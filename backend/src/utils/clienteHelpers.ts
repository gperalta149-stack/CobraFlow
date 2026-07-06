import { supabase } from '../config/supabase'
import type { ClienteBasico } from '../types/cliente.types'

// Verifica que el cliente exista y pertenezca al usuario. Devuelve el cliente
// (con los campos pedidos) o null si no existe / no es suyo.
// Usado antes en 4 lugares distintos con el mismo select/eq/eq/single repetido.
export const buscarClientePropio = async <T extends ClienteBasico = ClienteBasico>(
  id: string,
  usuario_id: string,
  campos = 'id, nombre, apellido, activo'
): Promise<T | null> => {
  const { data, error } = await supabase
    .from('clientes')
    .select(campos)
    .eq('id', id)
    .eq('usuario_id', usuario_id)
    .single()

  if (error || !data) return null
  return data as unknown as T
}

// Verifica unicidad del DNI para un usuario, opcionalmente excluyendo un cliente
// (para permitir updates sin chocar contra el propio registro).
// Usado antes en 3 lugares con el mismo select/eq/eq/maybeSingle repetido.
export const dniYaExiste = async (
  usuario_id: string,
  dni: string,
  excluirId?: string
): Promise<boolean> => {
  let query = supabase
    .from('clientes')
    .select('id')
    .eq('dni', dni.trim())
    .eq('usuario_id', usuario_id)

  if (excluirId) query = query.neq('id', excluirId)

  const { data } = await query.maybeSingle()
  return !!data
}

// Sanitiza y arma el filtro .or() de búsqueda por nombre/apellido/dni/email.
// Usado antes en 3 lugares (getClientes, getClientesArchivados, exportClientesToExcel).
export const construirFiltroBusqueda = (buscar: string): string => {
  const seguro = buscar.replace(/[,()]/g, '')
  return `nombre.ilike.%${seguro}%,apellido.ilike.%${seguro}%,dni.ilike.%${seguro}%,email.ilike.%${seguro}%`
}