const routes = [
  {
    path: '/',
    redirect: () => {
      return { name: 'task' }
    },
  },
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: 'task',
        name: 'task',
        component: () => import('src/pages/task/TaskPage.vue'),
      },
      {
        path: 'metrics',
        name: 'metrics',
        component: () => import('src/pages/metrics/MetricsPage.vue'),
      },
      {
        path: 'health',
        name: 'health',
        component: () => import('src/pages/health/HealthPage.vue'),
      },
      {
        path: 'swagger',
        name: 'swagger',
        beforeEnter(to, from, next) {
          const previousRoute = from.name
          window.open(`${import.meta.env.VITE_API_URL}/swagger`, '_blank')
          if (previousRoute) {
            next({ name: previousRoute })
          } else {
            next({ name: 'task' })
          }
        },
      },
    ],
  },
  {
    path: '/auth',
    component: () => import('layouts/AuthLayout.vue'),
    meta: { guest: true },
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import('pages/auth/LoginPage.vue'),
      },
      {
        path: 'register',
        name: 'register',
        component: () => import('pages/auth/RegisterPage.vue'),
      },
      {
        path: 'request-reset',
        name: 'request-reset',
        component: () => import('pages/auth/RequestResetPage.vue'),
      },
      {
        path: 'reset-password/:token',
        name: 'reset-password',
        component: () => import('pages/auth/ResetPasswordPage.vue'),
      },
    ],
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
