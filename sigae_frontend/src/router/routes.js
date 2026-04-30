const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/SolicitudesRH.vue') },
      { path: '/registro', component: () => import('pages/RegistroSolicitud.vue') },
      { path: '/seguimiento/:id', component: () => import('pages/SeguimientoSolicitud.vue') },
    ],
  },

  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
