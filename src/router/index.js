import { route } from 'quasar/wrappers'
import { createRouter, createWebHistory } from 'vue-router'
import routes from './routes'
import { useAuthStore } from 'stores/auth'

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default route(function (/* { store, ssrContext } */) {
  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createWebHistory(process.env.VUE_ROUTER_BASE),
  })

  Router.beforeEach((to, from, next) => {
    const authStore = useAuthStore()
    const isAuthenticated = authStore.isAuthenticated

    // Rota requer autenticação
    if (to.matched.some((record) => record.meta.requiresAuth)) {
      if (!isAuthenticated) {
        next({ name: 'login' })
        return
      }
    }

    // Rota é para visitantes (não autenticados)
    if (to.matched.some((record) => record.meta.guest)) {
      if (isAuthenticated) {
        next({ name: 'task' })
        return
      }
    }

    next()
  })

  return Router
})
