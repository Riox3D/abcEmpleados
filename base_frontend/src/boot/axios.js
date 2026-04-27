import { Cookies } from 'quasar'
import { boot } from 'quasar/wrappers'
import axios from 'axios'
const url = import.meta.env.VITE_BACKEND
const api = axios.create({
  baseURL: url,
  withCredentials: true, // muy importante si el token está en cookies httpOnly
})

// Optional: agrega el token si no es httpOnly
api.interceptors.request.use((config) => {
  const token = Cookies.get('tokenjson')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default boot(({ app }) => {
  app.config.globalProperties.$axios = axios
  app.config.globalProperties.$api = api
})

export { api }
