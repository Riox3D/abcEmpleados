// utils/sqlService.js
import axios from 'axios'
import { config } from '../config/config.js'

/**
 * Hace consulta a SQL pasando parámetros en ruta y body.
 * @param {string} endpoint - Endpoint relativo (ej. 'usuarios/123')
 * @param {string} method - Método HTTP ('get', 'post', 'put', etc.)
 * @param {object} data - { body, query }
 * @returns {Promise<object>} - Respuesta del servicio SQL
 */
export const querySqlService = async (endpoint, method, data) => {
  try {
    const url = `${config.URL_SQL}${endpoint}`
    
    const response = await axios({
      url,
      method,
      data: data.body,
      params: data.query, 
      headers: {
        'Content-Type': 'application/json',
      }
    })

    // En éxito, regresamos todo el response
    /* return response.data */

    // ✅ Devolvemos status y data
    return { status: response.status, data: response.data }

  } catch (error) {
    console.error('Error en querySqlService:', error.message)

    if (error.response) {
      // Propagamos el status y el body que vino del back SQL
      throw {
        status: error.response.status,
        data: error.response.data
      }
    } else {
      // Error de red, timeout, etc.
      throw {
        status: 500,
        data: { message: 'Error al conectar con SQL Service', error: error.message }
      }
    }
  }
}
