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
        component: () => import('src/pages/TaskPage.vue'),
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
        path: 'reset-password',
        name: 'reset-password',
        component: () => import('pages/auth/ResetPasswordPage.vue'),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
