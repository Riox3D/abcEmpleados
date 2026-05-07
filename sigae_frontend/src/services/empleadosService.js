import { api } from 'boot/axios'

export const empleadosService = {
  buscar: async (termino) => {
    try {
      const response = await api.get(`/api/empleados/buscar/${termino}`)
      return response.data
    } catch (error) {
      console.error("Error al buscar empleado:", error)
      return []
    }
  }
}