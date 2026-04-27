const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Login.vue') }, // pública
      { path: 'home', component: () => import('pages/IndexPage.vue'), meta: { requiresAuth: true } }, // privada
      { path: 'dashboard', component: () => import('pages/Dashboard.vue'), meta: { requiresAuth: true } }, // privado
      { path: 'reportes', component: () => import('pages/Reportes.vue'), meta: { requiresAuth: true }},// privado



    ]
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
