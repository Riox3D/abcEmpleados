import axios from 'axios'
import { config } from '../config/config.js'

export const uploadFileService = async (fileData) => {
  try {
    const response = await axios.post(config.BASE_URL_ADJUNTOS, fileData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return response.data
  } catch (error) {
    console.error('Error en uploadFileService:', error.message)
    throw error
  }
}
