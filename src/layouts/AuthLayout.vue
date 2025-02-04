<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <q-page class="flex flex-center">
        <q-card class="auth-card q-pa-lg">
          <q-card-section class="text-center">
            <div class="text-h5 q-mb-md">{{ title }}</div>
          </q-card-section>

          <router-view />
        </q-card>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent } from 'vue'
import { useRoute } from 'vue-router'
import { computed } from 'vue'

export default defineComponent({
  name: 'AuthLayout',
  setup() {
    const route = useRoute()

    const title = computed(() => {
      switch (route.name) {
        case 'login':
          return 'Login'
        case 'request-reset':
          return 'Recuperar Senha'
        case 'reset-password':
          return 'Nova Senha'
        default:
          return 'Autenticação'
      }
    })

    return {
      title,
    }
  },
})
</script>

<style lang="scss" scoped>
.auth-card {
  width: 100%;
  max-width: 400px;
  margin: 20px;
}
</style>
