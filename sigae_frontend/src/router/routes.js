
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Login.vue') }, // pública
      { path: 'home', component: () => import('pages/SolicitudesRH.vue') },
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




/* const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Login.vue') }, // pública
      { path: 'home', component: () => import('pages/IndexPage.vue'), meta: { requiresAuth: true } }, // privada
      { path: 'dashboard', component: () => import('pages/Dashboard.vue'), meta: { requiresAuth: true } }, // privado
      { path: 'incidencias', component: () => import('pages/incidenciasUser.vue'), meta: { requiresAuth: true } },// privado
      { path: 'consultas', component: () => import('pages/incidenciasRH.vue'), meta: { requiresAuth: true } }, // nuevo
      { path: 'saldos', component: () => import('pages/SaldosRH.vue'), meta: { requiresAuth: true } }, // gestion saldos
      { path: 'aprobaciones', component: () => import('pages/AprobacionesRechazos.vue'), meta: { requiresAuth: true } },// privado


    ]
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes */
