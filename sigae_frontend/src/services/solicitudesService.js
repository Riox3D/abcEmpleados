import { api } from 'boot/axios' 

export default {
  // 1. Guardar una nueva solicitud (RH)
  enviarAlta: async (datos) => {
    const claveUsrRegistro = 'ADM001' 
    const claveEmpleado = datos.claveEmpleado 
    
    const response = await api.post(`/api/solicitudes/guardar/${claveUsrRegistro}/${claveEmpleado}`, datos)
    return response.data
  },

  // 2. Obtener todas las solicitudes filtradas por ROL
  async obtenerTodas() {
    const response = await api.get(`/api/solicitudes/get-todas`)
    return response.data 
  },

  // 3. Ver el seguimiento de una específica (Detalle + Pasos)
  async obtenerSeguimiento(id) {
    // Quitamos el "get-" porque el 401 anterior confirma que esta es la ruta real
    const response = await api.get(`/api/solicitudes/seguimiento/${id}`) 
    return response.data
  },

  // 4. Actualizar el estatus (TI y Gerencia)
  async actualizarEstatus(id, payload) {
    const response = await api.put(`/api/solicitudes/actualizar-estatus/${id}`, payload)
    return response.data
  },
  async actualizarAvancesActividades(payload) {
    const response = await api.put('/api/solicitudes/actualizar-avances', payload)
    return response.data
  },
  async getCatalogoEmpleados(){
    const response = await api.get('/empleados/getCatalogoEmpleados')
    return response.data
  },
  async getEmpleado(numEmpleado){
    const response = await api.get('/empleados/getEmpleado/'+numEmpleado)
    return response.data
  },
}

