import { route } from 'quasar/wrappers'
import { createRouter, createMemoryHistory, createWebHistory, createWebHashHistory } from 'vue-router'
import routes from './routes'
import { useAuthStore } from 'stores/authStore'

export default route(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : (process.env.VUE_ROUTER_MODE === 'history' ? createWebHistory : createWebHashHistory)

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,
    history: createHistory(process.env.VUE_ROUTER_BASE)
  })

  /*   Router.beforeEach((to, from, next) => {
      const authStore = useAuthStore()
  
      if (to.meta.requiresAuth && !authStore.isAuthenticated) {
        return next({ path: '/' }) // o ruta de login
      }
      next()
    })
   */

    Router.beforeEach((to, from, next) => {
      const authStore = useAuthStore();
      const publicRoutes = ['/', '/login'];
      
      // 1. Agregamos las rutas ocultas que no están en el menú pero son válidas
      const hiddenInternalRoutes = ['/registro']; 
    
      // Si entra a '/' y está autenticado, redirige a '/home'
      if (to.path === '/' && authStore.isAuthenticated) {
        if (from.path !== '/home') {
          return next({ path: '/home' });
        }
      }
    
      if (to.meta.requiresAuth && !authStore.isAuthenticated) {
        if (to.path !== '/') {
          return next({ path: '/' });
        }
      }
    
      if (authStore.isAuthenticated) {
        const allowedRoutes = authStore.menu.map(item => item.to);
        
        const isSeguimiento = to.path.startsWith('/seguimiento/');
    
        if (
          !allowedRoutes.includes(to.path) && 
          !publicRoutes.includes(to.path) &&
          !hiddenInternalRoutes.includes(to.path) &&
          !isSeguimiento
        ) {
          if (to.path !== '/home') {
            return next({ path: '/home' });
          }
        }
      }
    
      next();
    });

  return Router
})
