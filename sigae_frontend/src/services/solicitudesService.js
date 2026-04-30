import { api } from 'boot/axios' 

export const solicitudesService = {
  // 1. Guardar una nueva solicitud (RH)
  async enviarAlta(claveUsrRegistro, claveEmpleado, datos) {
    // Quitamos /api/ de la ruta
    const response = await api.post(`/solicitudes/guardar/${claveUsrRegistro}/${claveEmpleado}`, datos)
    return response.data
  },

  // 2. Obtener todas las solicitudes filtradas por ROL
  async obtenerTodas(rol, identificador) {
    // Quitamos /api/ de la ruta
    const response = await api.get(`/solicitudes/get-todas/${rol}/${identificador}`)
    return response.data 
  },

  // 3. Ver el seguimiento de una específica (Detalle + Pasos)
  async obtenerSeguimiento(id) {
    // Quitamos /api/ de la ruta
    const response = await api.get(`/solicitudes/seguimiento/${id}`)
    return response.data
  },

  // 4. Actualizar el estatus (TI y Gerencia)
  async actualizarEstatus(id, payload) {
    // Quitamos /api/ de la ruta
    const response = await api.put(`/solicitudes/actualizar-estatus/${id}`, payload)
    return response.data
  }
}