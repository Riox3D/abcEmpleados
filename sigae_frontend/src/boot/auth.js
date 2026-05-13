import { boot } from 'quasar/wrappers'
import { useAuthStore } from 'stores/authStore'
import { api } from './axios'

export default boot(async ({ router }) => {
  const authStore = useAuthStore()

  const tryRestoreSession = async () => {
    try {
      const response = await api.get('/auth/me') // valida cookie
      //let cloneIT = response.data;
      //cloneIT.role = 'pm'; // gerente  pm
      authStore.setUser(response.data)
      //console.debug('User connect [boot/auth.js]: ', response.data);
      const resMenu = await api.get('auth/menu')
      authStore.setMenu(resMenu.data)

      if (router.currentRoute.value.path === '/') {
        router.push('/home')
      }
    } catch (error) {
      console.error('No autenticado o error al restaurar sesión')
    }
  }

  // Al cargar la app
  if (!authStore.isAuthenticated) {
    await tryRestoreSession()
  } else if (router.currentRoute.value.path === '/') {
    const resMenu = await api.get('auth/menu')
    authStore.setMenu(resMenu.data)
    router.push('/home')
  }

  // Detectar cuando se vuelve a la pestaña
  window.addEventListener('visibilitychange', async () => {
    if (document.visibilityState === 'visible') {
      if (!authStore.isAuthenticated) {
        await tryRestoreSession()
      }
    }
  })
})